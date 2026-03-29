import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  User, Package, MapPin, Settings, LogOut, 
  ChevronRight, Edit2, Plus, ArrowRight, Heart,
  LayoutDashboard, ShoppingBag, Bell, X, Check,
  Trash2, Lock
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Skeleton from '../components/Skeleton';
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
      setTimeout(() => setLoadingProfile(false), 800);
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
          setTimeout(() => setLoadingOrders(false), 800);
        }
      };
      fetchOrders();
    }
  }, [activeTab, user]);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
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
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await axios.put('/api/users/profile', 
        { password: passwordForm.newPassword },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success('Password updated successfully!');
      setIsChangingPassword(false);
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error('Failed to update password');
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
      toast.success('Preferences updated');
    } catch (err) {
      toast.error('Failed to update notifications');
      // Revert if failed
      fetchProfile();
    }
  };

  const handleDeactivateAccount = () => {
    toast((t) => (
      <span>
        Are you sure? This cannot be undone.
        <button className="btn btn-danger btn-sm ml-2" onClick={() => {
          toast.dismiss(t.id);
          toast.success('Account deletion request received.');
        }}>Confirm</button>
      </span>
    ));
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
      toast.success('Address added successfully!');
    } catch (err) {
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (addrId) => {
    const updatedAddresses = profile.addresses.filter(a => a._id !== addrId);
    try {
      const { data } = await axios.put('/api/users/profile', 
        { addresses: updatedAddresses },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setProfile(data);
      toast.info('Address removed');
    } catch (err) {
      toast.error('Failed to remove address');
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
      toast.success('Default address updated');
    } catch (err) {
      toast.error('Failed to set default address');
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

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const renderContent = () => {
    if (loadingProfile && activeTab === 'dashboard') {
      return (
        <div className="profile-skeleton-view">
          <Skeleton height="100px" className="mb-8" />
          <div className="stats-row mb-8">
            <Skeleton width="30%" height="100px" />
            <Skeleton width="30%" height="100px" />
            <Skeleton width="30%" height="100px" />
          </div>
          <div className="dashboard-sections-grid">
            <Skeleton height="300px" />
            <Skeleton height="300px" />
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div className="welcome-section" variants={itemVariants}>
              <h2>Welcome back, {profile?.name?.split(' ')[0] || user.name?.split(' ')[0] || 'Member'}!</h2>
              <p>From your account dashboard you can view your recent orders and manage your account settings.</p>
            </motion.div>

            <motion.div className="stats-row" variants={itemVariants}>
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
            </motion.div>

            <div className="dashboard-sections-grid">
              <motion.div className="dashboard-section-card" variants={itemVariants}>
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
              </motion.div>

              <motion.div className="dashboard-section-card" variants={itemVariants}>
                <div className="section-header">
                  <h3>Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="view-link">View All</button>
                </div>
                <div className="orders-summary-list">
                  {loadingOrders ? <Skeleton height="200px" /> : 
                   orders.length > 0 ? orders.slice(0, 3).map(order => (
                    <div key={order._id} className="order-summary-row">
                      <div className="order-id">#{order._id.slice(-6).toUpperCase()}</div>
                      <div className="order-date">{new Date(order.createdAt).toLocaleDateString()}</div>
                      <div className="order-price">₹{order.totalPrice.toLocaleString()}</div>
                      <div className={`order-status ${order.isPaid ? 'paid' : 'pending'}`}>{order.isPaid ? 'Paid' : 'Pending'}</div>
                    </div>
                  )) : (
                    <div className="dashboard-empty-orders" style={{ textAlign: 'center', padding: '3rem 1rem', background: '#f8fafc', borderRadius: '0.75rem', marginTop: '1rem', border: '2px dashed #e2e8f0' }}>
                      <Package size={32} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
                      <p style={{ color: '#475569', fontWeight: '600', fontSize: '0.95rem', margin: '0 0 0.25rem 0' }}>No recent orders</p>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>When you place an order, it will appear here.</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        );

      case 'orders':
        return (
          <motion.div className="tab-view-container" variants={containerVariants} initial="hidden" animate="visible">
            <div className="section-header">
              <h2>My Order History</h2>
            </div>
            <div className="orders-history-list">
               {loadingOrders ? [1, 2, 3].map(i => <Skeleton key={i} height="100px" className="mb-4" />) : 
                orders.length > 0 ? (
                  orders.map(order => (
                    <motion.div key={order._id} className="history-order-card" variants={itemVariants}>
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
                       </div>
                    </motion.div>
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
          </motion.div>
        );

      case 'wishlist':
        return (
          <motion.div className="tab-view-container" variants={containerVariants} initial="hidden" animate="visible">
            <div className="section-header">
              <h2>My Wishlist</h2>
              <span className="count-badge">{wishlistItems.length} items saved</span>
            </div>
            <div className="wishlist-grid">
              {wishlistItems.length > 0 ? (
                wishlistItems.map(item => (
                  <motion.div key={item.id} className="wishlist-item-card" variants={itemVariants}>
                    <div className="w-img">
                      <img src={item.image} alt={item.name} />
                      <button className="w-remove" onClick={() => {
                        removeFromWishlist(item.id);
                        toast.info('Removed from wishlist');
                      }}><Trash2 size={16} /></button>
                    </div>
                    <div className="w-info">
                      <h4>{item.name}</h4>
                      <p className="w-price">₹{item.price.toLocaleString()}</p>
                      <button className="w-add-cart" onClick={() => {
                        addItem({...item, qty: 1});
                        toast.success('Added to cart!');
                      }}>
                        <Plus size={14} /> ADD TO CART
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="empty-state">
                  <Heart size={48} />
                  <p>Your wishlist is empty.</p>
                  <Link to="/shop" className="btn btn-primary">Browse Shop</Link>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 'addresses':
        return (
          <motion.div className="tab-view-container" variants={containerVariants} initial="hidden" animate="visible">
            <div className="section-header">
              <h2>Shipping Addresses</h2>
              <button 
                className="btn btn-secondary" 
                onClick={() => setIsAddingAddress(!isAddingAddress)}
              >
                {isAddingAddress ? <X size={16} /> : <Plus size={16} />} {isAddingAddress ? 'Cancel' : 'Add New'}
              </button>
            </div>

            <AnimatePresence>
              {isAddingAddress && (
                <motion.form 
                  className="add-address-form" 
                  onSubmit={handleAddAddress}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
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
                </motion.form>
              )}
            </AnimatePresence>

            <div className="address-list">
              {profile?.addresses?.length > 0 ? (
                profile.addresses.map(addr => (
                  <motion.div key={addr._id} className={`address-card ${addr.isDefault ? 'default' : ''}`} variants={itemVariants}>
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
                  </motion.div>
                ))
              ) : !isAddingAddress && (
                <div className="empty-state">
                  <MapPin size={48} />
                  <p>No addresses found. Add one to speed up checkout!</p>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div className="tab-view-container" variants={containerVariants} initial="hidden" animate="visible">
            <div className="section-header">
              <h2>Account Settings</h2>
            </div>
            <div className="settings-options">
              {/* Security Section */}
              <motion.div className="settings-group card" variants={itemVariants}>
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
              </motion.div>

              {/* Notifications Section */}
              <motion.div className="settings-group card" variants={itemVariants}>
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
              </motion.div>

              {/* Danger Zone */}
              <motion.div className="settings-group card danger-zone" variants={itemVariants}>
                <div className="group-header">
                  <Trash2 size={20} className="group-icon text-red-500" />
                  <h3 className="text-red-600">Danger Zone</h3>
                </div>
                <div className="danger-content">
                  <p>Permanently delete your account and all associated data. This action is irreversible.</p>
                  <button className="btn-danger" onClick={handleDeactivateAccount}>Delete Account</button>
                </div>
              </motion.div>
            </div>
          </motion.div>
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
