import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
    getUserWishlist,
    addToWishlist as addToWishlistDB,
    removeFromWishlist as removeFromWishlistDB
} from '../firebase/db';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            fetchWishlist();
        } else {
            setWishlistItems([]);
            setLoading(false);
        }
    }, [currentUser]);

    const fetchWishlist = async () => {
        try {
            const items = await getUserWishlist(currentUser.uid);
            setWishlistItems(items);
        } catch (err) {
            console.error('Error fetching wishlist:', err);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (product) => {
        if (!currentUser) return false;
        try {
            await addToWishlistDB(currentUser.uid, product);
            setWishlistItems(prev => [...prev, { ...product, addedAt: new Date() }]);
            return true;
        } catch (err) {
            console.error('Error adding to wishlist:', err);
            return false;
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!currentUser) return false;
        try {
            await removeFromWishlistDB(currentUser.uid, productId);
            setWishlistItems(prev => prev.filter(item => item.id !== productId));
            return true;
        } catch (err) {
            console.error('Error removing from wishlist:', err);
            return false;
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            loading,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            refreshWishlist: fetchWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
