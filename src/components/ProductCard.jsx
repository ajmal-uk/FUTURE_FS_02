import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/product-card.css';

const ProductCard = ({ product, style }) => {
    const { addToCart } = useCart();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        addToCart(product);
    };

    const handleBuyNow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        navigate(`/checkout?product=${product.id}`);
    };

    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    return (
        <div className="product-card" style={style}>
            <Link to={`/product/${product.id}`} className="card-link">
                <div className="card-image">
                    <img
                        src={product.imageUrl || 'https://placehold.co/300x300?text=Product'}
                        alt={product.name}
                        loading="lazy"
                    />
                    {product.category && (
                        <span className="category-badge">{product.category}</span>
                    )}
                    {isLowStock && (
                        <span className="stock-badge warning">Only {product.stock} left</span>
                    )}
                    {isOutOfStock && (
                        <span className="stock-badge danger">Out of Stock</span>
                    )}
                </div>
                <div className="card-body">
                    <h3 className="card-title">{product.name}</h3>
                    <p className="card-desc">
                        {product.description?.substring(0, 50)}
                        {product.description?.length > 50 ? '...' : ''}
                    </p>
                    <div className="card-footer">
                        <span className="price">${product.price?.toFixed(2)}</span>
                        <div className="card-actions">
                            <button
                                onClick={handleAddToCart}
                                className="btn-cart"
                                disabled={isOutOfStock}
                                title="Add to Cart"
                            >
                                🛒
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="btn-buy"
                                disabled={isOutOfStock}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
