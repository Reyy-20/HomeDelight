// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYIZJ6NnfiyHn5oWcbggCfj_cmJVJ96yw",
  authDomain: "expo-project-2fa4a.firebaseapp.com",
  projectId: "expo-project-2fa4a",
  storageBucket: "expo-project-2fa4a.firebasestorage.app",
  messagingSenderId: "221023394114",
  appId: "1:221023394114:web:80042018163db2d925d0db",
  measurementId: "G-4JV41VG4KQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, analytics};