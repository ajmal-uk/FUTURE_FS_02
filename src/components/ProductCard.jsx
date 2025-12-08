import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/product-card.css';

const ProductCard = ({ product, style }) => {
    const { addToCart } = useCart();
    const { currentUser } = useAuth();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const navigate = useNavigate();

    const inWishlist = isInWishlist(product.id);

    // Check if product has an active offer
    const hasActiveOffer = () => {
        if (!product.offer) return false;
        const now = new Date();
        const startDate = new Date(product.offer.startDate);
        const endDate = new Date(product.offer.endDate);
        return now >= startDate && now <= endDate;
    };

    const activeOffer = hasActiveOffer();
    const discountPercent = activeOffer ? product.offer.discountPercent : 0;
    const discountedPrice = activeOffer
        ? product.price * (1 - discountPercent / 100)
        : product.price;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        addToCart({ ...product, price: discountedPrice });
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

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        if (inWishlist) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    return (
        <div className="product-card" style={style}>
            {/* Wishlist Button */}
            <button
                className={`btn-wishlist ${inWishlist ? 'active' : ''}`}
                onClick={handleWishlist}
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
                {inWishlist ? '❤️' : '🤍'}
            </button>

            <Link to={`/product/${product.id}`} className="card-link">
                <div className="card-image">
                    <img
                        src={product.imageUrl || 'https://placehold.co/300x300?text=Product'}
                        alt={product.name}
                        loading="lazy"
                    />

                    {/* Offer Badge */}
                    {activeOffer && (
                        <span className="offer-badge">
                            <span className="offer-percent">{discountPercent}%</span>
                            <span className="offer-off">OFF</span>
                        </span>
                    )}

                    {/* Stock Badges */}
                    {isLowStock && (
                        <span className="stock-badge warning">Only {product.stock} left</span>
                    )}
                    {isOutOfStock && (
                        <span className="stock-badge danger">Out of Stock</span>
                    )}
                </div>

                <div className="card-body">
                    <h3 className="card-title">{product.name}</h3>

                    {activeOffer && product.offer.offerTitle && (
                        <span className="offer-title">{product.offer.offerTitle}</span>
                    )}

                    <p className="card-desc">
                        {product.description?.substring(0, 55)}
                        {product.description?.length > 55 ? '...' : ''}
                    </p>

                    {/* Price Section - Separate Row */}
                    <div className="price-section">
                        {activeOffer ? (
                            <>
                                <span className="price discounted">₹{discountedPrice.toFixed(0)}</span>
                                <span className="original-price">₹{product.price.toFixed(0)}</span>
                                <span className="save-badge">Save {discountPercent}%</span>
                            </>
                        ) : (
                            <span className="price">₹{product.price?.toFixed(0)}</span>
                        )}
                    </div>

                    {/* Actions Section - Separate Row */}
                    <div className="card-actions">
                        <button
                            onClick={handleAddToCart}
                            className="btn-cart"
                            disabled={isOutOfStock}
                            title="Add to Cart"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 6h15l-1.5 9h-12z" />
                                <circle cx="9" cy="20" r="1" />
                                <circle cx="18" cy="20" r="1" />
                                <path d="M6 6L4 3H2" />
                            </svg>
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
            </Link>
        </div>
    );
};

export default ProductCard;
