import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebaseConfig";

const auth = getAuth(app);

// Login Empresas
const empresaForm = document.getElementById('empresa-login-form');
if (empresaForm) {
  empresaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = empresaForm.email.value;
    const password = empresaForm.password.value;
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = '';
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '../pages/dashboard.html';
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        errorDiv.textContent = 'El correo no está registrado.';
      } else if (error.code === 'auth/wrong-password') {
        errorDiv.textContent = 'Contraseña incorrecta.';
      } else {
        errorDiv.textContent = 'Error al iniciar sesión: ' + error.message;
      }
    }
  });
}

// Login Negocios
const businessForm = document.getElementById('business-login-form');
if (businessForm) {
  businessForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = businessForm.email.value;
    const password = businessForm.password.value;
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = '';
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '../pages/dashboard.html';
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        errorDiv.textContent = 'El correo no está registrado.';
      } else if (error.code === 'auth/wrong-password') {
        errorDiv.textContent = 'Contraseña incorrecta.';
      } else {
        errorDiv.textContent = 'Error al iniciar sesión: ' + error.message;
      }
    }
  });
}
