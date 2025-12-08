import { useState, useEffect } from 'react';
import { getAllUsers, updateUserProfile, banUser, unbanUser } from '../../firebase/db';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Helper to create user without logging out current admin
const secondaryApp = initializeApp({
    apiKey: "AIzaSyDs1rldmSrRpLE_73rgQNfLxkOBrZvEQyc",
    authDomain: "future-fs-02.firebaseapp.com",
    projectId: "future-fs-02",
}, "Secondary");

const secondaryAuth = getAuth(secondaryApp);

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('customers');
    const [showAddAdmin, setShowAddAdmin] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newAdmin, setNewAdmin] = useState({
        email: '',
        password: '',
        fullName: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const admins = users.filter(u => u.role === 'admin' && !u.isBanned);
    const customers = users.filter(u => u.role !== 'admin' && !u.isBanned);
    const bannedUsers = users.filter(u => u.isBanned);

    const toggleRole = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        if (window.confirm(`Change role to ${newRole} for ${user.email}?`)) {
            try {
                await updateUserProfile(user.uid, { role: newRole });
                fetchUsers();
            } catch (err) {
                console.error(err);
                alert("Failed to update role");
            }
        }
    };

    const handleBanUser = async (user) => {
        if (user.role === 'admin') {
            alert("Cannot ban admin accounts. Demote to user first.");
            return;
        }
        if (window.confirm(`Are you sure you want to ban ${user.email}? They will not be able to access the store.`)) {
            try {
                await banUser(user.uid);
                fetchUsers();
                alert("User banned successfully");
            } catch (err) {
                console.error(err);
                alert("Failed to ban user");
            }
        }
    };

    const handleUnbanUser = async (user) => {
        if (window.confirm(`Unban ${user.email}? They will be able to access the store again.`)) {
            try {
                await unbanUser(user.uid);
                fetchUsers();
                alert("User unbanned successfully");
            } catch (err) {
                console.error(err);
                alert("Failed to unban user");
            }
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newAdmin.email, newAdmin.password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                email: newAdmin.email,
                fullName: newAdmin.fullName,
                role: "admin",
                provider: "password",
                createdAt: new Date()
            });

            alert('New admin created successfully!');
            setShowAddAdmin(false);
            setNewAdmin({ email: '', password: '', fullName: '' });
            fetchUsers();
            secondaryAuth.signOut();

        } catch (err) {
            console.error("Error creating admin:", err);
            alert("Error: " + err.message);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    const displayUsers = activeTab === 'admins' ? admins : (activeTab === 'banned' ? bannedUsers : customers);

    return (
        <div className="admin-users">
            <div className="admin-page-header">
                <h1>User Management</h1>
                <button
                    onClick={() => setShowAddAdmin(true)}
                    className="btn-primary"
                >
                    👤 Add New Admin
                </button>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'customers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('customers')}
                >
                    👥 Customers
                    <span className="tab-count">{customers.length}</span>
                </button>
                <button
                    className={`admin-tab ${activeTab === 'admins' ? 'active' : ''}`}
                    onClick={() => setActiveTab('admins')}
                >
                    🛡️ Admins
                    <span className="tab-count">{admins.length}</span>
                </button>
                <button
                    className={`admin-tab ${activeTab === 'banned' ? 'active' : ''}`}
                    onClick={() => setActiveTab('banned')}
                >
                    🚫 Banned
                    <span className="tab-count">{bannedUsers.length}</span>
                </button>
            </div>

            {showAddAdmin && (
                <div className="product-form-container">
                    <h3>Create New Admin</h3>
                    <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                        This will create a new login account with full admin privileges.
                    </p>
                    <form onSubmit={handleCreateAdmin} className="product-form">
                        <div className="form-group full-width">
                            <label>Full Name</label>
                            <input
                                value={newAdmin.fullName}
                                onChange={e => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={newAdmin.email}
                                onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={newAdmin.password}
                                onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary">Create Admin</button>
                            <button
                                type="button"
                                onClick={() => setShowAddAdmin(false)}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* User Cards Grid */}
            {displayUsers.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">{activeTab === 'admins' ? '🛡️' : '👥'}</span>
                    <h2>No {activeTab === 'admins' ? 'admins' : 'customers'} found</h2>
                </div>
            ) : (
                <div className="users-grid">
                    {displayUsers.map(user => (
                        <div
                            key={user.uid}
                            className={`user-card ${user.role === 'admin' ? 'admin-card' : ''}`}
                            onClick={() => setSelectedUser(user)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="user-card-header">
                                <div className="user-avatar-large">
                                    {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                </div>
                                <span className={`role-badge ${user.role}`}>
                                    {user.role === 'admin' ? '🛡️ Admin' : '👤 Customer'}
                                </span>
                            </div>
                            <div className="user-card-body">
                                <h3>{user.fullName || 'No Name'}</h3>
                                <p className="user-email">{user.email}</p>
                                <div className="user-meta">
                                    <span>📱 {user.phone || 'No phone'}</span>
                                    <span>📅 Joined: {formatDate(user.createdAt)}</span>
                                </div>
                                {user.city && (
                                    <p className="user-location">📍 {user.city}, {user.state}</p>
                                )}
                            </div>
                            <div className="user-card-actions" onClick={(e) => e.stopPropagation()}>
                                {activeTab !== 'banned' ? (
                                    <>
                                        <button
                                            onClick={() => toggleRole(user)}
                                            className="btn-secondary btn-small"
                                        >
                                            {user.role === 'admin' ? '⬇️ Demote' : '⬆️ Promote'}
                                        </button>
                                        {user.role !== 'admin' && (
                                            <button
                                                onClick={() => handleBanUser(user)}
                                                className="btn-delete btn-small"
                                            >
                                                🚫 Ban
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleUnbanUser(user)}
                                        className="btn-primary btn-small"
                                        style={{ width: '100%' }}
                                    >
                                        ✅ Unban User
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="user-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedUser(null)}>✕</button>

                        <div className="modal-header">
                            <div className="modal-avatar">
                                {selectedUser.fullName?.charAt(0) || selectedUser.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="modal-header-info">
                                <h2>{selectedUser.fullName || 'No Name'}</h2>
                                <span className={`role-badge ${selectedUser.role}`}>
                                    {selectedUser.role === 'admin' ? '🛡️ Admin' : '👤 Customer'}
                                </span>
                            </div>
                        </div>

                        <div className="modal-body">
                            <div className="info-section">
                                <h4>Contact Information</h4>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">📧 Email</span>
                                        <span className="info-value">{selectedUser.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">📱 Phone</span>
                                        <span className="info-value">{selectedUser.phone || 'Not provided'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="info-section">
                                <h4>Location</h4>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">🏘️ Address</span>
                                        <span className="info-value">
                                            {selectedUser.addressLine1 || 'Not provided'}
                                            {selectedUser.addressLine2 && <><br />{selectedUser.addressLine2}</>}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">🏙️ City</span>
                                        <span className="info-value">{selectedUser.city || 'Not provided'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">🗺️ State</span>
                                        <span className="info-value">{selectedUser.state || 'Not provided'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">📮 Postal Code</span>
                                        <span className="info-value">{selectedUser.postalCode || 'Not provided'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">🌍 Country</span>
                                        <span className="info-value">{selectedUser.country || 'India'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="info-section">
                                <h4>Account Details</h4>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">🔐 Provider</span>
                                        <span className="info-value">{selectedUser.provider || 'Email/Password'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">📅 Joined</span>
                                        <span className="info-value">{formatDate(selectedUser.createdAt)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">🆔 User ID</span>
                                        <span className="info-value" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                                            {selectedUser.uid}
                                        </span>
                                    </div>
                                    {selectedUser.isBanned && (
                                        <div className="info-item">
                                            <span className="info-label">🚫 Banned At</span>
                                            <span className="info-value" style={{ color: '#ef4444' }}>
                                                {formatDate(selectedUser.bannedAt)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            {selectedUser.isBanned ? (
                                <button
                                    className="btn-primary"
                                    onClick={() => {
                                        handleUnbanUser(selectedUser);
                                        setSelectedUser(null);
                                    }}
                                >
                                    ✅ Unban User
                                </button>
                            ) : (
                                <>
                                    <button
                                        className="btn-secondary"
                                        onClick={() => {
                                            toggleRole(selectedUser);
                                            setSelectedUser(null);
                                        }}
                                    >
                                        {selectedUser.role === 'admin' ? '⬇️ Demote to User' : '⬆️ Promote to Admin'}
                                    </button>
                                    {selectedUser.role !== 'admin' && (
                                        <button
                                            className="btn-delete"
                                            onClick={() => {
                                                handleBanUser(selectedUser);
                                                setSelectedUser(null);
                                            }}
                                        >
                                            🚫 Ban User
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;
