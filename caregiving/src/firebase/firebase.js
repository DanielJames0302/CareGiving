// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFVlNxU_2oVtmzK6rEfaLrBHVCIOnfcrw",
  authDomain: "caregiving-c7b26.firebaseapp.com",
  projectId: "caregiving-c7b26",
  storageBucket: "caregiving-c7b26.appspot.com",
  messagingSenderId: "394543433736",
  appId: "1:394543433736:web:16980cded60e447c0669bd"
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)