// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDs1rldmSrRpLE_73rgQNfLxkOBrZvEQyc",
    authDomain: "future-fs-02.firebaseapp.com",
    projectId: "future-fs-02",
    storageBucket: "future-fs-02.firebasestorage.app",
    messagingSenderId: "266672719234",
    appId: "1:266672719234:web:3f69d225d2f557b6e1fb9b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
