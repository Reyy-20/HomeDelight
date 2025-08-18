// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Configuración de tu proyecto Expo Proyect SENIOR
const firebaseConfig = {
  apiKey: "AIzaSyCWW3XgtGG7agkUkdUiS7kU4X7ew2DjTic",
  authDomain: "expo-project-senior-6bfea.firebaseapp.com",
  projectId: "expo-project-senior-6bfea",
  storageBucket: "expo-project-senior-6bfea.appspot.com",
  messagingSenderId: "188431803500",
  appId: "1:188431803500:web:c6f64089f19ac1b64ca449",
  measurementId: "G-5Q8NB4WFK6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, analytics};