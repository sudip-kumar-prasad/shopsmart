import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  // Clear cart on mount
  useEffect(() => {
    clearCart();
    // In a real app, this should only happen if coming from checkout
  }, []);

  return (
    <div className="order-success-page container">
      <div className="success-content">
        <CheckCircle2 size={80} color="#16a34a" strokeWidth={1.5} />
        <h1>Order Confirmed!</h1>
        <p className="order-number">Order #ORD-{Math.floor(100000 + Math.random() * 900000)}</p>
        
        <p className="success-desc">
          Thank you for your purchase. We've received your order and will begin processing it right away. 
          A confirmation email has been sent to your provided email address.
        </p>

        <div className="success-actions">
          <Link to="/orders" className="btn btn-secondary action-btn">
            <Package size={18} /> View My Orders
          </Link>
          <Link to="/shop" className="btn btn-cta-cart action-btn">
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
