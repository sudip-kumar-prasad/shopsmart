import React from 'react';
import { Mail, Facebook, Twitter, Instagram } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="logo">Shop<span>Smart</span></div>
          <p>Elevating everyday commerce through a curated digital experience. Quality over quantity, always.</p>
          <div className="social-links">
            <a href="#"><Facebook size={20} /></a>
            <a href="#"><Twitter size={20} /></a>
            <a href="#"><Instagram size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Shop</h3>
          <ul>
            <li><a href="#">Categories</a></li>
            <li><a href="#">New Arrivals</a></li>
            <li><a href="#">Weekly Deals</a></li>
            <li><a href="#">Exclusive Drops</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Company</h3>
          <ul>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">Support</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h3>Join the Circle</h3>
          <p>Subscribe for early access and exclusive updates.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="email@address.com" />
            <button onClick={() => alert('Thanks for subscribing!')} className="btn-primary">Join</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>&copy; 2024 ShopSmart Global. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
