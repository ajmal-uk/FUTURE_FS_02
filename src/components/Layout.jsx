import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { logoutUser } from '../firebase/auth';
import '../styles/layout.css';

export const Header = () => {
    const { currentUser, isAdmin, userProfile } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate('/login');
    };

    return (
        <header className="main-header">
            <div className="header-container">
                <Link to="/" className="logo">
                    <span className="logo-icon">🛍️</span>
                    <span className="logo-text">FutureStore</span>
                </Link>

                <nav className="main-nav">
                    <Link to="/">Home</Link>
                    <Link to="/products">Shop</Link>
                    {isAdmin && <Link to="/admin" className="admin-link">Admin</Link>}
                </nav>

                <div className="header-actions">
                    <Link to="/cart" className="cart-link">
                        <span className="cart-icon">🛒</span>
                        {cartCount > 0 && (
                            <span className="cart-badge">{cartCount}</span>
                        )}
                    </Link>

                    {currentUser ? (
                        <div className="user-menu">
                            <div className="user-dropdown">
                                <button className="user-btn">
                                    <span className="user-avatar">
                                        {userProfile?.fullName?.charAt(0) || '👤'}
                                    </span>
                                    <span className="user-name">
                                        {userProfile?.fullName?.split(' ')[0] || 'Account'}
                                    </span>
                                </button>
                                <div className="dropdown-content">
                                    <Link to="/my-orders">📦 My Orders</Link>
                                    <Link to="/addresses">📍 Addresses</Link>
                                    <button onClick={handleLogout}>🚪 Logout</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn-login">Login</Link>
                            <Link to="/register" className="btn-register">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <span className="logo-icon">🛍️</span>
                    <span>FutureStore</span>
                </div>
                <div className="footer-links">
                    <Link to="/products">Shop</Link>
                    <Link to="/my-orders">Orders</Link>
                </div>
                <p className="footer-copyright">
                    © {new Date().getFullYear()} FutureStore. Built with React & Firebase.
                </p>
            </div>
        </footer>
    );
};
