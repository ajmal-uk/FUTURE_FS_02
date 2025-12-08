import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    getDocs,
    addDoc,
    deleteDoc,
    serverTimestamp,
    query,
    where,
    orderBy
} from "firebase/firestore";
import { db } from "./config";

// --- Users ---

export const createUserProfile = async (uid, profileData) => {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
        fullName: "",
        email: "",
        role: "user", // default
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        provider: "password",
        createdAt: serverTimestamp(),
        ...profileData
    }, { merge: true });
};

export const getUserProfile = async (uid) => {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
};

export const updateUserProfile = async (uid, data) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data);
};

export const banUser = async (uid) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { isBanned: true, bannedAt: serverTimestamp() });
};

export const unbanUser = async (uid) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { isBanned: false, bannedAt: null });
};

// --- Products ---

export const createProduct = async (product) => {
    const productsRef = collection(db, "products");
    await addDoc(productsRef, {
        ...product,
        createdAt: serverTimestamp()
    });
};

export const getAllProducts = async () => {
    const productsRef = collection(db, "products");
    const q = query(productsRef); // Can add orderBy here later
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getProductById = async (id) => {
    const productRef = doc(db, "products", id);
    const docSnap = await getDoc(productRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
};

export const updateProduct = async (id, data) => {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, data);
};

export const deleteProduct = async (id) => {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
};

// --- Product Offers/Deals (Admin Scheduling) ---
export const setProductOffer = async (productId, offerData) => {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
        offer: {
            discountPercent: offerData.discountPercent,
            offerTitle: offerData.offerTitle || null,
            startDate: offerData.startDate,
            endDate: offerData.endDate,
            isFeatured: offerData.isFeatured || false,
            createdAt: serverTimestamp()
        }
    });
};

export const removeProductOffer = async (productId) => {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
        offer: null
    });
};

export const getActiveOffers = async () => {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    const now = new Date();

    return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(product => {
            if (!product.offer) return false;
            const startDate = new Date(product.offer.startDate);
            const endDate = new Date(product.offer.endDate);
            return now >= startDate && now <= endDate;
        });
};

export const getFeaturedDeals = async () => {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    const now = new Date();

    return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(product => {
            if (!product.offer || !product.offer.isFeatured) return false;
            const startDate = new Date(product.offer.startDate);
            const endDate = new Date(product.offer.endDate);
            return now >= startDate && now <= endDate;
        })
        .slice(0, 6); // Limit to 6 featured deals
};

// --- Orders ---

// Order statuses:
// - pending_approval (initial - waiting for admin)
// - approved (admin approved, ready for processing)
// - in_progress (being prepared/packed)
// - shipped (dispatched)
// - delivered (completed)
// - cancelled (admin approved cancel request)

export const createOrder = async (order) => {
    const ordersRef = collection(db, "orders");
    const docRef = await addDoc(ordersRef, {
        ...order,
        status: "pending_approval",
        cancelRequested: false,
        cancelReason: null,
        cancelApproved: null,
        estimatedDelivery: null,
        createdAt: serverTimestamp()
    });
    return docRef.id;
};

export const getOrdersByUser = async (uid) => {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("userId", "==", uid));
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by createdAt descending (client-side to avoid composite index requirement)
    return orders.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
        return dateB - dateA;
    });
};

export const getAllOrders = async () => {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// --- Admin Users Management (Optional but requested) ---
export const getAllUsers = async () => {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
}

// --- Address Management ---
export const getUserAddresses = async (uid) => {
    const addressesRef = collection(db, "users", uid, "addresses");
    const snapshot = await getDocs(addressesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addUserAddress = async (uid, addressData) => {
    const addressesRef = collection(db, "users", uid, "addresses");
    const docRef = await addDoc(addressesRef, {
        ...addressData,
        createdAt: serverTimestamp()
    });
    return docRef.id;
};

export const deleteUserAddress = async (uid, addressId) => {
    const addressRef = doc(db, "users", uid, "addresses", addressId);
    await deleteDoc(addressRef);
};

export const setDefaultAddress = async (uid, addressId) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { defaultAddressId: addressId });
};

// --- Order Updates ---
export const updateOrderStatus = async (orderId, status) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status, updatedAt: serverTimestamp() });
};

export const updateOrderPayment = async (orderId, paymentData) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
        paymentStatus: paymentData.status,
        paymentId: paymentData.paymentId,
        paymentMethod: paymentData.method,
        paidAt: serverTimestamp()
    });
};

// --- Order Workflow (Admin) ---
export const approveOrder = async (orderId) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
        status: "approved",
        approvedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
};

export const rejectOrder = async (orderId, reason) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
        status: "cancelled",
        rejectionReason: reason,
        rejectedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
};

export const setEstimatedDelivery = async (orderId, date) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
        estimatedDelivery: date,
        updatedAt: serverTimestamp()
    });
};

// --- Cancel Request (User) ---
export const requestOrderCancellation = async (orderId, reason) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
        cancelRequested: true,
        cancelReason: reason,
        cancelRequestedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
};

// --- Cancel Request (Admin) ---
export const approveCancelRequest = async (orderId) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
        status: "cancelled",
        cancelApproved: true,
        cancelApprovedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
};

export const rejectCancelRequest = async (orderId) => {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
        cancelApproved: false,
        cancelRejectedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
};

// --- Wishlist (User Subcollection) ---
export const getUserWishlist = async (uid) => {
    const wishlistRef = collection(db, "users", uid, "wishlist");
    const snapshot = await getDocs(wishlistRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addToWishlist = async (uid, product) => {
    const wishlistRef = doc(db, "users", uid, "wishlist", product.id);
    await setDoc(wishlistRef, {
        ...product,
        addedAt: serverTimestamp()
    });
};

export const removeFromWishlist = async (uid, productId) => {
    const wishlistRef = doc(db, "users", uid, "wishlist", productId);
    await deleteDoc(wishlistRef);
};

export const isInWishlist = async (uid, productId) => {
    const wishlistRef = doc(db, "users", uid, "wishlist", productId);
    const docSnap = await getDoc(wishlistRef);
    return docSnap.exists();
};

// --- Database Seeding ---
export const seedDatabase = async () => {
    // Seed sample products if none exist
    const products = await getAllProducts();
    if (products.length === 0) {
        const sampleProducts = [
            {
                name: "Premium Wireless Headphones",
                description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
                price: 199.99,
                category: "Electronics",
                imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
                stock: 50
            },
            {
                name: "Smart Watch Pro",
                description: "Advanced smartwatch with health monitoring, GPS, and water resistance.",
                price: 299.99,
                category: "Electronics",
                imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
                stock: 30
            },
            {
                name: "Designer Backpack",
                description: "Stylish and functional backpack perfect for work or travel.",
                price: 89.99,
                category: "Fashion",
                imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
                stock: 100
            },
            {
                name: "Minimalist Desk Lamp",
                description: "Modern LED desk lamp with adjustable brightness and color temperature.",
                price: 59.99,
                category: "Home",
                imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
                stock: 75
            },
            {
                name: "Organic Coffee Beans",
                description: "Premium single-origin coffee beans, freshly roasted.",
                price: 24.99,
                category: "Food",
                imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
                stock: 200
            },
            {
                name: "Fitness Yoga Mat",
                description: "Eco-friendly non-slip yoga mat for home workouts.",
                price: 45.99,
                category: "Sports",
                imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
                stock: 80
            },
            {
                name: "Portable Bluetooth Speaker",
                description: "Compact waterproof speaker with powerful bass.",
                price: 79.99,
                category: "Electronics",
                imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
                stock: 60
            },
            {
                name: "Leather Wallet",
                description: "Genuine leather wallet with RFID protection.",
                price: 49.99,
                category: "Fashion",
                imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
                stock: 120
            }
        ];

        for (const product of sampleProducts) {
            await createProduct(product);
        }
        console.log("Sample products seeded successfully");
    }

    return true;
};
