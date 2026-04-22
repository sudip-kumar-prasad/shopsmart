import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { CreditCard, MapPin, ChevronLeft, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [payMethod, setPayMethod] = useState('razorpay');
  const navigate = useNavigate();

  // Address State
  const [addressData, setAddressData] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'IN'
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [selectedAddrId, setSelectedAddrId] = useState(null);

  // Fetch Saved Addresses
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoadingProfile(false);
        return;
      }
      try {
        const { data } = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        if (data.addresses && data.addresses.length > 0) {
          setSavedAddresses(data.addresses);
          
          // Auto-select default address
          const defaultAddr = data.addresses.find(a => a.isDefault) || data.addresses[0];
          if (defaultAddr) {
            handleSelectAddress(defaultAddr);
          }
        }
      } catch (err) {
        console.error('Failed to load profile addresses', err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSelectAddress = (addr) => {
    setSelectedAddrId(addr._id);
    setAddressData({
      ...addressData,
      address: addr.addressLine,
      city: addr.city,
      zip: addr.postalCode,
      country: addr.country,
      state: addr.state || '' // Backend might not have state yet but we'll include it
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({ ...prev, [name]: value }));
    // If user typed, deselect the saved address pill
    setSelectedAddrId(null);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    try {
      const orderData = {
        orderItems: items.map(i => ({ 
          name: i.name, 
          qty: i.qty, 
          image: i.image, 
          price: i.price, 
          product: i._id || i.id 
        })),
        shippingAddress: { 
          address: addressData.address, 
          city: addressData.city, 
          postalCode: addressData.zip, 
          country: addressData.country 
        },
        paymentMethod: payMethod,
        itemsPrice: totalPrice,
        taxPrice: totalPrice * 0.08,
        shippingPrice: 0,
        totalPrice: totalPrice * 1.08,
      };

      const { data: dbOrder } = await axios.post('/api/orders', orderData, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      if (payMethod === 'razorpay') {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          toast.error('Razorpay SDK failed to load. Are you online?');
          return;
        }

        const { data: rpOrderData } = await axios.post('/api/orders/razorpay/create-order', {
          amount: totalPrice * 1.08
        }, {
          headers: { Authorization: `Bearer ${user.token}` }
        });

        if (!rpOrderData.keyId) {
          toast.error('Razorpay configuration is missing. Please contact support or check server env variables.');
          return;
        }

        const options = {
          key: rpOrderData.keyId,
          amount: rpOrderData.amount,
          currency: rpOrderData.currency,
          name: 'ShopSmart',
          description: 'Secure Payment',
          order_id: rpOrderData.orderId,
          handler: async function (response) {
            try {
              await axios.post('/api/orders/razorpay/verify', {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                dbOrderId: dbOrder._id
              }, {
                headers: { Authorization: `Bearer ${user.token}` }
              });
              
              clearCart();
              toast.success('Payment successful & Order placed!');
              navigate('/order-success', { state: { items, totalPrice: totalPrice * 1.08, taxPrice: totalPrice * 0.08 } });
            } catch (err) {
              console.error(err);
              toast.error('Payment verification failed.');
            }
          },
          prefill: {
            name: `${addressData.firstName} ${addressData.lastName}`,
            email: user?.email || '',
            contact: '9999999999'
          },
          theme: {
            color: '#3498db' // primary color approx
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          toast.error(`Payment failed: ${response.error.description}`);
        });
        rzp.open();
      } else {
        // Fallback for non-razorpay logic, though we only support razorpay for now
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/order-success', { state: { items, totalPrice: totalPrice * 1.08, taxPrice: totalPrice * 0.08 } });
      }

    } catch (error) {
      console.error('Order placement failed', error);
      const errorMsg = error.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(errorMsg);
    }
  };

  return (
    <motion.div 
      className="checkout-page container"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
    >
      <div className="checkout-back">
        <Link to="/cart"><ChevronLeft size={16} /> Back to Cart</Link>
      </div>
      
      <h1>Checkout</h1>
      
      <div className="checkout-layout">
        {/* Left Form Area */}
        <div className="checkout-main">
          
          <section className="checkout-card">
            <div className="card-header-row">
              <span className="step-num">1</span>
              <h2>Shipping Address</h2>
            </div>
            
            {/* Saved Addresses Picker */}
            {!loadingProfile && savedAddresses.length > 0 && (
              <div className="saved-addresses-selector">
                <p className="selector-label"><MapPin size={14} /> Choose a saved address:</p>
                <div className="address-pills">
                  {savedAddresses.map(addr => (
                    <button 
                      key={addr._id}
                      type="button"
                      className={`address-pill ${selectedAddrId === addr._id ? 'active' : ''}`}
                      onClick={() => handleSelectAddress(addr)}
                    >
                      <div className="pill-content">
                        <strong>{addr.name}</strong>
                        <span>{addr.addressLine}, {addr.city}</span>
                      </div>
                      {selectedAddrId === addr._id && <CheckCircle2 size={16} className="pill-check" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form className="checkout-form" onSubmit={handlePlaceOrder}>
              <div className="input-row">
                <div className="input-field">
                  <label>First Name</label>
                  <input 
                    name="firstName"
                    type="text" 
                    placeholder="Alex" 
                    required 
                    value={addressData.firstName} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="input-field">
                  <label>Last Name</label>
                  <input 
                    name="lastName"
                    type="text" 
                    placeholder="Thompson" 
                    required 
                    value={addressData.lastName} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              <div className="input-field">
                <label>Street Address</label>
                <input 
                  name="address"
                  type="text" 
                  placeholder="2356 Highland Avenue" 
                  required 
                  value={addressData.address} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="input-row">
                <div className="input-field">
                  <label>City</label>
                  <input 
                    name="city"
                    type="text" 
                    placeholder="Brooklyn" 
                    required 
                    value={addressData.city} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="input-field">
                  <label>State / Province</label>
                  <input 
                    name="state"
                    type="text" 
                    placeholder="NY" 
                    required 
                    value={addressData.state} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              <div className="input-row">
                <div className="input-field">
                  <label>Zip Code</label>
                  <input 
                    name="zip"
                    type="text" 
                    placeholder="11201" 
                    required 
                    value={addressData.zip} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="input-field">
                  <label>Country</label>
                  <select 
                    name="country"
                    required 
                    value={addressData.country} 
                    onChange={handleInputChange}
                  >
                    <option value="US">United States</option>
                    <option value="IN">India</option>
                    <option value="GB">United Kingdom</option>
                    <option value="CA">Canada</option>
                  </select>
                </div>
              </div>
            </form>
          </section>

          <section className="checkout-card">
            <div className="card-header-row">
              <span className="step-num">2</span>
              <h2>Payment Options</h2>
            </div>
            
            <div className="payment-selector">
              <button className={`p-method ${payMethod==='razorpay' ? 'active' : ''}`} onClick={() => setPayMethod('razorpay')}>
                <div className="p-radio"></div>
                <span>Pay via Razorpay</span>
              </button>
              <button className={`p-method ${payMethod==='cod' ? 'active' : ''}`} onClick={() => setPayMethod('cod')}>
                <div className="p-radio"></div>
                <span>Cash on Delivery</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {payMethod === 'razorpay' && (
                <motion.div 
                  className="card-details-form razorpay-details"
                  key="razorpay-form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p style={{ color: '#666', fontSize: '14px', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock size={14} /> You will be redirected to Razorpay to complete your purchase securely. Cards, UPI, and Netbanking are supported.
                  </p>
                </motion.div>
              )}
              {payMethod === 'cod' && (
                <motion.div 
                  className="card-details-form cod-details"
                  key="cod-form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p style={{ color: '#666', fontSize: '14px', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={14} color="#2e7d32" /> Pay with cash when your order arrives at your doorstep. No hidden fees.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* Right Sidebar Summary */}
        <aside className="checkout-sidebar">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-items-list">
              {items.map(item => (
                <div key={item.id} className="s-item">
                  <div className="s-item-img">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="s-item-info">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.qty} • Size: XL</p>
                  </div>
                  <p className="s-item-price">₹{(item.price * item.qty).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="s-row">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="s-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="s-row">
                <span>Estimated Tax</span>
                <span>₹{(totalPrice * 0.08).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <hr />
              <div className="s-row total-row">
                <span>Total</span>
                <span>₹{(totalPrice * 1.08).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button onClick={handlePlaceOrder} className="place-order-btn">
              Place Order Now
            </button>
            
            <p className="secure-text">
              <Lock size={12} /> Secure Checkout - SSL Encrypted
            </p>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
