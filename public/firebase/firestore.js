import { db } from "./firebaseConfig";
import { doc, setDoc, serverTimestamp, collection, onSnapshot } from "firebase/firestore";

// Función para registrar un usuario en Firestore
export async function registrarUsuario(uid, email, tipo = "empresa") {
  await setDoc(doc(db, "usuarios", uid), {
    email,
    uid,
    createdAt: serverTimestamp(),
    tipo
  });
}

// Función para escuchar en tiempo real los usuarios registrados
export function escucharUsuariosRealtime(callback) {
  return onSnapshot(collection(db, "usuarios"), (snapshot) => {
    const usuarios = snapshot.docs.map(doc => doc.data());
    callback(usuarios);
  });
}

// Ejemplo de uso: mostrar en consola en tiempo real
// escucharUsuariosRealtime(usuarios => {
//   console.log("Usuarios registrados en tiempo real:", usuarios);
// });
