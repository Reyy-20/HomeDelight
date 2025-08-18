import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebaseConfig.js";
import { registrarUsuario } from "./firestore.js";

const auth = getAuth(app);

const registerForm = document.getElementById('empresa-register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = registerForm.email.value;
    const password = registerForm.password.value;
    const confirmPassword = registerForm['confirm-password'].value;
    const errorDiv = document.getElementById('register-error');
    errorDiv.textContent = '';
    if (password !== confirmPassword) {
      errorDiv.textContent = 'Las contraseñas no coinciden.';
      return;
    }
    if (password.length < 6) {
      errorDiv.textContent = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await registrarUsuario(user.uid, user.email, "empresa");
      window.location.href = 'empresa-login.html';
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        errorDiv.textContent = 'El correo ya está registrado.';
      } else if (error.code === 'auth/invalid-email') {
        errorDiv.textContent = 'El correo no es válido.';
      } else {
        errorDiv.textContent = 'Error al registrar: ' + error.message;
      }
    }
  });
} 