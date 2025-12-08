import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../firebase/db';
import '../styles/auth.css';

const CompleteProfilePage = () => {
    const { currentUser, userProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    });

    useEffect(() => {
        if (userProfile) {
            setFormData(prev => ({
                ...prev,
                ...userProfile
            }));
        }
    }, [userProfile]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUserProfile(currentUser.uid, formData);
            navigate('/');
        } catch (err) {
            console.error("Failed to update profile", err);
            alert("Failed to save profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <div className="auth-logo">👤</div>
                    <h2>Complete Profile</h2>
                    <p className="auth-subtitle">We need a few more details to get you started</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Phone Number</label>
                        <div className="input-wrapper">
                            <span className="input-icon">📱</span>
                            <input
                                name="phone"
                                value={formData.phone}
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
                                value={formData.addressLine1}
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
                                value={formData.addressLine2}
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
                                <input
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>State/Province</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🗺️</span>
                                <input
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Postal Code</label>
                            <div className="input-wrapper">
                                <span className="input-icon">📮</span>
                                <input
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Country</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🌍</span>
                                <input
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save & Continue'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfilePage;
