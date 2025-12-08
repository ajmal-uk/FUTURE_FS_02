import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrdersByUser } from '../firebase/db';
import '../styles/checkout.css';

const MyOrdersPage = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrdersByUser(currentUser.uid);
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (currentUser) fetchOrders();
    }, [currentUser]);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="checkout-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-header">
                <h1>My Orders</h1>
                <p>Track and manage your recent purchases</p>
            </div>

            {orders.length === 0 ? (
                <div className="empty-checkout">
                    <span className="empty-icon">📦</span>
                    <h2>No orders yet</h2>
                    <p>Start shopping to see your orders here.</p>
                    <Link to="/products" className="btn-primary">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-summary" style={{ marginBottom: '1.5rem' }}>
                            <div className="order-card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                                <div className="order-meta">
                                    <span className="order-card-id">Order #{order.id.slice(-8)}</span>
                                    <span className="order-date">{formatDate(order.createdAt)}</span>
                                </div>
                                <span className={`step ${order.status === 'delivered' ? 'completed' : 'active'}`} style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem' }}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>

                            <div className="summary-items">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="summary-item">
                                        <div className="summary-item-info">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-qty">Qty: {item.quantity}</span>
                                        </div>
                                        <span className="item-price">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-totals" style={{ marginTop: '1rem' }}>
                                <div className="summary-row total">
                                    <span>Total Amount</span>
                                    <span>${order.totalAmount?.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;
