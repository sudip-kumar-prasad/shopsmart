import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ChevronRight, Tag } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import './ShopPage.css'; // Reusing base layout typography
import './DealsPage.css';

const DealsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [limit, setLimit] = useState(12);

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login?redirect=/deals');
      return;
    }
    addItem(product);
  };

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      let data = [];
      try {
        const res = await axios.get('/api/products/deals');
        data = res.data;
      } catch (error) {
        console.log('Backend not active or route not loaded, using fallback');
        // Fallback: sort the dummy data by lowest price and take the top 20
        const productsData = require('../assets/products.json');
        const sorted = [...productsData].sort((a, b) => a.price - b.price);
        data = sorted.slice(0, 20);
      }
      
      let filtered = data;
      if (searchQuery) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      if (selectedCategory) {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }
      setProducts(filtered);
      setLoading(false);
    };
    fetchDeals();
  }, [searchQuery, selectedCategory]);

  return (
    <div className="shop-page container">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link> <ChevronRight size={12} /> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Clearance Deals</span>
      </div>

      {/* Deals Header Banner */}
      <div className="deals-banner">
        <div className="deals-banner-content">
          <h1>Flash Deals & Clearance</h1>
          <p>Unbeatable prices on premium merchandise. These deals won't last long.</p>
        </div>
        <div className="deals-banner-icon">
          <Tag size={64} color="#fecaca" />
        </div>
      </div>

      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside className="shop-sidebar">
          <div className="filter-card">
            <div className="filter-header">
              <h3>Filters</h3>
              <button className="reset-btn" onClick={() => setSelectedCategory('')}>Reset All</button>
            </div>
            
            <div className="filter-section">
              <h4>CATEGORY</h4>
              <div className="filter-list">
                <label className={`filter-item ${selectedCategory==='' ? 'active' : ''}`}>
                  <input type="radio" name="cat" checked={selectedCategory===''} onChange={() => setSelectedCategory('')} />
                  <span>All Sales</span>
                </label>
                {['Electronics', 'Fashion', 'Sports'].map(cat => (
                  <label key={cat} className={`filter-item ${selectedCategory===cat ? 'active' : ''}`}>
                    <input type="radio" name="cat" checked={selectedCategory===cat} onChange={() => setSelectedCategory(cat)} />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="shop-main">
          <div className="shop-header">
            <div className="shop-title-area">
              <h2>Top {products.length} Deals</h2>
            </div>
          </div>

          <div className="shop-products-grid">
            {products.slice(0, limit).map(product => (
              <div key={product.id || product._id} className="shop-product-card deals-card">
                <div className="shop-img-wrapper deals-img-wrapper">
                  <div className="sale-badge flash-sale">
                    <span className="sale-text">CLEARANCE</span>
                  </div>
                  <Link to={`/product/${product._id || product.id}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                  <div className="hover-actions">
                    <button 
                      className={`h-btn ${isInWishlist(product._id || product.id) ? 'active' : ''}`}
                      onClick={() => toggleWishlist(product)}
                    >
                      <Heart size={18} fill={isInWishlist(product._id || product.id) ? "currentColor" : "none"} />
                    </button>
                    <button onClick={() => handleAddToCart({...product, id: product.id || product._id, qty: 1})} className="h-btn active"><ShoppingBag size={18} /></button>
                  </div>
                </div>
                <div className="shop-product-info">
                  <p className="s-brand">{product.brand}</p>
                  <h3><Link to={`/product/${product._id || product.id}`}>{product.name}</Link></h3>
                  <div className="s-rating">
                    <Star size={12} fill="#fbbf24" color="#fbbf24" />
                    <span>{product.rating}</span>
                  </div>
                  <div className="price-container">
                    <p className="s-price deal-price">₹{product.price.toLocaleString()}</p>
                    {/* Simulated original price for visual effect since we don't have standard price stored differently */}
                    <p className="s-price original-price">₹{(product.price * 1.4).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#6b7280' }}>
              <h3>No deals found in this category.</h3>
            </div>
          )}

          {limit < products.length && (
            <div className="shop-load-more">
               <button onClick={() => setLimit(l => l + 12)} className="load-btn deals-btn">
                 Load More Deals
               </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DealsPage;
