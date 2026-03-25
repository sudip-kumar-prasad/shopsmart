import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Search, ChevronRight, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './MyOrdersPage.css';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/orders');
      return;
    }
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setOrders(data);
      } catch (error) {
        console.log('Could not fetch orders from backend:', error.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      order._id?.toLowerCase().includes(q) ||
      order.orderItems?.some(item => item.name?.toLowerCase().includes(q))
    );
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="orders-page container" style={{ textAlign: 'center', padding: '4rem' }}>
        <p style={{ color: '#6b7280' }}>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-page container">
      <div className="orders-header">
        <h1 className="page-title">My Orders</h1>
        <div className="orders-search">
          <input
            type="text"
            placeholder="Search by order ID or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} />
        </div>
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="no-orders text-center">
            <Package size={64} className="mb-4 text-muted" />
            <h2>No orders yet</h2>
            <p>Collections you've ordered will appear here.</p>
            <Link to="/shop" style={{ marginTop: '1rem', display: 'inline-block', padding: '0.75rem 2rem', background: '#111827', color: '#fff', borderRadius: '0.5rem', textDecoration: 'none' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order._id} className="order-item-card">
              <div className="order-row-header">
                <div className="order-meta">
                  <span className="o-id">#{order._id?.slice(-8).toUpperCase()}</span>
                  <span className="o-date">Placed on {formatDate(order.createdAt)}</span>
                </div>
                <div className={`o-status ${order.isDelivered ? 'delivered' : order.isPaid ? 'processing' : 'pending'}`}>
                  {order.isDelivered ? 'Delivered' : order.isPaid ? 'Processing' : 'Pending'}
                </div>
              </div>

              <div className="order-row-body">
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="o-product-info">
                    <div className="o-img">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div style={{ width: '60px', height: '60px', background: '#f3f4f6', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ShoppingBag size={24} color="#9ca3af" />
                        </div>
                      )}
                    </div>
                    <div className="o-details">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.qty} • ₹{item.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                <div className="o-price-area">
                  <span className="o-total">₹{order.totalPrice?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="order-row-footer">
                <button className="link-action">Track Package</button>
                <button className="link-action secondary">View Details <ChevronRight size={14} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
