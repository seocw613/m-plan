// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// API key
const config = require("./config");
const firebaseKey = config.firebaseKey;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: firebaseKey,
  authDomain: "m-plan-ca6db.firebaseapp.com",
  projectId: "m-plan-ca6db",
  storageBucket: "m-plan-ca6db.appspot.com",
  messagingSenderId: "970579878572",
  appId: "1:970579878572:web:81150019bc04ed1c6db509",
  measurementId: "G-574PFTLE7F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);