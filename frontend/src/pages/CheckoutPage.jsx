import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, ChevronLeft, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [payMethod, setPayMethod] = useState('card');
  const navigate = useNavigate();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    try {
      const orderData = {
        orderItems: items.map(i => ({ ...i, product: i._id || i.id })),
        shippingAddress: { address: '123 Main St', city: 'NY', postalCode: '10001', country: 'US' },
        paymentMethod: payMethod,
        itemsPrice: totalPrice,
        taxPrice: totalPrice * 0.08,
        shippingPrice: 0,
        totalPrice: totalPrice * 1.08,
      };

      await axios.post('/api/orders', orderData, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('shopsmart_user'))?.token}` }
      });
      
      clearCart();
      navigate('/order-success');
    } catch (error) {
      console.log('Backend not available, using localized fallback');
      clearCart();
      navigate('/order-success');
    }
  };

  return (
    <div className="checkout-page container">
      <div className="checkout-back">
        <Link to="/cart"><ChevronLeft size={16} /> Back to Cart</Link>
      </div>
      
      <h1>Checkout</h1>
      
      <div className="checkout-layout">
        {/* Left Form Area */}
        <div className="checkout-main">
          <section className="checkout-card">
            <div className="card-header-row">
              <span className="step-num">1</span>
              <h2>Shipping Address</h2>
            </div>
            
            <form className="checkout-form">
              <div className="input-row">
                <div className="input-field">
                  <label>First Name</label>
                  <input type="text" placeholder="Alex" required />
                </div>
                <div className="input-field">
                  <label>Last Name</label>
                  <input type="text" placeholder="Thompson" required />
                </div>
              </div>
              <div className="input-field">
                <label>Street Address</label>
                <input type="text" placeholder="2356 Highland Avenue" required />
              </div>
              <div className="input-row">
                <div className="input-field">
                  <label>City</label>
                  <input type="text" placeholder="Brooklyn" required />
                </div>
                <div className="input-field">
                  <label>State / Province</label>
                  <input type="text" placeholder="NY" required />
                </div>
              </div>
              <div className="input-row">
                <div className="input-field">
                  <label>Zip Code</label>
                  <input type="text" placeholder="11201" required />
                </div>
                <div className="input-field">
                  <label>Country</label>
                  <select required>
                    <option value="US">United States</option>
                    <option value="IN">India</option>
                  </select>
                </div>
              </div>
            </form>
          </section>

          <section className="checkout-card">
            <div className="card-header-row">
              <span className="step-num">2</span>
              <h2>Payment Options</h2>
            </div>
            
            <div className="payment-selector">
              <button className={`p-method ${payMethod==='card' ? 'active' : ''}`} onClick={() => setPayMethod('card')}>
                <div className="p-radio"></div>
                <span>Credit Card / Debit Card</span>
              </button>
              <button className={`p-method ${payMethod==='paypal' ? 'active' : ''}`} onClick={() => setPayMethod('paypal')}>
                <div className="p-radio"></div>
                <span>PayPal</span>
              </button>
              <button className={`p-method ${payMethod==='gpay' ? 'active' : ''}`} onClick={() => setPayMethod('gpay')}>
                <div className="p-radio"></div>
                <span>Google Pay</span>
              </button>
            </div>

            {payMethod === 'card' && (
              <div className="card-details-form">
                <div className="input-field">
                  <label>Card Number</label>
                  <input type="text" placeholder="0000 0000 0000 0000" />
                </div>
                <div className="input-row">
                  <div className="input-field">
                    <label>Expiry Date</label>
                    <input type="text" placeholder="MM / YY" />
                  </div>
                  <div className="input-field">
                    <label>CVV</label>
                    <input type="password" placeholder="***" />
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Sidebar Summary */}
        <aside className="checkout-sidebar">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-items-list">
              {items.map(item => (
                <div key={item.id} className="s-item">
                  <div className="s-item-img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="s-item-info">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.qty} • Size: XL</p>
                  </div>
                  <p className="s-item-price">${(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="s-row">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="s-row">
                <span>Shipping</span>
                <span className="s-free">FREE</span>
              </div>
              <div className="s-row">
                <span>Estimated Tax</span>
                <span>${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <div className="s-divider"></div>
              <div className="s-row s-total">
                <span>Total Amount</span>
                <span>${(totalPrice * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <button onClick={handlePlaceOrder} className="place-order-btn">
              Place Order Now
            </button>
            
            <p className="secure-text">
              <Lock size={12} /> Secure Checkout - SSL Encrypted
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
