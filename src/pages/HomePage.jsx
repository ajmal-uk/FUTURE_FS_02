import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllProducts, getAllUsers, getAllOrders, getFeaturedDeals } from '../firebase/db';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import '../styles/home.css';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ products: 0, customers: 0, orders: 0 });
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { currentUser } = useAuth();

    useEffect(() => {
        fetchProducts();
        fetchStats();
        fetchDeals();
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

    const fetchStats = async () => {
        try {
            const [productsData, usersData, ordersData] = await Promise.all([
                getAllProducts(),
                getAllUsers(),
                getAllOrders()
            ]);
            setStats({
                products: productsData.length,
                customers: usersData.filter(u => u.role !== 'admin').length,
                orders: ordersData.filter(o => o.status === 'delivered').length
            });
        } catch (err) {
            console.error("Error fetching stats", err);
        }
    };

    const fetchDeals = async () => {
        try {
            const dealsData = await getFeaturedDeals();
            setDeals(dealsData);
        } catch (err) {
            console.error("Error fetching deals", err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    const featuredProducts = products.slice(0, 8);

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

                    <div className="hero-cta">
                        <Link to="/products" className="btn-primary btn-large">
                            Browse Products
                        </Link>
                        <span className="hero-features">
                            ✓ Free Shipping over ₹500 &nbsp;•&nbsp; ✓ 24/7 Support &nbsp;•&nbsp; ✓ Easy Returns
                        </span>
                    </div>
                </div>
            </section>

            {/* Today's Deals Section */}
            {deals.length > 0 && (
                <section className="deals-section">
                    <div className="section-header">
                        <div className="deals-header">
                            <span className="deals-icon">🔥</span>
                            <h2>Today's Deals</h2>
                            <span className="deals-badge">Limited Time</span>
                        </div>
                        <Link to="/products" className="view-all">View All →</Link>
                    </div>
                    <div className="deals-grid">
                        {deals.map((deal, index) => {
                            const discountedPrice = deal.price - (deal.price * deal.offer.discountPercent / 100);
                            return (
                                <Link
                                    key={deal.id}
                                    to={`/product/${deal.id}`}
                                    className="deal-card"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="deal-badge">
                                        {deal.offer.discountPercent}% OFF
                                    </div>
                                    <div className="deal-image">
                                        <img
                                            src={deal.imageUrl || 'https://placehold.co/200x200?text=Product'}
                                            alt={deal.name}
                                        />
                                    </div>
                                    <div className="deal-info">
                                        <h3 className="deal-name">{deal.name}</h3>
                                        {deal.offer.offerTitle && (
                                            <span className="deal-offer-title">{deal.offer.offerTitle}</span>
                                        )}
                                        <div className="deal-pricing">
                                            <span className="deal-price">₹{discountedPrice.toFixed(0)}</span>
                                            <span className="deal-original">₹{deal.price}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

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
                            <ProductCard
                                key={product.id}
                                product={product}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            />
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
