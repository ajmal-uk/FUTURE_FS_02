import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllProducts } from '../firebase/db';
import ProductCard from '../components/ProductCard';
import '../styles/products.css';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const searchTerm = searchParams.get('search') || '';
    const categoryFilter = searchParams.get('category') || 'All';

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

    const handleSearchChange = (value) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }
        setSearchParams(params);
    };

    const handleCategoryChange = (category) => {
        const params = new URLSearchParams(searchParams);
        if (category !== 'All') {
            params.set('category', category);
        } else {
            params.delete('category');
        }
        setSearchParams(params);
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    return (
        <div className="products-page">
            {/* Page Header */}
            <div className="products-hero">
                <h1>Shop Products</h1>
                <p>Discover our curated collection of premium products</p>
            </div>

            <div className="products-container">
                {/* Filters Sidebar */}
                <aside className="filters-sidebar">
                    <div className="filter-section">
                        <h3>Search</h3>
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    className="clear-btn"
                                    onClick={() => handleSearchChange('')}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="filter-section">
                        <h3>Categories</h3>
                        <div className="category-list">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`category-btn ${categoryFilter === cat ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange(cat)}
                                >
                                    {cat === 'Electronics' && '💻 '}
                                    {cat === 'Fashion' && '👕 '}
                                    {cat === 'Home' && '🏠 '}
                                    {cat === 'Sports' && '⚽ '}
                                    {cat === 'Food' && '🍕 '}
                                    {cat === 'All' && '📦 '}
                                    {!['Electronics', 'Fashion', 'Home', 'Sports', 'Food', 'All'].includes(cat) && '📦 '}
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {(searchTerm || categoryFilter !== 'All') && (
                        <button
                            className="clear-filters"
                            onClick={() => setSearchParams({})}
                        >
                            Clear All Filters
                        </button>
                    )}
                </aside>

                {/* Products Grid */}
                <main className="products-main">
                    <div className="results-header">
                        <span className="results-count">
                            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                        </span>
                        {searchTerm && (
                            <span className="search-term">for "{searchTerm}"</span>
                        )}
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading products...</p>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="products-grid">
                            {filteredProducts.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <span className="empty-icon">🔍</span>
                            <h2>No products found</h2>
                            <p>Try adjusting your search or filter criteria</p>
                            <button
                                className="btn-primary"
                                onClick={() => setSearchParams({})}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductsPage;
