import { useState, useEffect } from 'react';
import { getAllUsers, updateUserProfile } from '../../firebase/db';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // We need to create auth user
import { auth, db } from '../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Helper to create user without logging out current admin
// We use a secondary app instance to handle the creation
const secondaryApp = initializeApp({
    apiKey: "AIzaSyDs1rldmSrRpLE_73rgQNfLxkOBrZvEQyc", // Same as main app
    authDomain: "future-fs-02.firebaseapp.com",
    projectId: "future-fs-02",
}, "Secondary");

const secondaryAuth = getAuth(secondaryApp);

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddAdmin, setShowAddAdmin] = useState(false);
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

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        try {
            // 1. Create Auth User (using secondary app to avoid logout)
            const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newAdmin.email, newAdmin.password);
            const user = userCredential.user;

            // 2. Create Profile in 'users' collection with role: 'admin'
            // We use the main app's DB instance which we are already authenticated with as actual admin
            // This assumes current admin has write permissions to users collection (which they should)
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

            // Clean up: Sign out the secondary auth user immediately
            secondaryAuth.signOut();

        } catch (err) {
            console.error("Error creating admin:", err);
            alert("Error: " + err.message);
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className="admin-users">
            <div className="admin-page-header">
                <h1>Users & Admins</h1>
                <button
                    onClick={() => setShowAddAdmin(true)}
                    className="btn-primary"
                >
                    👤 Add New Admin
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

            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.uid}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div className="user-avatar" style={{ width: '40px', height: '40px' }}>
                                            {user.fullName?.charAt(0) || user.email.charAt(0)}
                                        </div>
                                        <div>
                                            <strong>{user.fullName || 'No Name'}</strong>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`role-badge ${user.role}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => toggleRole(user)}
                                        className="btn-secondary btn-small"
                                    >
                                        {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsersPage;
