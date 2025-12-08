import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserAddresses, addUserAddress, deleteUserAddress, setDefaultAddress } from '../firebase/db';
import '../styles/checkout.css';

const AddressPage = () => {
    const { currentUser, userProfile } = useAuth();
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India'
    });

    useEffect(() => {
        if (currentUser) {
            fetchAddresses();
        }
    }, [currentUser]);

    const fetchAddresses = async () => {
        try {
            const data = await getUserAddresses(currentUser.uid);
            setAddresses(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            await addUserAddress(currentUser.uid, newAddress);
            setShowForm(false);
            setNewAddress({
                fullName: userProfile?.fullName || '',
                phone: userProfile?.phone || '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                postalCode: '',
                country: 'India'
            });
            fetchAddresses();
        } catch (err) {
            console.error(err);
            alert('Failed to add address');
        }
    };

    const handleDelete = async (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await deleteUserAddress(currentUser.uid, addressId);
                fetchAddresses();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            await setDefaultAddress(currentUser.uid, addressId);
            alert('Default address updated');
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="checkout-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading addresses...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-header">
                <h1>📍 My Addresses</h1>
            </div>

            <div className="address-section">
                {addresses.length > 0 && (
                    <div className="address-list">
                        {addresses.map(addr => (
                            <div key={addr.id} className="address-card">
                                <div className="address-details">
                                    <strong>{addr.fullName}</strong>
                                    <p>{addr.addressLine1}</p>
                                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                                    <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                                    <p>{addr.country}</p>
                                    <p className="address-phone">📞 {addr.phone}</p>
                                    <div className="address-actions">
                                        <button
                                            onClick={() => handleSetDefault(addr.id)}
                                            className="btn-small btn-secondary"
                                        >
                                            Set as Default
                                        </button>
                                        <button
                                            onClick={() => handleDelete(addr.id)}
                                            className="btn-small btn-delete"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!showForm && (
                    <button
                        className="btn-add-address"
                        onClick={() => setShowForm(true)}
                    >
                        + Add New Address
                    </button>
                )}

                {showForm && (
                    <form onSubmit={handleAddAddress} className="address-form">
                        <h3>Add New Address</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    value={newAddress.fullName}
                                    onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    value={newAddress.phone}
                                    onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Address Line 1</label>
                            <input
                                value={newAddress.addressLine1}
                                onChange={e => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Address Line 2</label>
                            <input
                                value={newAddress.addressLine2}
                                onChange={e => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    value={newAddress.city}
                                    onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input
                                    value={newAddress.state}
                                    onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Postal Code</label>
                                <input
                                    value={newAddress.postalCode}
                                    onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <input
                                    value={newAddress.country}
                                    onChange={e => setNewAddress({ ...newAddress, country: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary">Save Address</button>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {addresses.length === 0 && !showForm && (
                    <div className="empty-state">
                        <span className="empty-icon">📍</span>
                        <h2>No saved addresses</h2>
                        <p>Add an address to make checkout faster</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddressPage;
