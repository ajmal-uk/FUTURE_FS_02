import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmail } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { currentUser, isAdmin, loading: authLoading, userProfile } = useAuth();

    // Redirect if already logged in based on role
    useEffect(() => {
        if (!authLoading && currentUser) {
            if (isAdmin) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [currentUser, isAdmin, authLoading, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await loginWithEmail(email, password);
            // Role-based redirect will be handled by useEffect
        } catch (err) {
            setError('Failed to log in. Check your credentials.');
            console.error(err);
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="auth-page">
                <div className="auth-loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <div className="auth-logo">🛍️</div>
                    <h2>Welcome Back</h2>
                    <p className="auth-subtitle">Sign in to manage your store</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <span className="input-icon">📧</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@gmail.com"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 6 characters"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="auth-link">
                    Don't have an account? <Link to="/register">Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
