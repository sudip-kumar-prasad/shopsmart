import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import './HomePage.css';

const HomePage = () => {
  const [featured, setFeatured] = useState(featuredProducts);
  const [trendingProduct, setTrendingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login?redirect=/');
      return;
    }
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleScroll = (dir) => {
    const grid = document.querySelector('.featured-section .products-grid');
    if (grid) {
      grid.scrollBy({ left: dir === 'next' ? 300 : -300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/products');
        
        try {
          const { data: trendingData } = await axios.get('/api/products/trending');
          if (trendingData && trendingData.length > 0) {
            setTrendingProduct(trendingData[0]);
          }
        } catch (tErr) {
          console.warn('Failed to fetch trending product', tErr);
        }
        // Take first 8 as featured so there are items to scroll through
        if (data && data.length >= 4) {
          const latestProducts = data.slice(0, 8).map((p, i) => ({
            id: p._id,
            name: p.name,
            brand: p.brand,
            price: p.price,
            bg: featuredProducts[i % 4].bg, // retain the stylistic bg from UI design
            image: p.image
          }));
          setFeatured(latestProducts);
        }
      } catch (err) {
        console.log('Backend not active, using default featured layout');
      }
      setLoading(false);
    };
    fetchFeatured();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div 
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="hero-section container">
        <motion.div 
          className="hero-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="hero-content" variants={itemVariants}>
            <span className="hero-badge">SUMMER COLLECTION 2024</span>
            <h1>Define Your<br/>Modern<br/>Style.</h1>
            <p>Curated selections from global artisans, delivered with the precision your lifestyle demands.</p>
            <div className="hero-btns">
              <button onClick={() => navigate('/shop')} className="btn btn-primary-orange">Shop New Arrivals</button>
              <button onClick={() => navigate('/shop')} className="btn btn-secondary-white">View Lookbook</button>
            </div>
          </motion.div>
          <motion.div className="hero-image" variants={itemVariants}>
            <div className="image-placeholder">
              <div className="placeholder-icon" style={{width: '100%', height: '100%', borderRadius: '1rem', overflow: 'hidden'}}>
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1000" alt="Hero Fashion" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="categories-section container section">
        <div className="section-header">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2>Browse by Category</h2>
            <p>Explore our curated collections of premium goods.</p>
          </motion.div>
        </div>
        <motion.div 
          className="categories-masonry"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Electronics */}
          <motion.div className="category-card cat-electronics" variants={itemVariants}>
            <div className="category-info">
              <div className="category-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 14.899A7 7 0 1 1 20 14.9V19a2 2 0 0 1-2 2h-1.5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h1.5M4 14.9V19a2 2 0 0 0 2 2h1.5a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H6"/></svg></div>
              <h3>Electronics</h3>
              <p>Next-gen performance tools.</p>
            </div>
          </motion.div>

          {/* Fashion */}
          <motion.div className="category-card cat-fashion" variants={itemVariants}>
            <div className="category-info">
              <div className="category-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/></svg></div>
              <h3>Fashion</h3>
              <p>Sustainable, timeless apparel.</p>
            </div>
          </motion.div>

          {/* Home */}
          <motion.div className="category-card cat-home" variants={itemVariants}>
            <div className="category-info">
              <div className="category-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
              <h3>Home</h3>
              <p>Art for the living space.</p>
            </div>
          </motion.div>

          {/* Sports */}
          <motion.div className="category-card cat-sports" variants={itemVariants}>
            <div className="category-info">
              <div className="category-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"/><path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10"/></svg></div>
              <h3>Sports</h3>
              <p>High-end athletic gear.</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="featured-section container section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <div className="scroll-btns">
            <button onClick={() => handleScroll('prev')} className="scroll-btn prev">‹</button>
            <button onClick={() => handleScroll('next')} className="scroll-btn next">›</button>
          </div>
        </div>
        <motion.div 
          className="products-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featured.map(product => (
            <motion.div key={product.id} className="product-card" variants={itemVariants}>
              <div className="product-img-wrapper" style={{ background: product.bg }}>
                <Link to={`/product/${product._id || product.id}`}>
                  <img src={product.image} alt={product.name} />
                </Link>
                <div className="product-actions">
                  <button 
                    onClick={() => {
                      toggleWishlist(product);
                      if (!isInWishlist(product.id || product._id)) {
                        toast.success('Added to wishlist');
                      }
                    }} 
                    className={`action-btn ${isInWishlist(product.id || product._id) ? 'active' : ''}`}
                    title={isInWishlist(product.id || product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart size={18} fill={isInWishlist(product.id || product._id) ? "currentColor" : "none"} />
                  </button>
                  <button onClick={() => handleAddToCart({...product, id: product.id || product._id, qty: 1})} className="action-btn"><ShoppingBag size={18} /></button>
                </div>
              </div>
              <div className="product-info">
                <span className="product-brand">{product.brand}</span>
                <h3><Link to={`/product/${product._id || product.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{product.name}</Link></h3>
                <p className="product-price">₹{product.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trending Weekly */}
      <section className="trending-section container section">
        <div className="trending-container">
          <motion.div 
            className="trending-sidebar"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2>Trending Weekly</h2>
            <p>Join the thousands who have already upgraded their essentials this week. Top-rated products based on utility and aesthetics.</p>
            <div className="trending-list">
              <div className="trending-item">
                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100" alt="Essential Watch" />
                <div>
                  <h4>Essential Watch</h4>
                  <span>#1 in Accessories • 4.9/5 Rating</span>
                </div>
              </div>
              <div className="trending-item">
                <img src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=100" alt="Organic Glow Serum" />
                <div>
                  <h4>Organic Glow Serum</h4>
                  <span>#2 in Beauty • 4.8/5 Rating</span>
                </div>
              </div>
            </div>
            <button onClick={() => navigate('/shop')} className="btn btn-primary trending-all-btn">
              View All Trending <ArrowRight size={16} />
            </button>
          </motion.div>
          <motion.div 
            className="trending-main-image"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {trendingProduct ? (
              <>
                 <div className="trending-rating-badge" style={{ zIndex: 2 }}>
                    <span className="rating-score">{trendingProduct.rating || 4.5}/5</span>
                    <span className="rating-label">AVERAGE RATING</span>
                 </div>
                 <img 
                   src={trendingProduct.image} 
                   alt={trendingProduct.name} 
                   onClick={() => navigate(`/product/${trendingProduct._id || trendingProduct.id}`)}
                   style={{ cursor: 'pointer' }}
                 />
                 {trendingProduct.totalQtySold && (
                   <div style={{ position: 'absolute', top: '2rem', right: '2rem', background: '#f97316', color: 'white', padding: '0.5rem 1rem', borderRadius: '1rem', fontWeight: 700, fontSize: '0.8rem', zIndex: 2 }}>
                     🔥 {trendingProduct.totalQtySold} BOUGHT THIS WEEK
                   </div>
                 )}
              </>
            ) : (
              <>
                 <div className="trending-rating-badge">
                    <span className="rating-score">4.9/5</span>
                    <span className="rating-label">AVERAGE RATING</span>
                 </div>
                 <img src="https://images.unsplash.com/photo-1526170315870-ef6856fd3afd?auto=format&fit=crop&q=80&w=800" alt="Main Trending" />
              </>
            )}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};
