// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-d92c0.firebaseapp.com",
  projectId: "mern-estate-d92c0",
  storageBucket: "mern-estate-d92c0.appspot.com",
  messagingSenderId: "209919479461",
  appId: "1:209919479461:web:9542179252ff03253d874c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
