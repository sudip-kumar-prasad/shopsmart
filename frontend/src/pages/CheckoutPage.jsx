import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Wallet, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { items, totalPrice } = useCart();
  const [payMethod, setPayMethod] = useState('card');

  return (
    <div className="checkout-page container">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        {/* Left Form */}
        <div className="checkout-forms">
          {/* Shipping Address */}
          <div className="checkout-section">
            <h2><MapPin size={20} /> Shipping Address</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" placeholder="Alex" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" placeholder="Johnson" />
              </div>
              <div className="form-group full-width">
                <label>Address Line</label>
                <input type="text" placeholder="123 Main Street" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" placeholder="New York" />
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input type="text" placeholder="10001" />
              </div>
              <div className="form-group full-width">
                <label>Country</label>
                <select><option>United States</option><option>India</option></select>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="checkout-section">
            <h2><CreditCard size={20} /> Payment Options</h2>
            <div className="payment-methods">
              {['card', 'paypal', 'gpay', 'upi'].map(m => (
                <button
                  key={m}
                  className={`payment-btn ${payMethod === m ? 'active' : ''}`}
                  onClick={() => setPayMethod(m)}
                >
                  {m === 'card' ? '💳' : m === 'paypal' ? 'PayPal' : m === 'gpay' ? 'G Pay' : 'UPI'}
                </button>
              ))}
            </div>
            {payMethod === 'card' && (
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Card Number</label>
                  <input type="text" placeholder="4242 4242 4242 4242" />
                </div>
                <div className="form-group">
                  <label>Expiry</label>
                  <input type="text" placeholder="MM / YY" />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input type="text" placeholder="•••" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          {items.map(item => (
            <div key={item.id} className="summary-item">
              <img src={item.image} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <span>Qty: {item.qty}</span>
              </div>
              <p>${(item.price * item.qty).toFixed(2)}</p>
            </div>
          ))}
          <div className="summary-divider"></div>
          <div className="summary-row"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span className="free">Free</span></div>
          <div className="summary-row"><span>Tax (8%)</span><span>${(totalPrice * 0.08).toFixed(2)}</span></div>
          <div className="summary-divider"></div>
          <div className="summary-row total"><span>TOTAL</span><span>${(totalPrice * 1.08).toFixed(2)}</span></div>
          <Link to="/order-success" className="btn btn-cta-cart checkout-btn">
            Confirm Purchase
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
