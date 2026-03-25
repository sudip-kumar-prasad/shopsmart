import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ListFilter, Heart, ShoppingBag, Star, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import productsData from '../assets/products.json';
import './ShopPage.css';

const ShopPage = () => {
  const [rawProducts, setRawProducts] = useState(productsData);
  const [products, setProducts] = useState(productsData);
  const [topBrands, setTopBrands] = useState([]);
  const [limit, setLimit] = useState(12);

  // Filter States
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceMax, setPriceMax] = useState(200000);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortOption, setSortOption] = useState('Popularity');

  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login?redirect=/shop');
      return;
    }
    addItem(product);
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedBrands([]);
    setPriceMax(200000);
    setSelectedRating(0);
    setSortOption('Popularity');
  };

  // Fetch initial raw products and dynamic brands
  useEffect(() => {
    const fetchProducts = async () => {
      let data = [];
      try {
        const res = await axios.get('/api/products');
        data = res.data;
      } catch (error) {
        console.log('Backend not active, using dummy data fallback for ShopPage');
        data = productsData;
      }
      setRawProducts(data);
      
      // Dynamically extract the top 5 most common brands
      const counts = data.reduce((acc, p) => {
        if (p.brand && p.brand.toLowerCase() !== 'sports') {
          acc[p.brand] = (acc[p.brand] || 0) + 1;
        }
        return acc;
      }, {});
      setTopBrands(Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 5));
    };
    fetchProducts();
  }, []);

  // Main Filtering Pipeline
  useEffect(() => {
    let filtered = [...rawProducts];
    
    // 1. Search Query
    if (searchQuery) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    // 2. Category Check
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    // 3. Price Ceiling
    filtered = filtered.filter(p => p.price <= priceMax);
    
    // 4. Brands Validation
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }
    
    // 5. Rating Validation
    if (selectedRating > 0) {
      filtered = filtered.filter(p => p.rating >= selectedRating);
    }
    
    // 6. Sorting Order
    if (sortOption === 'Popularity') {
      filtered.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));
    } else if (sortOption === 'Newest Arrivals') {
      filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortOption === 'Price: Low to High') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'Price: High to Low') {
      filtered.sort((a, b) => b.price - a.price);
    }
    
    setProducts(filtered);
    setLimit(12); // Reset infinite scroll length
  }, [rawProducts, searchQuery, selectedCategory, selectedBrands, priceMax, selectedRating, sortOption]);

  return (
    <div className="shop-page container">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link> <ChevronRight size={12} /> <span>Shop</span>
      </div>

      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside className="shop-sidebar">
          <div className="filter-card">
            <div className="filter-header">
              <h3>Filters</h3>
              <button className="reset-btn" onClick={handleReset}>Reset All</button>
            </div>
            
            <div className="filter-section">
              <h4>CATEGORY</h4>
              <div className="filter-list">
                <label className={`filter-item ${selectedCategory==='' ? 'active' : ''}`}>
                  <input type="radio" name="cat" checked={selectedCategory===''} onChange={() => setSelectedCategory('')} />
                  <span>All Collections</span>
                </label>
                {['Electronics', 'Fashion', 'Sports'].map(cat => (
                  <label key={cat} className={`filter-item ${selectedCategory===cat ? 'active' : ''}`}>
                    <input type="radio" name="cat" checked={selectedCategory===cat} onChange={() => setSelectedCategory(cat)} />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>PRICE RANGE</h4>
              <div className="price-slider-container">
                <input 
                  type="range" 
                  min="0" 
                  max="200000" 
                  step="1000" 
                  className="price-slider" 
                  value={priceMax} 
                  onChange={(e) => setPriceMax(Number(e.target.value))} 
                />
                <div className="price-labels">
                  <span>₹0</span>
                  <span>₹{priceMax.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="filter-section">
              <h4>BRAND</h4>
              <div className="filter-list">
                {topBrands.length > 0 ? (
                  topBrands.map(brand => (
                    <label key={brand} className="filter-item checkbox">
                      <input 
                        type="checkbox" 
                        checked={selectedBrands.includes(brand)} 
                        onChange={() => handleBrandToggle(brand)} 
                      />
                      <span>{brand}</span>
                    </label>
                  ))
                ) : (
                  <span style={{ fontSize: '0.9rem', color: '#9ca3af' }}>No brands available.</span>
                )}
              </div>
            </div>

            <div className="filter-section">
              <h4>RATINGS</h4>
              <div className="rating-filters">
                {[4, 3, 2, 0].map(rating => (
                  <label key={rating} className="filter-item rating">
                    <input 
                      type="radio" 
                      name="rating" 
                      checked={selectedRating === rating} 
                      onChange={() => setSelectedRating(rating)} 
                    />
                    {rating > 0 ? (
                      <div className="stars-row">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < rating ? "#fbbf24" : "none"} color={i < rating ? "#fbbf24" : "#d1d5db"} />
                        ))}
                        <span>& Up</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.9rem' }}>Any Rating</span>
                    )}
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
              <h1>Explore Collections</h1>
              <p>{products.length} products found</p>
            </div>
            <div className="shop-controls">
              <div className="shop-sort">
                <span>Sort by:</span>
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                  <option>Popularity</option>
                  <option>Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="shop-products-grid">
            {products.slice(0, limit).map(product => (
              <div key={product.id || product._id} className="shop-product-card">
                <div className="shop-img-wrapper">
                  {product.isNew && <span className="new-tag">NEW</span>}
                  <Link to={`/product/${product._id || product.id}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                  <div className="hover-actions">
                    <button className="h-btn"><Heart size={18} /></button>
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
                  <p className="s-price">₹{product.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: '#6b7280' }}>
              <h3>No products match your active filters.</h3>
              <button onClick={handleReset} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#e5e7eb', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>Clear Filters</button>
            </div>
          )}

          {limit < products.length && (
            <div className="shop-load-more">
               <button onClick={() => setLimit(l => l + 12)} className="load-btn">
                 Load More Products
               </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
