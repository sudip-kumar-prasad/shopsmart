import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, LogOut, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sync the local search bar text with the URL when navigating back/forward
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('search');
    if (query !== null) {
      setSearchTerm(query);
    } else if (location.pathname !== '/shop') {
      setSearchTerm('');
    }
  }, [location.search, location.pathname]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    
    // Live search as the user types
    if (val.trim()) {
      navigate(`/shop?search=${encodeURIComponent(val)}`);
    } else if (location.pathname === '/shop') {
      // If they delete everything, just show all products on the shop page
      navigate('/shop');
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          Shop<span>Smart</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          <Link to="/shop">Shop</Link>
          <Link to="/deals">Deals</Link>
          <Link to="/orders">Orders</Link>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <input 
            type="text" 
            placeholder="Search for products..." 
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleSearch}
          />
          <Search 
            className="search-icon" 
            size={18} 
            onClick={() => {
              if (searchTerm.trim()) {
                navigate(`/shop?search=${searchTerm}`);
                setIsMenuOpen(false);
              }
            }}
            style={{ cursor: 'pointer' }}
          />
        </div>

        {/* Icons Area */}
        <div className="navbar-icons">
          {user ? (
            <div className="user-menu">
              <Link to="/profile" className="user-name" style={{textDecoration: 'none'}}>Hi, {user.name.split(' ')[0]}</Link>
              <button onClick={logout} className="icon-link logout-btn" title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="icon-link" title="Login / Register">
              <User size={22} />
            </Link>
          )}

          <Link to="/profile?tab=wishlist" className="icon-link wishlist-btn" title="Wishlist">
            <Heart size={22} />
          </Link>

          <button className="icon-link cart-btn" onClick={() => navigate('/cart')}>
            <ShoppingBag size={22} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu container">
           <div className="navbar-search mobile">
            <input 
              type="text" 
              placeholder="Search for products..." 
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleSearch}
            />
            <Search 
              className="search-icon" 
              size={18} 
              onClick={() => {
                if (searchTerm.trim()) {
                  navigate(`/shop?search=${searchTerm}`);
                  setIsMenuOpen(false);
                }
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <Link to="/shop" onClick={() => setIsMenuOpen(false)}>Shop</Link>
          <Link to="/deals" onClick={() => setIsMenuOpen(false)}>Deals</Link>
          <Link to="/orders" onClick={() => setIsMenuOpen(false)}>Orders</Link>
          {user ? (
            <button className="mobile-logout" onClick={() => { logout(); setIsMenuOpen(false); }}>Logout</button>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>Account / Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
