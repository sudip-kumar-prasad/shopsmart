import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { items, removeItem, updateQty, totalPrice } = useCart();

  return (
    <div className="cart-page container">
      <h1>Your Selection</h1>

      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <span className="cart-item-brand">{item.brand}</span>
                  <h3>{item.name}</h3>
                  <button className="remove-btn" onClick={() => removeItem(item.id)}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-controls">
                    <button onClick={() => item.qty > 1 ? updateQty(item.id, item.qty - 1) : removeItem(item.id)}>
                      <Minus size={14} />
                    </button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="cart-item-price">${(item.price * item.qty).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free">Free</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>${(totalPrice * 0.08).toFixed(2)}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${(totalPrice * 1.08).toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn btn-cta-cart checkout-btn">
              Continue to Checkout <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}

      {/* Pairs Well With */}
      {items.length > 0 && (
        <section className="cart-suggestions section">
          <h2>Pairs perfectly with</h2>
          <div className="suggestion-grid">
            {[
              { id: 21, name: 'Leather Tote Cafe', price: 420, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=300' },
              { id: 22, name: 'Leather Tech Case', price: 95, image: 'https://images.unsplash.com/photo-1608156639585-34052e35a962?auto=format&fit=crop&q=80&w=300' },
              { id: 23, name: 'Organic Soap Set', price: 65, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=300' },
              { id: 24, name: 'Minimal Wallet', price: 85, image: 'https://images.unsplash.com/photo-1576833975527-6e82ce15af6b?auto=format&fit=crop&q=80&w=300' },
            ].map(s => (
              <div key={s.id} className="suggestion-card">
                <img src={s.image} alt={s.name} />
                <h4>{s.name}</h4>
                <p>${s.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CartPage;
