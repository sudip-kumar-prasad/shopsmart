import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, Lock, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { items, removeItem, updateQty, totalPrice, totalItems } = useCart();

  return (
    <div className="cart-page container">
      <div className="cart-header">
        <h1 className="cart-title">Shopping Cart</h1>
        <p className="cart-subtitle">
          {items.length === 0 
            ? 'Your selection is currently empty.' 
            : `You have ${totalItems} ${totalItems === 1 ? 'item' : 'items'} in your selection.`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="cart-empty success-card">
          <p>Your cart is empty.</p>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <div className="item-meta">
                    <h3>{item.name}</h3>
                    <p className="item-desc">{item.description || 'Premium quality addition to your collection.'}</p>
                  </div>
                  <div className="item-price-row">
                    <p className="item-price">₹{item.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                    <div className="cart-item-actions">
                      <div className="item-qty-selector">
                        <button onClick={() => item.qty > 1 ? updateQty(item.id, item.qty - 1) : removeItem(item.id)}>
                          <Minus size={14} />
                        </button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <button className="remove-link" onClick={() => removeItem(item.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="cart-summary-sidebar">
            <div className="summary-card">
              <h2>Order Summary</h2>
              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <strong>₹{totalPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <strong className="free">Free</strong>
                </div>
                <div className="summary-row">
                  <span>Estimated Tax</span>
                  <strong>₹{(totalPrice * 0.08).toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong>
                </div>
              </div>
              
              <div className="coupon-link">
                <Link to="#">Add coupon code +</Link>
              </div>

              <div className="summary-divider"></div>
              
              <div className="summary-row total-row">
                <span>Total</span>
                <span className="final-price">₹{(totalPrice * 1.08).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              
              <Link to="/checkout" className="proceed-btn">
                Proceed to Checkout
              </Link>
              
              <div className="summary-badges">
                <div className="badge-item">
                  <Lock size={14} />
                  <span>SECURE SSL 256 BIT ENCRYPTION</span>
                </div>
                <div className="badge-item">
                  <RotateCcw size={14} />
                  <span>EASY RETURNS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pairs Perfectly With */}
      <section className="cart-suggestions">
        <h2>Pairs perfectly with</h2>
        <div className="suggestion-grid">
          {[
            { id: 21, name: "Leather Cat's Case", price: 420.00, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=300' },
            { id: 22, name: 'Quick Charge Pad', price: 95.00, image: 'https://images.unsplash.com/photo-1608156639585-34052e35a962?auto=format&fit=crop&q=80&w=300' },
            { id: 23, name: 'Eco Soap Set', price: 65.00, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=300' },
            { id: 24, name: 'Minimal Wallet', price: 85.00, image: 'https://images.unsplash.com/photo-1576833975527-6e82ce15af6b?auto=format&fit=crop&q=80&w=300' },
          ].map(s => (
            <div key={s.id} className="suggest-card">
              <div className="suggest-img">
                <img src={s.image} alt={s.name} />
              </div>
              <div className="suggest-info">
                <h4>{s.name}</h4>
                <p>₹{s.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CartPage;
