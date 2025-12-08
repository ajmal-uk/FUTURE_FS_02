import { useState, useEffect } from 'react';
import {
    getAllOrders,
    updateOrderStatus,
    approveOrder,
    rejectOrder,
    approveCancelRequest,
    rejectCancelRequest,
    setEstimatedDelivery
} from '../../firebase/db';

const ORDER_STATUSES = ['pending_approval', 'approved', 'in_progress', 'shipped', 'delivered', 'cancelled'];

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('new');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [deliveryDate, setDeliveryDate] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getAllOrders();
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveOrder = async (orderId) => {
        try {
            await approveOrder(orderId);
            fetchOrders();
        } catch (err) {
            console.error(err);
            alert('Failed to approve order');
        }
    };

    const handleRejectOrder = async (orderId) => {
        if (!rejectReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }
        try {
            await rejectOrder(orderId, rejectReason);
            setShowRejectModal(null);
            setRejectReason('');
            fetchOrders();
        } catch (err) {
            console.error(err);
            alert('Failed to reject order');
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            fetchOrders();
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        }
    };

    const handleSetDeliveryDate = async (orderId) => {
        if (!deliveryDate) {
            alert('Please select a delivery date');
            return;
        }
        try {
            await setEstimatedDelivery(orderId, deliveryDate);
            setSelectedOrder(null);
            setDeliveryDate('');
            fetchOrders();
        } catch (err) {
            console.error(err);
            alert('Failed to set delivery date');
        }
    };

    const handleApproveCancelRequest = async (orderId) => {
        try {
            await approveCancelRequest(orderId);
            fetchOrders();
        } catch (err) {
            console.error(err);
            alert('Failed to approve cancel request');
        }
    };

    const handleRejectCancelRequest = async (orderId) => {
        try {
            await rejectCancelRequest(orderId);
            fetchOrders();
        } catch (err) {
            console.error(err);
            alert('Failed to reject cancel request');
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filter orders by tab
    const getFilteredOrders = () => {
        switch (activeTab) {
            case 'new':
                return orders.filter(o => o.status === 'pending_approval' || o.status === 'pending');
            case 'active':
                return orders.filter(o => ['approved', 'in_progress', 'shipped'].includes(o.status));
            case 'cancel_requests':
                return orders.filter(o => o.cancelRequested && o.cancelApproved === null);
            case 'completed':
                return orders.filter(o => o.status === 'delivered');
            case 'cancelled':
                return orders.filter(o => o.status === 'cancelled');
            default:
                return orders;
        }
    };

    const filteredOrders = getFilteredOrders();

    const getTabCounts = () => ({
        new: orders.filter(o => o.status === 'pending_approval' || o.status === 'pending').length,
        active: orders.filter(o => ['approved', 'in_progress', 'shipped'].includes(o.status)).length,
        cancel_requests: orders.filter(o => o.cancelRequested && o.cancelApproved === null).length,
        completed: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
    });

    const tabCounts = getTabCounts();

    const getStatusBadge = (order) => {
        if (order.cancelRequested && order.cancelApproved === null) {
            return <span className="status-badge cancel-request">⚠️ Cancel Requested</span>;
        }
        const statusClasses = {
            pending_approval: 'pending',
            pending: 'pending',
            approved: 'approved',
            in_progress: 'processing',
            shipped: 'shipped',
            delivered: 'delivered',
            cancelled: 'cancelled'
        };
        const statusLabels = {
            pending_approval: '⏳ Pending Approval',
            pending: '⏳ Pending',
            approved: '✓ Approved',
            in_progress: '🔄 In Progress',
            shipped: '📦 Shipped',
            delivered: '✅ Delivered',
            cancelled: '❌ Cancelled'
        };
        return (
            <span className={`status-badge ${statusClasses[order.status] || 'pending'}`}>
                {statusLabels[order.status] || order.status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="admin-orders">
            <div className="admin-page-header">
                <h1>Order Management</h1>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'new' ? 'active' : ''}`}
                    onClick={() => setActiveTab('new')}
                >
                    🆕 New Orders
                    {tabCounts.new > 0 && <span className="tab-count">{tabCounts.new}</span>}
                </button>
                <button
                    className={`admin-tab ${activeTab === 'active' ? 'active' : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    📋 Active Orders
                    {tabCounts.active > 0 && <span className="tab-count">{tabCounts.active}</span>}
                </button>
                <button
                    className={`admin-tab ${activeTab === 'cancel_requests' ? 'active cancel-tab' : ''}`}
                    onClick={() => setActiveTab('cancel_requests')}
                >
                    ⚠️ Cancel Requests
                    {tabCounts.cancel_requests > 0 && <span className="tab-count urgent">{tabCounts.cancel_requests}</span>}
                </button>
                <button
                    className={`admin-tab ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >
                    ✅ Completed
                </button>
                <button
                    className={`admin-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cancelled')}
                >
                    ❌ Cancelled
                </button>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📦</span>
                    <h2>No orders in this category</h2>
                    <p>Orders will appear here when they match the selected filter</p>
                </div>
            ) : (
                <div className="orders-grid">
                    {filteredOrders.map(order => (
                        <div key={order.id} className={`order-card ${order.cancelRequested ? 'cancel-requested' : ''}`}>
                            <div className="order-card-header">
                                <div className="order-meta">
                                    <span className="order-card-id">#{order.id.slice(-8)}</span>
                                    <span className="order-date">{formatDate(order.createdAt)}</span>
                                </div>
                                {getStatusBadge(order)}
                            </div>

                            <div className="order-card-body">
                                <div className="order-customer">
                                    <h4>👤 Customer</h4>
                                    <p><strong>{order.shippingAddress?.fullName || order.customerEmail}</strong></p>
                                    <p>{order.customerEmail}</p>
                                    <p>{order.shippingAddress?.phone}</p>
                                </div>

                                <div className="order-address">
                                    <h4>📍 Shipping Address</h4>
                                    <p>{order.shippingAddress?.addressLine1}</p>
                                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
                                </div>

                                <div className="order-summary">
                                    <h4>📦 Order Summary</h4>
                                    <p><strong>Items:</strong> {order.items?.length || 0}</p>
                                    <p className="order-total"><strong>Total: ₹{order.totalAmount?.toFixed(0)}</strong></p>
                                    {order.estimatedDelivery && (
                                        <p className="delivery-date">📅 Est. Delivery: {order.estimatedDelivery}</p>
                                    )}
                                </div>
                            </div>

                            {/* Items Preview */}
                            <div className="order-items-preview">
                                <h4>Items</h4>
                                <div className="items-list">
                                    {order.items?.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="item-row">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-qty">×{item.quantity}</span>
                                            <span className="item-price">₹{item.subtotal?.toFixed(0)}</span>
                                        </div>
                                    ))}
                                    {order.items?.length > 3 && (
                                        <p className="more-items">+{order.items.length - 3} more items</p>
                                    )}
                                </div>
                            </div>

                            {/* Cancel Request Info */}
                            {order.cancelRequested && (
                                <div className="cancel-request-info">
                                    <h4>⚠️ Cancellation Request</h4>
                                    <p className="cancel-reason">{order.cancelReason || 'No reason provided'}</p>
                                    <p className="cancel-date">Requested: {formatDate(order.cancelRequestedAt)}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="order-actions">
                                {/* New Orders - Approve/Reject */}
                                {(order.status === 'pending_approval' || order.status === 'pending') && !order.cancelRequested && (
                                    <>
                                        <button
                                            className="btn-approve"
                                            onClick={() => handleApproveOrder(order.id)}
                                        >
                                            ✓ Approve
                                        </button>
                                        <button
                                            className="btn-reject"
                                            onClick={() => setShowRejectModal(order.id)}
                                        >
                                            ✗ Reject
                                        </button>
                                    </>
                                )}

                                {/* Active Orders - Status Change + Delivery Date */}
                                {['approved', 'in_progress', 'shipped'].includes(order.status) && !order.cancelRequested && (
                                    <>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="status-select"
                                        >
                                            <option value="approved">Approved</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                        </select>
                                        <button
                                            className="btn-delivery"
                                            onClick={() => setSelectedOrder(order.id)}
                                        >
                                            📅 Set Delivery
                                        </button>
                                    </>
                                )}

                                {/* Cancel Requests - Approve/Reject Cancel */}
                                {order.cancelRequested && order.cancelApproved === null && (
                                    <>
                                        <button
                                            className="btn-approve-cancel"
                                            onClick={() => handleApproveCancelRequest(order.id)}
                                        >
                                            ✓ Approve Cancel
                                        </button>
                                        <button
                                            className="btn-reject-cancel"
                                            onClick={() => handleRejectCancelRequest(order.id)}
                                        >
                                            ✗ Reject Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="modal-overlay" onClick={() => setShowRejectModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Reject Order</h3>
                        <p>Please provide a reason for rejection:</p>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Rejection reason..."
                        />
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => {
                                setShowRejectModal(null);
                                setRejectReason('');
                            }}>
                                Cancel
                            </button>
                            <button className="btn-reject" onClick={() => handleRejectOrder(showRejectModal)}>
                                Reject Order
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delivery Date Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h3>Set Estimated Delivery Date</h3>
                        <input
                            type="date"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => {
                                setSelectedOrder(null);
                                setDeliveryDate('');
                            }}>
                                Cancel
                            </button>
                            <button className="btn-primary" onClick={() => handleSetDeliveryDate(selectedOrder)}>
                                Set Date
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrdersPage;
