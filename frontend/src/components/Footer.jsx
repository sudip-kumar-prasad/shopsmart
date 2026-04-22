import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Facebook, Twitter, Instagram } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="logo" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>Shop<span>Smart</span></Link>
          <p>Elevating everyday commerce through a curated digital experience. Quality over quantity, always.</p>
        </div>

        <div className="footer-links">
          <h3>Store</h3>
          <ul>
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/deals">Weekly Deals</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Account</h3>
          <ul>
            <li><Link to="/profile">My Profile</Link></li>
            <li><Link to="/orders">Order History</Link></li>
            <li><Link to="/profile?tab=wishlist">My Wishlist</Link></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h3>Join the Circle</h3>
          <p>Subscribe for early access and exclusive updates.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="email@address.com" />
            <button onClick={() => alert('Thanks for subscribing!')}>Join</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>&copy; 2026 ShopSmart Global. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
