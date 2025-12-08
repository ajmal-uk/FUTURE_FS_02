import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerWithEmail } from '../firebase/auth'; // Removed loginWithGoogle
import '../styles/auth.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setLoading(false);
            return setError("Passwords do not match");
        }

        try {
            const { confirmPassword, ...registerData } = formData;
            await registerWithEmail(registerData);
            navigate('/'); // Redirect to home (auth context will handle profile check)
        } catch (err) {
            setError("Registration failed. Email might be in use.");
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <div className="auth-logo">📝</div>
                    <h2>Create Account</h2>
                    <p className="auth-subtitle">Join us and start shopping today</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Basic Info */}
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input
                                name="fullName"
                                onChange={handleChange}
                                placeholder="Your Name"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <div className="input-wrapper">
                            <span className="input-icon">📧</span>
                            <input
                                name="email"
                                type="email"
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    name="password"
                                    type="password"
                                    onChange={handleChange}
                                    placeholder="Min. 6 chars"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Confirm</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔐</span>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    onChange={handleChange}
                                    placeholder="Repeat password"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address & Contact */}
                    <div style={{ margin: '1rem 0 0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', color: 'white', marginBottom: '1rem' }}>Shipping Details</h3>
                    </div>

                    <div className="form-group">
                        <label>Phone</label>
                        <div className="input-wrapper">
                            <span className="input-icon">📱</span>
                            <input
                                name="phone"
                                onChange={handleChange}
                                placeholder="+1 234 567 890"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Address Line 1</label>
                        <div className="input-wrapper">
                            <span className="input-icon">📍</span>
                            <input
                                name="addressLine1"
                                onChange={handleChange}
                                placeholder="Street Address"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Address Line 2 (Optional)</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🏢</span>
                            <input
                                name="addressLine2"
                                onChange={handleChange}
                                placeholder="Apt, Suite, Unit"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>City</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🏙️</span>
                                <input name="city" onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>State</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🗺️</span>
                                <input name="state" onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Postal Code</label>
                            <div className="input-wrapper">
                                <span className="input-icon">📮</span>
                                <input name="postalCode" onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Country</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🌍</span>
                                <input name="country" onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <p className="auth-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
