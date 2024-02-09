// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBG1Lh5dIAqYt0qmaRR2DYnFD9HLaB9W2U",
  authDomain: "connectheart-c79e2.firebaseapp.com",
  projectId: "connectheart-c79e2",
  storageBucket: "connectheart-c79e2.appspot.com",
  messagingSenderId: "310754350514",
  appId: "1:310754350514:web:7c9dc97e717ac333a1c0ab",
  measurementId: "G-959BXB02DP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)