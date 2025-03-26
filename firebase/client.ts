// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBauvXvxkjyEo2LnnPEdFWo05WMIWlNryM",
  authDomain: "interveu-7386b.firebaseapp.com",
  projectId: "interveu-7386b",
  storageBucket: "interveu-7386b.firebasestorage.app",
  messagingSenderId: "184436670011",
  appId: "1:184436670011:web:9f03021bf1eb17660e661e",
  measurementId: "G-XX74800QK6",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
