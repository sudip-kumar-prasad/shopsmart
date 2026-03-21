import React, { useState } from 'react';
import { Package, Search, ChevronRight, MapPin } from 'lucide-react';
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
        <h1 className="page-title">My Orders</h1>
        <div className="orders-search">
          <input type="text" placeholder="Search by order ID or product..." />
          <Search size={18} />
        </div>
      </div>

      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="no-orders text-center">
            <Package size={64} className="mb-4 text-muted" />
            <h2>No orders yet</h2>
            <p>Collections you've ordered will appear here.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-item-card">
              <div className="order-row-header">
                <div className="order-meta">
                  <span className="o-id">{order.id}</span>
                  <span className="o-date">Placed on {order.date}</span>
                </div>
                <div className={`o-status ${order.status.toLowerCase()}`}>{order.status}</div>
              </div>

              <div className="order-row-body">
                {order.items.map((item, idx) => (
                  <div key={idx} className="o-product-info">
                    <div className="o-img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="o-details">
                      <h4>{item.name}</h4>
                      <p>Qty: 1 • Color: Space Black</p>
                    </div>
                  </div>
                ))}
                <div className="o-price-area">
                  <span className="o-total">${order.total.toFixed(2)}</span>
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
