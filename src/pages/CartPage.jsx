import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/cart.css';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="empty-cart">
                    <span className="empty-icon">🛒</span>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <Link to="/products" className="btn-primary">Start Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-header">
                <h1>Shopping Cart</h1>
                <span className="cart-count">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="cart-layout">
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <div className="item-image">
                                <img
                                    src={item.imageUrl || 'https://placehold.co/120x120?text=Product'}
                                    alt={item.name}
                                />
                            </div>
                            <div className="item-details">
                                <div className="item-info">
                                    <Link to={`/product/${item.id}`} className="item-name">
                                        {item.name}
                                    </Link>
                                    {item.category && (
                                        <span className="item-category">{item.category}</span>
                                    )}
                                </div>
                                <div className="item-price">
                                    ${item.price?.toFixed(2)}
                                </div>
                            </div>
                            <div className="item-actions">
                                <div className="qty-control">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <span className="qty-value">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="item-subtotal">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="btn-remove"
                                    title="Remove item"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h3>Order Summary</h3>

                    <div className="summary-rows">
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span className="free-shipping">FREE</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax</span>
                            <span>${(cartTotal * 0.1).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="summary-total">
                        <span>Total</span>
                        <span>${(cartTotal * 1.1).toFixed(2)}</span>
                    </div>

                    <button
                        onClick={() => navigate('/checkout')}
                        className="btn-checkout"
                    >
                        Proceed to Checkout
                    </button>

                    <button onClick={clearCart} className="btn-clear">
                        Clear Cart
                    </button>

                    <Link to="/products" className="continue-shopping">
                        ← Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
