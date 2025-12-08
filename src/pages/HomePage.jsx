import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProducts } from '../firebase/db';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/home.css';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { currentUser } = useAuth();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    const featuredProducts = products.slice(0, 4);

    const handleAddToCart = (product) => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        addToCart(product, 1);
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-bg"></div>
                <div className="hero-content">
                    <span className="hero-badge">✨ New Collection Available</span>
                    <h1>Discover Premium Products</h1>
                    <p>Shop the latest trends with exclusive deals and free shipping on orders over ₹500</p>

                    <form onSubmit={handleSearch} className="hero-search">
                        <div className="search-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="search-btn">Search</button>
                        </div>
                    </form>

                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-value">500+</span>
                            <span className="stat-label">Products</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">10K+</span>
                            <span className="stat-label">Customers</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">4.9</span>
                            <span className="stat-label">Rating</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories-section">
                <div className="section-header">
                    <h2>Shop by Category</h2>
                    <Link to="/products" className="view-all">View All →</Link>
                </div>
                <div className="categories-grid">
                    {categories.length > 0 ? (
                        categories.map((category, index) => (
                            <Link
                                key={category}
                                to={`/products?category=${encodeURIComponent(category)}`}
                                className="category-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="category-icon">
                                    {category === 'Electronics' && '💻'}
                                    {category === 'Fashion' && '👕'}
                                    {category === 'Home' && '🏠'}
                                    {category === 'Sports' && '⚽'}
                                    {category === 'Food' && '🍕'}
                                    {!['Electronics', 'Fashion', 'Home', 'Sports', 'Food'].includes(category) && '📦'}
                                </div>
                                <span className="category-name">{category}</span>
                            </Link>
                        ))
                    ) : (
                        <div className="no-categories">
                            <p>No categories yet. Add products to see categories.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="featured-section">
                <div className="section-header">
                    <h2>Featured Products</h2>
                    <Link to="/products" className="view-all">View All →</Link>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                ) : (
                    <div className="featured-grid">
                        {featuredProducts.map((product, index) => (
                            <div
                                key={product.id}
                                className="product-card"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <Link to={`/product/${product.id}`} className="product-image">
                                    <img
                                        src={product.imageUrl || 'https://placehold.co/300x300?text=Product'}
                                        alt={product.name}
                                    />
                                    {product.stock <= 5 && product.stock > 0 && (
                                        <span className="stock-badge low">Only {product.stock} left</span>
                                    )}
                                    {product.stock === 0 && (
                                        <span className="stock-badge out">Out of Stock</span>
                                    )}
                                </Link>
                                <div className="product-info">
                                    <span className="product-category">{product.category}</span>
                                    <Link to={`/product/${product.id}`}>
                                        <h3 className="product-name">{product.name}</h3>
                                    </Link>
                                    <p className="product-desc">{product.description?.substring(0, 60)}...</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="featured-price">₹{product.price}</span>
                                        <div className="product-actions">
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="btn-add-cart"
                                                disabled={product.stock === 0}
                                            >
                                                🛒
                                            </button>
                                            <Link to={`/product/${product.id}`} className="btn-buy-now">
                                                Buy Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Start Shopping?</h2>
                    <p>Join thousands of happy customers and get exclusive deals</p>
                    <div className="cta-actions">
                        <Link to="/products" className="btn-primary btn-large">
                            Browse Products
                        </Link>
                        {!currentUser && (
                            <Link to="/register" className="btn-secondary btn-large">
                                Create Account
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
