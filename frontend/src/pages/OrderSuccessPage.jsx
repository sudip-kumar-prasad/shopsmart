import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, FileText, MessageSquare } from 'lucide-react';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const location = useLocation();
  const { items = [], totalPrice = 0, taxPrice = 0 } = location.state || {};
  const orderId = `ORD-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const subtotal = totalPrice - taxPrice;

  return (
    <div className="order-success-page container">
      <div className="success-header-section">
        <div className="success-icon-wrapper">
          <CheckCircle2 size={64} className="check-icon" />
        </div>
        <h1>Thank You for Your Order!</h1>
        <p className="order-id-label">Order ID: <span>{orderId}</span></p>
      </div>

      <div className="order-details-grid">
        {/* Left Column: Order Summary */}
        <div className="success-card order-summary-section">
          <h3>Order Summary</h3>
          <div className="success-item-list">
            {items.length > 0 ? items.map((item, index) => (
              <div key={index} className="success-item-row">
                <div className="item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>Qty: {item.qty}</p>
                </div>
                <div className="item-price">
                  ₹{(item.price * item.qty).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>
            )) : (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>Your order has been placed successfully!</p>
            )}
          </div>
          <div className="success-totals">
            <div className="r-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="r-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="r-row">
              <span>Tax (8%)</span>
              <span>₹{taxPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
            <hr />
            <div className="r-row sum-total">
              <span>Total Paid</span>
              <span>₹{totalPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Delivery Details & Help */}
        <div className="details-sidebar">
          <div className="success-card delivery-details">
            <h3>Delivery Details</h3>
            <p className="delivery-date">Estimated Delivery: <strong>Within 3-5 business days</strong></p>
            <div className="delivery-address">
              <strong>Shipping to your address</strong>
              <p>You will receive a confirmation email soon.</p>
            </div>
            <div className="shipping-method">
              <ShoppingBag size={18} />
              <div>
                <strong>Standard Express</strong>
                <p>Tracked shipment in 2-4 days</p>
              </div>
            </div>
          </div>

          <div className="help-card">
            <h4>Need Help?</h4>
            <p>Our customer support team is available 24/7 with your order.</p>
            <button className="contact-btn">
              <MessageSquare size={16} /> Contact Support
            </button>
          </div>
        </div>
      </div>

      <div className="success-page-actions">
        <Link to="/shop" className="continue-btn">
          Continue Shopping
        </Link>
        <Link to="/orders" className="download-btn">
          <FileText size={18} /> View My Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
