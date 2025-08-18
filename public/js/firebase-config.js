// Firebase configuration for Expo Project SENIOR
const firebaseConfig = {
  apiKey: "AIzaSyCWW3XgtGG7agkUkdUiS7kU4X7ew2DjTic",
  authDomain: "expo-project-senior-6bfea.firebaseapp.com",
  projectId: "expo-project-senior-6bfea",
  storageBucket: "expo-project-senior-6bfea.appspot.com",
  messagingSenderId: "188431803500",
  appId: "1:188431803500:web:80042018163db2d925d0db"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = firebase.auth();
const db = firebase.firestore();

// Export for use in other files
window.auth = auth;
window.db = db; 