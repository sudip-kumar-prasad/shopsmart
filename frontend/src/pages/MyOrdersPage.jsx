import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Search, ChevronRight, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/Skeleton';
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
      setLoading(true);
      try {
        const { data } = await axios.get('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setOrders(data);
      } catch (error) {
        console.log('Could not fetch orders from backend:', error.message);
        setOrders([]);
      } finally {
        setTimeout(() => setLoading(false), 800);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  if (loading) {
    return (
      <div className="orders-page container">
        <Skeleton height="60px" width="300px" className="mb-4" />
        <Skeleton height="50px" className="mb-8" />
        {[1, 2, 3].map(i => (
          <Skeleton key={i} height="150px" className="mb-4" borderRadius="1rem" />
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      className="orders-page container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
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

      <motion.div 
        className="orders-list"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredOrders.length === 0 ? (
          <div className="orders-empty-state" style={{ textAlign: 'center', padding: '6rem 2rem', background: '#f9fafb', borderRadius: '1rem', marginTop: '1rem' }}>
            <Package size={64} color="#9ca3af" style={{ margin: '0 auto 1.5rem auto' }} />
            <h2 style={{ fontSize: '1.5rem', color: '#111827', marginBottom: '0.5rem' }}>No orders yet</h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Collections you've ordered will appear here.</p>
            <Link to="/shop" style={{ display: 'inline-block', padding: '0.875rem 2.5rem', background: '#111827', color: '#fff', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '500' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          filteredOrders.map(order => (
            <motion.div key={order._id} className="order-item-card" variants={itemVariants}>
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
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default MyOrdersPage;
