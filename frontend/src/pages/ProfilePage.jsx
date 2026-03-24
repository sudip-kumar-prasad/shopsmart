import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Package, MapPin, Settings, LogOut, 
  ChevronRight, Edit2, Plus, ArrowRight, Heart,
  LayoutDashboard, ShoppingBag, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const recentOrders = [
    { id: '1042', status: 'Delivered', date: 'Oct 12, 2023', total: 120.00, items: 3 },
    { id: '1038', status: 'Shipped', date: 'Sep 28, 2023', total: 45.50, items: 1 }
  ];

  if (!user) {
    return (
      <div className="profile-page container" style={{ textAlign: 'center', padding: '10rem 0' }}>
        <h2>You must be logged in to view this page.</h2>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="profile-page container">
      {/* Breadcrumbs */}
      <div className="profile-breadcrumbs">
        <Link to="/">Home</Link> <ChevronRight size={12} /> <span>My Account</span>
      </div>

      <h1 className="page-title">My Account</h1>

      <div className="profile-layout">
        
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="user-profile-summary">
            <div className="user-avatar-circle">
              <User size={36} color="#fff" />
            </div>
            <div className="user-info-text">
              <h3>{user.name || 'Sudip Prasad'}</h3>
              <span>{user.email || 'sudip@example.com'}</span>
            </div>
          </div>
          
          <nav className="profile-navigation">
            <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <LayoutDashboard size={18} /> DASHBOARD
            </button>
            <button className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              <ShoppingBag size={18} /> ORDERS
            </button>
            <button className={`nav-link ${activeTab === 'wishlist' ? 'active' : ''}`} onClick={() => setActiveTab('wishlist')}>
              <Heart size={18} /> WISHLIST
            </button>
            <button className={`nav-link ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => setActiveTab('addresses')}>
              <MapPin size={18} /> ADDRESS
            </button>
            <button className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <Settings size={18} /> SETTINGS
            </button>
            <button className="nav-link nav-logout" onClick={handleLogout}>
              <LogOut size={18} /> LOGOUT
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="profile-main-area">
          <div className="welcome-section">
            <h2>Welcome back, {user.name?.split(' ')[0] || 'Sudip'}!</h2>
            <p>From your account dashboard you can view your recent orders and manage your account settings.</p>
          </div>

          <div className="stats-row">
            <div className="stats-card">
              <div className="stats-icon icon-circle orange"><Package size={24} /></div>
              <div className="stats-info">
                <h4>Total Orders</h4>
                <p>12 Orders</p>
              </div>
            </div>
            <div className="stats-card">
              <div className="stats-icon icon-circle blue"><ShoppingBag size={24} /></div>
              <div className="stats-info">
                <h4>Pending Orders</h4>
                <p>2 Orders</p>
              </div>
            </div>
            <div className="stats-card">
              <div className="stats-icon icon-circle green"><Bell size={24} /></div>
              <div className="stats-info">
                <h4>Notifications</h4>
                <p>5 New</p>
              </div>
            </div>
          </div>

          <div className="dashboard-sections-grid">
            {/* Personal Information */}
            <div className="dashboard-section-card">
              <div className="section-header">
                <h3>Personal Information</h3>
                <button className="edit-link-btn"><Edit2 size={14} /> Edit</button>
              </div>
              <div className="personal-info-content">
                <div className="info-row">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{user.name || 'Sudip Prasad'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email Address</span>
                  <span className="info-value">{user.email || 'sudip@example.com'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Phone Number</span>
                  <span className="info-value">+1 234 567 8901</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Default Address</span>
                  <span className="info-value">2356 Highland Avenue, Brooklyn, NY 11201</span>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="dashboard-section-card">
              <div className="section-header">
                <h3>Recent Orders</h3>
                <Link to="/orders" className="view-link">View All</Link>
              </div>
              <div className="orders-summary-list">
                {recentOrders.map(order => (
                  <div key={order.id} className="order-summary-row">
                    <div className="order-id">#{order.id}</div>
                    <div className="order-date">{order.date}</div>
                    <div className="order-price">₹{order.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    <div className={`order-status ${order.status.toLowerCase()}`}>{order.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
};

export default ProfilePage;
