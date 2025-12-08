import { useState, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { getAllProducts, getAllOrders, getAllUsers } from '../../firebase/db';
import '../../styles/admin.css';

// Sub-pages
import AdminProductsPage from './AdminProductsPage';
import AdminOrdersPage from './AdminOrdersPage';
import AdminUsersPage from './AdminUsersPage';

const AdminDashboard = () => {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/admin' && location.pathname === '/admin') return true;
        if (path !== '/admin' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <span className="admin-logo">⚙️</span>
                    <h3>Admin Panel</h3>
                </div>
                <nav className="sidebar-nav">
                    <Link
                        to="/admin"
                        className={`nav-item ${isActive('/admin') && location.pathname === '/admin' ? 'active' : ''}`}
                    >
                        <span className="nav-icon">📊</span>
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        to="/admin/products"
                        className={`nav-item ${isActive('/admin/products') ? 'active' : ''}`}
                    >
                        <span className="nav-icon">📦</span>
                        <span>Products</span>
                    </Link>
                    <Link
                        to="/admin/orders"
                        className={`nav-item ${isActive('/admin/orders') ? 'active' : ''}`}
                    >
                        <span className="nav-icon">🛒</span>
                        <span>Orders</span>
                    </Link>
                    <Link
                        to="/admin/users"
                        className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}
                    >
                        <span className="nav-icon">👥</span>
                        <span>Users</span>
                    </Link>
                </nav>
                <div className="sidebar-footer">
                    <Link to="/" className="back-to-store">
                        ← Back to Store
                    </Link>
                </div>
            </aside>
            <main className="admin-content">
                <Routes>
                    <Route path="/" element={<AdminOverview />} />
                    <Route path="/products" element={<AdminProductsPage />} />
                    <Route path="/orders" element={<AdminOrdersPage />} />
                    <Route path="/users" element={<AdminUsersPage />} />
                </Routes>
            </main>
        </div>
    );
};

const AdminOverview = () => {
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
        revenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [products, orders, users] = await Promise.all([
                getAllProducts(),
                getAllOrders(),
                getAllUsers()
            ]);

            const revenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

            setStats({
                products: products.length,
                orders: orders.length,
                users: users.length,
                revenue
            });

            setRecentOrders(orders.slice(0, 5));
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-overview">
            <div className="overview-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome to your store admin panel</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon products">📦</div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.products}</span>
                        <span className="stat-label">Products</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orders">🛒</div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.orders}</span>
                        <span className="stat-label">Orders</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon users">👥</div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.users}</span>
                        <span className="stat-label">Users</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon revenue">💰</div>
                    <div className="stat-info">
                        <span className="stat-value">${stats.revenue.toFixed(2)}</span>
                        <span className="stat-label">Revenue</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Recent Orders</h3>
                        <Link to="/admin/orders" className="view-all">View All →</Link>
                    </div>
                    {recentOrders.length > 0 ? (
                        <div className="recent-orders-list">
                            {recentOrders.map(order => (
                                <div key={order.id} className="order-row">
                                    <div className="order-info">
                                        <span className="order-id">#{order.id.slice(-6)}</span>
                                        <span className="order-email">{order.customerEmail}</span>
                                    </div>
                                    <div className="order-details">
                                        <span className={`order-status ${order.status}`}>
                                            {order.status}
                                        </span>
                                        <span className="order-amount">
                                            ${order.totalAmount?.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-orders">No orders yet</p>
                    )}
                </div>

                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div className="quick-actions">
                        <Link to="/admin/products" className="action-btn">
                            <span className="action-icon">➕</span>
                            <span>Add Product</span>
                        </Link>
                        <Link to="/admin/orders" className="action-btn">
                            <span className="action-icon">📋</span>
                            <span>View Orders</span>
                        </Link>
                        <Link to="/admin/users" className="action-btn">
                            <span className="action-icon">👤</span>
                            <span>Manage Users</span>
                        </Link>
                        <Link to="/" className="action-btn">
                            <span className="action-icon">🏪</span>
                            <span>View Store</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
