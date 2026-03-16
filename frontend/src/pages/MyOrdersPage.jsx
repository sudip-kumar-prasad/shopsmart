import React, { useState } from 'react';
import { Package, Search, ChevronRight } from 'lucide-react';
import './MyOrdersPage.css';

const dummyOrders = [
  {
    id: 'ORD-849201',
    date: 'March 09, 2026',
    status: 'Processing',
    total: 349.00,
    items: [
      { name: 'AmpFlow Pro DAC', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=150' }
    ]
  },
  {
    id: 'ORD-723041',
    date: 'February 25, 2026',
    status: 'Delivered',
    total: 1199.00,
    items: [
      { name: 'Nexus Pro Max', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=150' }
    ]
  }
];

const MyOrdersPage = () => {
  const [orders] = useState(dummyOrders);

  return (
    <div className="orders-page container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <div className="orders-search">
          <input type="text" placeholder="Search by order ID or product..." />
          <Search size={18} />
        </div>
      </div>

      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="no-orders">
            <Package size={48} />
            <h2>No orders yet</h2>
            <p>When you place an order, it will appear here.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">{order.id}</span>
                  <span className="order-date">Placed on {order.date}</span>
                </div>
                <div className="order-status-total">
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <span className="order-total">${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="order-items-preview">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item-mini">
                    <img src={item.image} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <button className="btn-link">Track Package</button>
                <button className="btn-link">View Details <ChevronRight size={16} /></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
