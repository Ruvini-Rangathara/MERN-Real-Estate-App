// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-estate-c5d24.firebaseapp.com",
    projectId: "mern-estate-c5d24",
    storageBucket: "mern-estate-c5d24.appspot.com",
    messagingSenderId: "1037373907304",
    appId: "1:1037373907304:web:6009e07fabaf5f0d7e36dd"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);