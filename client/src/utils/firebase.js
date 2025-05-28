// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_FIREBASE_API_KEY,
  authDomain: "e-commerce-clothing-d67b1.firebaseapp.com",
  projectId: "e-commerce-clothing-d67b1",
  storageBucket: "e-commerce-clothing-d67b1.firebasestorage.app",
  messagingSenderId: "577211953166",
  appId: "1:577211953166:web:f6674ed1c2476716214c5f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
