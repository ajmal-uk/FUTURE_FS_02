import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider } from "./config";
import { createUserProfile, getUserProfile } from "./db";

// Register with Email
export const registerWithEmail = async ({ email, password, ...profileData }) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create profile in Firestore
        await createUserProfile(user.uid, {
            email,
            ...profileData,
            provider: "password"
        });

        return user;
    } catch (error) {
        throw error;
    }
};

// Login with Email
export const loginWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// Login with Google
export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check if profile exists, if not create basic one
        const profile = await getUserProfile(user.uid);
        if (!profile) {
            await createUserProfile(user.uid, {
                email: user.email,
                fullName: user.displayName,
                provider: "google"
            });
        }
        return user;
    } catch (error) {
        throw error;
    }
};

// Logout
export const logoutUser = () => {
    return signOut(auth);
};

// Listen to Auth Changes
export const listenToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// Seed Admin Helper (Dev only)
// Seed Admin Helper (Robost)
export const seedAdminAccount = async (email = "admin@gmail.com", password = "12345678") => {
    try {
        console.log(`Seeding admin: ${email}`);
        let user;

        try {
            // 1. Try to Create User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            user = userCredential.user;
            console.log("Created new admin auth user");
        } catch (authError) {
            if (authError.code === 'auth/email-already-in-use') {
                console.log("User exists, signing in to update role...");
                // 1b. If exists, sign in
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                user = userCredential.user;
            } else {
                throw authError;
            }
        }

        // 2. Force Set Admin Role in Firestore
        if (user) {
            await createUserProfile(user.uid, {
                email,
                fullName: "Super Admin",
                role: "admin",
                provider: "password"
            });
            console.log("Admin Firestore profile updated successfully");
            return { success: true, user };
        }
        return { success: false, error: "No user object" };
    } catch (error) {
        console.error("Error seeding admin:", error);
        return { success: false, error: error.message };
    }
};
