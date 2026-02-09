import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo">
          Shop<span>Smart</span>
        </Link>
        
        <ul className="nav-links">
          <li><Link to="/shop">Categories</Link></li>
          <li><Link to="/deals">Deals</Link></li>
          <li><Link to="/orders">Orders</Link></li>
        </ul>

        <div className="search-bar">
          <input type="text" placeholder="Search products..." />
          <Search size={18} className="search-icon" />
        </div>

        <div className="nav-actions">
          <Link to="/login" className="nav-icon">
            <User size={22} />
          </Link>
          <Link to="/cart" className="nav-icon cart-icon">
            <ShoppingCart size={22} />
            <span className="cart-count">0</span>
          </Link>
          <button className="mobile-menu-btn">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
