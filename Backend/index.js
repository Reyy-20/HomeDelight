const express = require('express'); 

const cors = require('cors'); 

const { initializeApp } = require('firebase/app'); 

const { getAuth } = require('firebase/auth'); 

const { getFirestore } = require('firebase/firestore'); 

const { getStorage } = require('firebase/storage'); 

 

const app = express(); 

app.use(cors()); 

app.use(express.json()); 

 

// Configura tus credenciales de Firebase aquí: 

const firebaseConfig = { 
apiKey: "AIzaSyCWW3XgtGG7agkUkdUiS7kU4X7ew2DjTic",
  authDomain: "expo-project-senior-6bfea.firebaseapp.com",
  projectId: "expo-project-senior-6bfea",
  storageBucket: "expo-project-senior-6bfea.firebasestorage.app",
  messagingSenderId: "188431803500",
  appId: "1:188431803500:web:c6f64089f19ac1b64ca449",
  measurementId: "G-5Q8NB4WFK6" 

}; 

 

const firebaseApp = initializeApp(firebaseConfig); 

const auth = getAuth(firebaseApp); 

const db = getFirestore(firebaseApp); 

const storage = getStorage(firebaseApp); 

 

// Ejemplo de ruta 

app.get('/', (req, res) => { 

  res.send('¡Backend funcionando!'); 

}); 

 

// Aquí puedes agregar más rutas para auth, firestore, storage, etc. 

 

app.listen(3000, () => { 

  console.log('Backend corriendo en http://localhost:3000'); 

}); 