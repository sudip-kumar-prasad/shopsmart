import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ListFilter, Heart, ShoppingBag, Star } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import productsData from '../assets/products.json';
import './ShopPage.css';

const ShopPage = () => {
  const [products, setProducts] = useState(productsData);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addToCart } = useCart();
  const [limit, setLimit] = useState(12);

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
      
      let filtered = data;
      if (searchQuery) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      if (selectedCategory) {
        filtered = filtered.filter(p => p.category === selectedCategory);
      }
      setProducts(filtered);
    };
    fetchProducts();
  }, [searchQuery, selectedCategory]);

  return (
    <div className="shop-page container">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / <span>Electronics</span>
      </div>

      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside className="shop-sidebar">
          <div className="filter-group">
            <h3>Filters</h3>
            <div className="filter-category">
              <h4>CATEGORY</h4>
              <ul>
                <li><label><input type="radio" name="cat" checked={selectedCategory===''} onChange={() => setSelectedCategory('')} /> All</label></li>
                <li><label><input type="radio" name="cat" checked={selectedCategory==='Electronics'} onChange={() => setSelectedCategory('Electronics')} /> Electronics</label></li>
                <li><label><input type="radio" name="cat" checked={selectedCategory==='Fashion'} onChange={() => setSelectedCategory('Fashion')} /> Fashion</label></li>
                <li><label><input type="radio" name="cat" checked={selectedCategory==='Sports'} onChange={() => setSelectedCategory('Sports')} /> Sports</label></li>
              </ul>
            </div>

            <div className="filter-price">
              <h4>PRICE RANGE</h4>
              <input type="range" min="0" max="5000" step="100" />
              <div className="price-inputs">
                <span>$0</span>
                <span>$5,000</span>
              </div>
            </div>

            <div className="filter-brand">
              <h4>BRAND</h4>
              <ul>
                <li><label><input type="checkbox" /> Apple</label></li>
                <li><label><input type="checkbox" /> Samsung</label></li>
                <li><label><input type="checkbox" /> Sony</label></li>
              </ul>
            </div>

            <div className="filter-ratings">
              <h4>RATINGS</h4>
              <div className="rating-row">
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <Star size={14} fill="#fbbf24" color="#fbbf24" />
                <Star size={14} color="#d1d5db" />
                <span>& Up</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="shop-main">
          <div className="shop-header">
            <h2>Electronics</h2>
            <div className="shop-sort">
              <span>Sort by:</span>
              <select>
                <option>Popularity</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="products-grid">
            {products.slice(0, limit).map(product => (
              <div key={product.id} className="product-card">
                <div className="product-img-wrapper">
                  {product.isNew && <span className="new-badge">NEW ARRIVAL</span>}
                  <Link to={`/product/${product._id || product.id}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>
                  <div className="product-actions">
                    <button onClick={() => alert('Added to Wishlist!')} className="action-btn"><Heart size={18} /></button>
                    <button onClick={() => addToCart({...product, id: product.id || product._id}, 1)} className="action-btn"><ShoppingBag size={18} /></button>
                  </div>
                </div>
                <div className="product-info">
                  <span className="product-brand">{product.brand}</span>
                  <h3><Link to={`/product/${product._id || product.id}`}>{product.name}</Link></h3>
                  <div className="product-rating">
                    <Star size={14} fill="#fbbf24" color="#fbbf24" />
                    <span>{product.rating} ({product.numReviews} reviews)</span>
                  </div>
                  <p className="product-price">${product.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="shop-pagination">
             <p>Showing {Math.min(limit, products.length)} of {products.length} products</p>
             <div className="pagination-bar">
                <div className="pagination-progress" style={{ width: `${(Math.min(limit, products.length) / products.length) * 100}%` }}></div>
             </div>
             {limit < products.length && (
               <button onClick={() => setLimit(l => l + 12)} className="btn btn-secondary">Load More Products</button>
             )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
