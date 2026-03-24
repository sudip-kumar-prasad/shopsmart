import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, FileText, MessageSquare, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const orderId = "ORD-5290F"; // Static for mockup matching

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const orderItems = [
    { name: 'Air-Max Pro Runner', size: 'US 10', qty: 1, price: 189.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200' },
    { name: 'SmartPulse Watch Series 4', size: 'One Size', qty: 1, price: 299.00, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200' }
  ];

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
            {orderItems.map((item, index) => (
              <div key={index} className="success-item-row">
                <div className="item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>Size: {item.size} • Qty: {item.qty}</p>
                </div>
                <div className="item-price">
                  ₹{item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
          <div className="success-totals">
            <div className="r-row">
              <span>Subtotal</span>
              <span>₹{order?.totalPrice?.toLocaleString() || "518.99"}</span>
            </div>
            <div className="r-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="r-row">
              <span>Tax (8%)</span>
              <span>₹{(order?.taxPrice || 41.51).toLocaleString()}</span>
            </div>
            <hr />
            <div className="r-row sum-total">
              <span>Total Paid</span>
              <span>₹{order?.totalPrice?.toLocaleString() || "518.99"}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Delivery Details & Help */}
        <div className="details-sidebar">
          <div className="success-card delivery-details">
            <h3>Delivery Details</h3>
            <p className="delivery-date">Estimated Delivery: <strong>Friday, Oct 25, 2023</strong></p>
            <div className="delivery-address">
              <strong>Alex Thompson</strong>
              <p>2356 Highland Avenue</p>
              <p>Suite 405, Brooklyn, NY 11201</p>
              <p>United States</p>
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
        <button className="download-btn">
          <FileText size={18} /> Download Invoice
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
