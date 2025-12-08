import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../firebase/db';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

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

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            fetchOrders();
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(o => o.status === filter);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                <h1>Orders ({orders.length})</h1>
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    {ORDER_STATUSES.map(status => (
                        <button
                            key={status}
                            className={`filter-tab ${filter === status ? 'active' : ''}`}
                            onClick={() => setFilter(status)}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📦</span>
                    <h2>No orders found</h2>
                    <p>{filter !== 'all' ? `No ${filter} orders` : 'Orders will appear here when customers make purchases'}</p>
                </div>
            ) : (
                <div className="orders-list">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-card-header">
                                <div className="order-meta">
                                    <span className="order-card-id">Order #{order.id.slice(-8)}</span>
                                    <span className="order-date">{formatDate(order.createdAt)}</span>
                                </div>
                                <select
                                    value={order.status || 'pending'}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    className="status-select"
                                >
                                    {ORDER_STATUSES.map(status => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="order-card-body">
                                <div className="order-section">
                                    <h4>Customer</h4>
                                    <p><strong>{order.shippingAddress?.fullName || 'N/A'}</strong></p>
                                    <p>{order.customerEmail}</p>
                                    <p>{order.shippingAddress?.phone}</p>
                                </div>
                                <div className="order-section">
                                    <h4>Shipping Address</h4>
                                    <p>{order.shippingAddress?.addressLine1}</p>
                                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                                    <p>{order.shippingAddress?.postalCode}, {order.shippingAddress?.country}</p>
                                </div>
                                <div className="order-section">
                                    <h4>Order Details</h4>
                                    <p><strong>Items:</strong> {order.items?.length || 0}</p>
                                    <p><strong>Payment:</strong> {order.paymentStatus || 'Pending'}</p>
                                    <p className="order-total">
                                        <strong>Total: ₹{order.totalAmount?.toFixed(0)}</strong>
                                    </p>
                                </div>
                            </div>
                            <div className="order-items-preview">
                                <h4>Items</h4>
                                <div className="items-list">
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="item-row">
                                            <span>{item.name}</span>
                                            <span>x{item.quantity}</span>
                                            <span>₹{item.subtotal?.toFixed(0)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminOrdersPage;
