import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/shop?search=${searchTerm}`);
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
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
          <Search className="search-icon" size={18} />
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
            <input type="text" placeholder="Search for products..." />
            <Search className="search-icon" size={18} />
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
