import { createContext, useContext, useEffect, useState } from "react";
import { listenToAuthChanges } from "../firebase/auth";
import { getUserProfile } from "../firebase/db";
import { db } from "../firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = listenToAuthChanges(async (user) => {
            setCurrentUser(user);

            if (user) {
                // Listen to real-time updates on the user profile
                const userRef = doc(db, "users", user.uid);
                const unsubscribeProfile = onSnapshot(userRef, (doc) => {
                    if (doc.exists()) {
                        setUserProfile(doc.data());
                    } else {
                        setUserProfile(null);
                    }
                    setLoading(false);
                }, () => {
                    // If permission denied, we might still want to stop loading
                    setLoading(false);
                });

                return () => unsubscribeProfile();
            } else {
                setUserProfile(null);
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    const isAdmin = userProfile?.role === "admin";

    const value = {
        currentUser,
        userProfile,
        isAdmin,
        loading
    };

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'sans-serif',
                flexDirection: 'column',
                gap: '1rem',
                background: '#1a1a2e',
                color: 'white'
            }}>
                <div className="loader" style={{
                    border: '4px solid rgba(255,255,255,0.1)',
                    borderTop: '4px solid #667eea',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p>Loading FutureStore...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
