import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { getOrdersByUser, requestOrderCancellation } from '../firebase/db';
import '../styles/profile.css';

const ProfilePage = () => {
    const { currentUser, userProfile } = useAuth();
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('profile');
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [orderFilter, setOrderFilter] = useState('all');
    const [showCancelModal, setShowCancelModal] = useState(null);
    const [cancelReason, setCancelReason] = useState('');

    useEffect(() => {
        if (currentUser) {
            fetchOrders();
        }
    }, [currentUser]);

    const fetchOrders = async () => {
        try {
            const data = await getOrdersByUser(currentUser.uid);
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setOrdersLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusLabel = (status, cancelRequested) => {
        if (cancelRequested) {
            return { label: 'Cancel Requested', class: 'cancel_requested' };
        }
        const statusMap = {
            pending_approval: { label: 'Pending Approval', class: 'pending_approval' },
            approved: { label: 'Approved', class: 'approved' },
            in_progress: { label: 'In Progress', class: 'in_progress' },
            shipped: { label: 'Shipped', class: 'shipped' },
            delivered: { label: 'Delivered', class: 'delivered' },
            cancelled: { label: 'Cancelled', class: 'cancelled' },
            pending: { label: 'Pending', class: 'pending_approval' }
        };
        return statusMap[status] || { label: status, class: status };
    };

    const handleCancelRequest = async (orderId) => {
        if (!cancelReason.trim()) {
            alert('Please provide a reason for cancellation');
            return;
        }
        try {
            await requestOrderCancellation(orderId, cancelReason);
            setShowCancelModal(null);
            setCancelReason('');
            fetchOrders();
        } catch (err) {
            console.error('Error requesting cancellation:', err);
            alert('Failed to submit cancellation request');
        }
    };

    const canRequestCancel = (order) => {
        return ['pending_approval', 'approved'].includes(order.status) && !order.cancelRequested;
    };

    const filteredOrders = orderFilter === 'all'
        ? orders
        : orders.filter(o => o.status === orderFilter);

    return (
        <div className="profile-page">
            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-avatar">
                    {userProfile?.fullName?.charAt(0)?.toUpperCase() || '👤'}
                </div>
                <div className="profile-info">
                    <h1>{userProfile?.fullName || 'Welcome!'}</h1>
                    <p>{currentUser?.email}</p>
                    <p className="member-since">
                        Member since {formatDate(userProfile?.createdAt)}
                    </p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="profile-tabs">
                <button
                    className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <span className="tab-icon">👤</span>
                    Profile
                </button>
                <button
                    className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    <span className="tab-icon">📦</span>
                    Orders ({orders.length})
                </button>
                <button
                    className={`profile-tab ${activeTab === 'wishlist' ? 'active' : ''}`}
                    onClick={() => setActiveTab('wishlist')}
                >
                    <span className="tab-icon">❤️</span>
                    Wishlist ({wishlistItems.length})
                </button>
            </div>

            {/* Tab Content */}
            <div className="profile-content">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="profile-details">
                        <div className="profile-details-grid">
                            <div className="detail-card">
                                <div className="detail-label">Full Name</div>
                                <div className="detail-value">{userProfile?.fullName || 'Not set'}</div>
                            </div>
                            <div className="detail-card">
                                <div className="detail-label">Email</div>
                                <div className="detail-value">{currentUser?.email}</div>
                            </div>
                            <div className="detail-card">
                                <div className="detail-label">Phone</div>
                                <div className="detail-value">{userProfile?.phone || 'Not set'}</div>
                            </div>
                            <div className="detail-card">
                                <div className="detail-label">Address</div>
                                <div className="detail-value">
                                    {userProfile?.addressLine1 ? (
                                        <>
                                            {userProfile.addressLine1}
                                            {userProfile.addressLine2 && <>, {userProfile.addressLine2}</>}
                                            <br />
                                            {userProfile.city}, {userProfile.state} {userProfile.postalCode}
                                            <br />
                                            {userProfile.country}
                                        </>
                                    ) : 'Not set'}
                                </div>
                            </div>
                        </div>
                        <div className="profile-actions">
                            <Link to="/complete-profile" className="btn-primary">
                                Edit Profile
                            </Link>
                            <Link to="/addresses" className="btn-secondary">
                                Manage Addresses
                            </Link>
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="orders-section">
                        <div className="orders-filter">
                            {['all', 'pending_approval', 'approved', 'in_progress', 'shipped', 'delivered', 'cancelled'].map(status => (
                                <button
                                    key={status}
                                    className={`filter-btn ${orderFilter === status ? 'active' : ''}`}
                                    onClick={() => setOrderFilter(status)}
                                >
                                    {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </button>
                            ))}
                        </div>

                        {ordersLoading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading orders...</p>
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="empty-tab">
                                <div className="empty-tab-icon">📦</div>
                                <h3>No orders found</h3>
                                <p>{orderFilter !== 'all' ? `No ${orderFilter.replace('_', ' ')} orders` : 'You haven\'t placed any orders yet'}</p>
                                <Link to="/products" className="btn-primary">Start Shopping</Link>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {filteredOrders.map(order => {
                                    const statusInfo = getStatusLabel(order.status, order.cancelRequested);
                                    return (
                                        <div key={order.id} className="order-card">
                                            <div className="order-header">
                                                <div>
                                                    <div className="order-id">Order #{order.id.slice(-8)}</div>
                                                    <div className="order-date">{formatDate(order.createdAt)}</div>
                                                </div>
                                                <span className={`status-badge ${statusInfo.class}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                            <div className="order-items">
                                                {order.items?.slice(0, 4).map((item, idx) => (
                                                    <div key={idx} className="order-item-thumb">
                                                        <img
                                                            src={item.imageUrl || 'https://placehold.co/60'}
                                                            alt={item.name}
                                                        />
                                                    </div>
                                                ))}
                                                {order.items?.length > 4 && (
                                                    <div className="order-item-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)', fontSize: '0.875rem', fontWeight: '600' }}>
                                                        +{order.items.length - 4}
                                                    </div>
                                                )}
                                            </div>
                                            {order.estimatedDelivery && (
                                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                                    📅 Estimated Delivery: {order.estimatedDelivery}
                                                </p>
                                            )}
                                            <div className="order-footer">
                                                <span className="order-total">₹{order.totalAmount?.toFixed(0)}</span>
                                                {canRequestCancel(order) && (
                                                    <button
                                                        className="btn-cancel-request"
                                                        onClick={() => setShowCancelModal(order.id)}
                                                    >
                                                        Request Cancellation
                                                    </button>
                                                )}
                                                {order.cancelRequested && order.cancelApproved === false && (
                                                    <span style={{ color: 'var(--error-color)', fontSize: '0.875rem' }}>
                                                        Cancel request rejected
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Wishlist Tab */}
                {activeTab === 'wishlist' && (
                    <div className="wishlist-section">
                        {wishlistItems.length === 0 ? (
                            <div className="empty-tab">
                                <div className="empty-tab-icon">❤️</div>
                                <h3>Your wishlist is empty</h3>
                                <p>Save items you love for later</p>
                                <Link to="/products" className="btn-primary">Browse Products</Link>
                            </div>
                        ) : (
                            <div className="wishlist-grid">
                                {wishlistItems.map(item => (
                                    <div key={item.id} className="wishlist-item">
                                        <button
                                            className="btn-remove-wishlist"
                                            onClick={() => removeFromWishlist(item.id)}
                                        >
                                            ✕
                                        </button>
                                        <Link to={`/product/${item.id}`}>
                                            <div className="wishlist-item-image">
                                                <img
                                                    src={item.imageUrl || 'https://placehold.co/300'}
                                                    alt={item.name}
                                                />
                                            </div>
                                        </Link>
                                        <div className="wishlist-item-info">
                                            <Link to={`/product/${item.id}`} className="wishlist-item-name">
                                                {item.name}
                                            </Link>
                                            <div className="wishlist-item-price">₹{item.price?.toFixed(0)}</div>
                                            <div className="wishlist-item-actions">
                                                <button
                                                    className="btn-primary btn-small"
                                                    onClick={() => {
                                                        addToCart(item);
                                                        removeFromWishlist(item.id);
                                                    }}
                                                >
                                                    Add to Cart
                                                </button>
                                                <button
                                                    className="btn-secondary btn-small"
                                                    onClick={() => navigate(`/product/${item.id}`)}
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="cancel-modal-overlay" onClick={() => setShowCancelModal(null)}>
                    <div className="cancel-modal" onClick={e => e.stopPropagation()}>
                        <h3>Request Cancellation</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            Please provide a reason for cancellation. Your request will be reviewed by admin.
                        </p>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Reason for cancellation..."
                        />
                        <div className="cancel-modal-actions">
                            <button
                                className="btn-secondary"
                                onClick={() => {
                                    setShowCancelModal(null);
                                    setCancelReason('');
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary"
                                onClick={() => handleCancelRequest(showCancelModal)}
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
