import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, Package, MapPin, Settings, LogOut, 
  ChevronRight, Edit2, Plus, ArrowRight, Heart,
  LayoutDashboard, ShoppingBag, Bell, X, Check,
  Trash2
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Tab handling from URL or State
  const queryTab = new URLSearchParams(location.search).get('tab');
  const [activeTab, setActiveTab] = useState(queryTab || 'dashboard');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [newAddress, setNewAddress] = useState({
    name: '',
    addressLine: '',
    city: '',
    postalCode: '',
    country: '',
    isDefault: false
  });

  // Settings State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (queryTab) setActiveTab(queryTab);
  }, [queryTab]);

  const fetchProfile = async () => {
    if (!user?.token) return;
    setLoadingProfile(true);
    try {
      const { data } = await axios.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setProfile(data);
      setPersonalInfo({
        name: data.name,
        email: data.email,
        phone: data.phone || '+91 98765 43210'
      });
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders' || activeTab === 'dashboard') {
      const fetchOrders = async () => {
        if (!user?.token) return;
        setLoadingOrders(true);
        try {
          const { data } = await axios.get('/api/orders/myorders', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setOrders(data);
        } catch (err) {
          console.error('Failed to fetch orders', err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab, user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    try {
      const { data } = await axios.put('/api/users/profile', 
        { name: personalInfo.name, phone: personalInfo.phone },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setProfile(data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await axios.put('/api/users/profile', 
        { password: passwordForm.newPassword },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('Password updated successfully!');
      setIsChangingPassword(false);
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      alert('Failed to update password');
    }
  };

  const handleNotificationToggle = async (key) => {
    const updatedPrefs = {
      ...profile.notificationPrefs,
      [key]: !profile.notificationPrefs?.[key]
    };
    
    // Optimistic update
    setProfile({ ...profile, notificationPrefs: updatedPrefs });
    
    try {
      await axios.put('/api/users/profile', 
        { notificationPrefs: updatedPrefs },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
    } catch (err) {
      alert('Failed to update notifications');
      // Revert if failed
      fetchProfile();
    }
  };

  const handleDeactivateAccount = () => {
    if (window.confirm('Are you SURE you want to delete your account? This cannot be undone.')) {
      alert('Account deactivation request received. This would connect to a DELETE endpoint in a real app.');
      // logout();
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const updatedAddresses = [...(profile.addresses || []), newAddress];
    try {
      const { data } = await axios.put('/api/users/profile', 
        { addresses: updatedAddresses },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setProfile(data);
      setIsAddingAddress(false);
      setNewAddress({ name: '', addressLine: '', city: '', postalCode: '', country: '', isDefault: false });
      alert('Address added successfully!');
    } catch (err) {
      alert('Failed to add address');
    }
  };

  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm('Are you sure you want to remove this address?')) return;
    const updatedAddresses = profile.addresses.filter(a => a._id !== addrId);
    try {
      const { data } = await axios.put('/api/users/profile', 
        { addresses: updatedAddresses },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setProfile(data);
    } catch (err) {
      alert('Failed to remove address');
    }
  };

  const toggleDefaultAddress = async (addrId) => {
    const updatedAddresses = profile.addresses.map(a => ({
      ...a,
      isDefault: a._id === addrId
    }));
    try {
      const { data } = await axios.put('/api/users/profile', 
        { addresses: updatedAddresses },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setProfile(data);
    } catch (err) {
      alert('Failed to set default address');
    }
  };

  if (!user) {
    return (
      <div className="profile-page container" style={{ textAlign: 'center', padding: '10rem 0' }}>
        <h2>You must be logged in to view this page.</h2>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Go to Login</Link>
      </div>
    );
  }

  const renderContent = () => {
    if (loadingProfile && activeTab === 'dashboard') return <p>Loading profile...</p>;

    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="welcome-section">
              <h2>Welcome back, {profile?.name?.split(' ')[0] || user.name?.split(' ')[0] || 'Member'}!</h2>
              <p>From your account dashboard you can view your recent orders and manage your account settings.</p>
            </div>

            <div className="stats-row">
              <div className="stats-card">
                <div className="stats-icon icon-circle orange"><Package size={24} /></div>
                <div className="stats-info">
                  <h4>Total Orders</h4>
                  <p>{orders.length} Orders</p>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-icon icon-circle blue"><ShoppingBag size={24} /></div>
                <div className="stats-info">
                  <h4>Wishlist</h4>
                  <p>{wishlistItems.length} Items</p>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-icon icon-circle green"><Bell size={24} /></div>
                <div className="stats-info">
                  <h4>Member Status</h4>
                  <p>Premium</p>
                </div>
              </div>
            </div>

            <div className="dashboard-sections-grid">
              <div className="dashboard-section-card">
                <div className="section-header">
                  <h3>Personal Information</h3>
                  {!isEditing ? (
                    <button className="edit-link-btn" onClick={() => setIsEditing(true)}><Edit2 size={14} /> Edit</button>
                  ) : (
                    <div className="edit-actions">
                       <button className="save-btn" onClick={handleSaveProfile}><Check size={14} /> Save</button>
                       <button className="cancel-btn" onClick={() => setIsEditing(false)}><X size={14} /></button>
                    </div>
                  )}
                </div>
                <div className="personal-info-content">
                  {isEditing ? (
                    <div className="edit-form">
                      <input type="text" value={personalInfo.name} onChange={e => setPersonalInfo({...personalInfo, name: e.target.value})} placeholder="Full Name" />
                      <input type="email" value={personalInfo.email} readOnly style={{opacity: 0.7}} title="Email cannot be changed" />
                      <input type="text" value={personalInfo.phone} onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})} placeholder="Phone" />
                    </div>
                  ) : (
                    <>
                      <div className="info-row">
                        <span className="info-label">Full Name</span>
                        <span className="info-value">{personalInfo.name || user.name}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Email Address</span>
                        <span className="info-value">{personalInfo.email || user.email}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Phone Number</span>
                        <span className="info-value">{personalInfo.phone || 'Not set'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="dashboard-section-card">
                <div className="section-header">
                  <h3>Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="view-link">View All</button>
                </div>
                <div className="orders-summary-list">
                  {loadingOrders ? <p>Loading...</p> : 
                   orders.length > 0 ? orders.slice(0, 3).map(order => (
                    <div key={order._id} className="order-summary-row">
                      <div className="order-id">#{order._id.slice(-6).toUpperCase()}</div>
                      <div className="order-date">{new Date(order.createdAt).toLocaleDateString()}</div>
                      <div className="order-price">₹{order.totalPrice.toLocaleString()}</div>
                      <div className={`order-status ${order.isPaid ? 'paid' : 'pending'}`}>{order.isPaid ? 'Paid' : 'Pending'}</div>
                    </div>
                  )) : <p className="empty-text">No orders yet.</p>}
                </div>
              </div>
            </div>
          </>
        );

      case 'orders':
        return (
          <div className="tab-view-container">
            <div className="section-header">
              <h2>My Order History</h2>
            </div>
            <div className="orders-history-list">
               {loadingOrders ? <p>Loading orders...</p> : 
                orders.length > 0 ? (
                  orders.map(order => (
                    <div key={order._id} className="history-order-card">
                       <div className="h-order-header">
                          <div className="h-id">Order ID: #{order._id.toUpperCase()}</div>
                          <div className={`h-status ${order.isPaid ? 'paid' : 'pending'}`}>{order.isPaid ? 'Order Paid' : 'Payment Pending'}</div>
                       </div>
                       <div className="h-order-details">
                          <div className="h-date">Placed on: {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                          <div className="h-items-summary">
                             {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                          </div>
                          <div className="h-total">₹{order.totalPrice.toLocaleString()}</div>
                          <button className="btn-details" onClick={() => navigate('/orders')}>Track Order <ArrowRight size={14} /></button>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <ShoppingBag size={48} />
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
                  </div>
                )
               }
            </div>
          </div>
        );

      case 'wishlist':
        return (
          <div className="tab-view-container">
            <div className="section-header">
              <h2>My Wishlist</h2>
              <span className="count-badge">{wishlistItems.length} items saved</span>
            </div>
            <div className="wishlist-grid">
              {wishlistItems.length > 0 ? (
                wishlistItems.map(item => (
                  <div key={item.id} className="wishlist-item-card">
                    <div className="w-img">
                      <img src={item.image} alt={item.name} />
                      <button className="w-remove" onClick={() => removeFromWishlist(item.id)}><Trash2 size={16} /></button>
                    </div>
                    <div className="w-info">
                      <h4>{item.name}</h4>
                      <p className="w-price">₹{item.price.toLocaleString()}</p>
                      <button className="w-add-cart" onClick={() => addItem({...item, qty: 1})}>
                        <Plus size={14} /> ADD TO CART
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <Heart size={48} />
                  <p>Your wishlist is empty.</p>
                  <Link to="/shop" className="btn btn-primary">Browse Shop</Link>
                </div>
              )}
            </div>
          </div>
        );

      case 'addresses':
        return (
          <div className="tab-view-container">
            <div className="section-header">
              <h2>Shipping Addresses</h2>
              <button 
                className="btn btn-secondary" 
                onClick={() => setIsAddingAddress(!isAddingAddress)}
              >
                {isAddingAddress ? <X size={16} /> : <Plus size={16} />} {isAddingAddress ? 'Cancel' : 'Add New'}
              </button>
            </div>

            {isAddingAddress && (
              <form className="add-address-form" onSubmit={handleAddAddress}>
                <h3>New Delivery Address</h3>
                <div className="form-grid">
                  <input required placeholder="Address Name (e.g. Home, Office)" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} />
                  <input required placeholder="Street Address" value={newAddress.addressLine} onChange={e => setNewAddress({...newAddress, addressLine: e.target.value})} />
                  <input required placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                  <input required placeholder="Postal Code" value={newAddress.postalCode} onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} />
                  <input required placeholder="Country" value={newAddress.country} onChange={e => setNewAddress({...newAddress, country: e.target.value})} />
                </div>
                <div className="form-footer">
                  <label>
                    <input type="checkbox" checked={newAddress.isDefault} onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})} /> Set as default address
                  </label>
                  <button type="submit" className="btn btn-primary">Save Address</button>
                </div>
              </form>
            )}

            <div className="address-list">
              {profile?.addresses?.length > 0 ? (
                profile.addresses.map(addr => (
                  <div key={addr._id} className={`address-card ${addr.isDefault ? 'default' : ''}`}>
                    {addr.isDefault && <div className="address-badge">DEFAULT</div>}
                    <h4>{addr.name}</h4>
                    <p>{addr.addressLine}, {addr.city}</p>
                    <p>{addr.postalCode}, {addr.country}</p>
                    <div className="address-actions">
                      {!addr.isDefault && (
                        <button className="action-link" onClick={() => toggleDefaultAddress(addr._id)}>Set as Default</button>
                      )}
                      <button className="action-link delete" onClick={() => handleDeleteAddress(addr._id)}>Remove</button>
                    </div>
                  </div>
                ))
              ) : !isAddingAddress && (
                <div className="empty-state">
                  <MapPin size={48} />
                  <p>No addresses found. Add one to speed up checkout!</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="tab-view-container">
            <div className="section-header">
              <h2>Account Settings</h2>
            </div>
            <div className="settings-options">
              {/* Security Section */}
              <div className="settings-group card">
                <div className="group-header">
                  <Lock size={20} className="group-icon text-indigo-600" />
                  <h3>Security</h3>
                </div>
                {!isChangingPassword ? (
                  <div className="settings-summary">
                    <p>Change your password or manage security settings.</p>
                    <button className="btn-setting-link" onClick={() => setIsChangingPassword(true)}>Change Password</button>
                    <button className="btn-setting-link disabled" disabled>Two-Factor Authentication (Coming Soon)</button>
                  </div>
                ) : (
                  <form className="password-update-form" onSubmit={handlePasswordChange}>
                    <div className="input-field">
                      <label>New Password</label>
                      <input 
                        type="password" 
                        required 
                        value={passwordForm.newPassword} 
                        onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} 
                      />
                    </div>
                    <div className="input-field">
                      <label>Confirm Password</label>
                      <input 
                        type="password" 
                        required 
                        value={passwordForm.confirmPassword} 
                        onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} 
                      />
                    </div>
                    <div className="form-actions">
                      <button type="button" className="action-link" onClick={() => setIsChangingPassword(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary btn-sm">Update Password</button>
                    </div>
                  </form>
                )}
              </div>

              {/* Notifications Section */}
              <div className="settings-group card">
                <div className="group-header">
                  <Bell size={20} className="group-icon text-orange-500" />
                  <h3>Notifications</h3>
                </div>
                <div className="notification-options">
                  <label className="checkbox-setting">
                    <input 
                      type="checkbox" 
                      checked={profile?.notificationPrefs?.orderUpdates} 
                      onChange={() => handleNotificationToggle('orderUpdates')} 
                    /> 
                    <div className="check-text">
                      <strong>Order Updates</strong>
                      <span>Receive email alerts for order status and delivery.</span>
                    </div>
                  </label>
                  <label className="checkbox-setting">
                    <input 
                      type="checkbox" 
                      checked={profile?.notificationPrefs?.promotionalEmails} 
                      onChange={() => handleNotificationToggle('promotionalEmails')} 
                    /> 
                    <div className="check-text">
                      <strong>Exclusive Deals & Offers</strong>
                      <span>Get updates on sales and personalized recommendations.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="settings-group card danger-zone">
                <div className="group-header">
                  <Trash2 size={20} className="group-icon text-red-500" />
                  <h3 className="text-red-600">Danger Zone</h3>
                </div>
                <div className="danger-content">
                  <p>Permanently delete your account and all associated data. This action is irreversible.</p>
                  <button className="btn-danger" onClick={handleDeactivateAccount}>Delete Account</button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a tab</div>;
    }
  };

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
              <h3>{profile?.name || user.name}</h3>
              <span>{profile?.email || user.email}</span>
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
              <Heart size={18} /> WISHLIST {wishlistItems.length > 0 && <span className="badge-side">{wishlistItems.length}</span>}
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
           {renderContent()}
        </main>

      </div>
    </div>
  );
};

export default ProfilePage;

