import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../firebase/db';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/product-detail.css';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { currentUser } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                if (!data) return navigate('/products');
                setProduct(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    // Check if product has an active offer
    const hasActiveOffer = () => {
        if (!product?.offer) return false;
        const now = new Date();
        const startDate = new Date(product.offer.startDate);
        const endDate = new Date(product.offer.endDate);
        return now >= startDate && now <= endDate;
    };

    const activeOffer = product ? hasActiveOffer() : false;
    const discountPercent = activeOffer ? product.offer.discountPercent : 0;
    const discountedPrice = activeOffer
        ? product.price * (1 - discountPercent / 100)
        : product?.price;

    const handleAddToCart = () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        addToCart({ ...product, price: discountedPrice }, quantity);
    };

    const handleBuyNow = () => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        navigate(`/checkout?product=${product.id}`);
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading details...</p>
                </div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="page-container">
            <button onClick={() => navigate(-1)} className="btn-secondary btn-small" style={{ marginBottom: '1rem' }}>
                ← Back
            </button>

            <div className="product-detail">
                <div className="detail-image">
                    <img
                        src={product.imageUrl || 'https://placehold.co/500x500?text=Product'}
                        alt={product.name}
                    />
                    {activeOffer && (
                        <span className="detail-offer-badge">{discountPercent}% OFF</span>
                    )}
                </div>
                <div className="detail-info">
                    <h1>{product.name}</h1>
                    <div className="detail-meta">
                        <span className="badge badge-primary">{product.category}</span>
                        {product.stock > 0 ? (
                            <span className="in-stock">In Stock ({product.stock} available)</span>
                        ) : (
                            <span className="out-of-stock">Out of Stock</span>
                        )}
                    </div>

                    {activeOffer && product.offer.offerTitle && (
                        <div className="offer-info-box">
                            <span className="offer-icon">🎉</span>
                            <span className="offer-text">{product.offer.offerTitle}</span>
                        </div>
                    )}

                    {activeOffer ? (
                        <div className="detail-price-container">
                            <span className="detail-price discounted">₹{discountedPrice?.toFixed(0)}</span>
                            <span className="detail-original-price">₹{product.price?.toFixed(0)}</span>
                            <span className="savings-badge">Save ₹{(product.price - discountedPrice).toFixed(0)}</span>
                        </div>
                    ) : (
                        <p className="detail-price">₹{product.price?.toFixed(0)}</p>
                    )}

                    <p className="description">{product.description}</p>

                    {product.stock > 0 && (
                        <div className="add-action">
                            <div className="qty-selector">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>−</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} disabled={quantity >= product.stock}>+</button>
                            </div>
                            <button onClick={handleAddToCart} className="btn-primary">
                                Add to Cart
                            </button>
                            <button onClick={handleBuyNow} className="btn-secondary">
                                Buy Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
