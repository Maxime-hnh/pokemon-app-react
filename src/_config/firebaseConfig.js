// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzjm7pASl5SAtInnVYu8OEU8UXJmrLT1o",
  authDomain: "pokemon-app-53bb7.firebaseapp.com",
  projectId: "pokemon-app-53bb7",
  storageBucket: "pokemon-app-53bb7.firebasestorage.app",
  messagingSenderId: "699970092149",
  appId: "1:699970092149:web:3a56a03d578c1234074c3c",
  measurementId: "G-113VQ7XQ21"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);
