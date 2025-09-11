// auth.js - Sistema de autenticación completo

// Configuración de Firebase (reemplaza con tu configuración)
const firebaseConfig = {
    apiKey: "AIzaSyCWW3XgtGG7agkUkdUiS7kU4X7ew2DjTic",
    authDomain: "expo-project-senior-6bfea.firebaseapp.com",
    databaseURL: "https://expo-project-senior-6bfea-default-rtdb.firebaseio.com",
    projectId: "expo-project-senior-6bfea",
    storageBucket: "expo-project-senior-6bfea.firebasestorage.app",
    messagingSenderId: "188431803500",
    appId: "1:188431803500:web:c6f64089f19ac1b64ca449",
    measurementId: "G-5Q8NB4WFK6"
};

// Inicializar Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Clase para manejar la autenticación
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.initializeAuth();
    }

    // Inicializar autenticación al cargar la página
    async initializeAuth() {
        const localUser = this.getLocalUserData();
        if (localUser) {
            this.currentUser = localUser;
            this.updateNavigation(true);

            // Sincronizar con Firebase si hay conexión
            try {
                await this.syncWithFirebase();
            } catch (error) {
                console.log('Trabajando offline - datos locales utilizados');
            }
        } else {
            this.updateNavigation(false);
        }
    }

    // Registrar nuevo usuario
    async register(userData) {
        try {
            // Validar datos
            if (!this.validateUserData(userData)) {
                throw new Error('Datos de usuario inválidos');
            }

            let firebaseUser = null;

            // Intentar registro en Firebase
            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    userData.email,
                    userData.password
                );
                firebaseUser = userCredential.user;

                // Guardar datos adicionales en Firestore
                await setDoc(doc(db, 'users', firebaseUser.uid), {
                    fullName: userData.fullName,
                    email: userData.email,
                    phone: userData.phone || '',
                    location: userData.location || '',
                    bio: userData.bio || '',
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString()
                });

            } catch (firebaseError) {
                console.warn('Error con Firebase, guardando solo localmente:', firebaseError.message);
            }

            // Preparar datos del usuario
            const userToSave = {
                uid: firebaseUser?.uid || this.generateLocalUID(),
                fullName: userData.fullName,
                email: userData.email,
                phone: userData.phone || '',
                location: userData.location || '',
                bio: userData.bio || '',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                isOnline: firebaseUser ? true : false
            };

            // Guardar localmente SIEMPRE
            this.saveLocalUserData(userToSave);
            this.currentUser = userToSave;

            // Actualizar navegación
            this.updateNavigation(true);

            this.showNotification('Usuario registrado exitosamente', 'success');
            return { success: true, user: userToSave };

        } catch (error) {
            this.showNotification('Error al registrar usuario: ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Iniciar sesión
    async login(email, password) {
        try {
            let firebaseUser = null;
            let userData = null;

            // Intentar login con Firebase
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                firebaseUser = userCredential.user;

                // Obtener datos del usuario de Firestore
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                if (userDoc.exists()) {
                    userData = {
                        uid: firebaseUser.uid,
                        ...userDoc.data(),
                        isOnline: true,
                        lastLogin: new Date().toISOString()
                    };

                    // Actualizar última conexión en Firebase
                    await setDoc(doc(db, 'users', firebaseUser.uid), {
                        ...userDoc.data(),
                        lastLogin: new Date().toISOString()
                    }, { merge: true });
                }

            } catch (firebaseError) {
                console.warn('Error con Firebase, intentando login local:', firebaseError.message);

                // Intentar login local
                const localUser = this.getLocalUserData();
                if (localUser && localUser.email === email) {
                    userData = {
                        ...localUser,
                        isOnline: false,
                        lastLogin: new Date().toISOString()
                    };
                } else {
                    throw new Error('Credenciales incorrectas o usuario no encontrado');
                }
            }

            if (!userData) {
                throw new Error('No se pudieron cargar los datos del usuario');
            }

            // Guardar/actualizar datos localmente
            this.saveLocalUserData(userData);
            this.currentUser = userData;

            // Actualizar navegación
            this.updateNavigation(true);

            this.showNotification('Inicio de sesión exitoso', 'success');
            return { success: true, user: userData };

        } catch (error) {
            this.showNotification('Error al iniciar sesión: ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Cerrar sesión
    async logout() {
        try {
            // Cerrar sesión en Firebase si está conectado
            if (this.currentUser?.isOnline) {
                await signOut(auth);
            }

            // Limpiar datos locales
            localStorage.removeItem('homeDelight_userData');
            localStorage.removeItem('homeDelight_userPreferences');
            this.currentUser = null;

            // Actualizar navegación
            this.updateNavigation(false);

            this.showNotification('Sesión cerrada correctamente', 'success');

            // Redirigir a página principal
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);

        } catch (error) {
            this.showNotification('Error al cerrar sesión: ' + error.message, 'error');
        }
    }

    // Actualizar perfil de usuario
    async updateProfile(newData) {
        try {
            if (!this.currentUser) {
                throw new Error('No hay usuario autenticado');
            }

            const updatedUser = {
                ...this.currentUser,
                ...newData,
                updatedAt: new Date().toISOString()
            };

            // Actualizar en Firebase si está online
            if (this.currentUser.isOnline && this.currentUser.uid) {
                try {
                    await setDoc(doc(db, 'users', this.currentUser.uid), updatedUser, { merge: true });
                } catch (firebaseError) {
                    console.warn('Error actualizando en Firebase:', firebaseError.message);
                }
            }

            // Actualizar localmente SIEMPRE
            this.saveLocalUserData(updatedUser);
            this.currentUser = updatedUser;

            this.showNotification('Perfil actualizado correctamente', 'success');
            return { success: true, user: updatedUser };

        } catch (error) {
            this.showNotification('Error al actualizar perfil: ' + error.message, 'error');
            return { success: false, error: error.message };
        }
    }

    // Sincronizar con Firebase cuando hay conexión
    async syncWithFirebase() {
        if (!this.currentUser || this.currentUser.isOnline) return;

        try {
            // Intentar reconectar con Firebase
            const userCredential = await signInWithEmailAndPassword(
                auth,
                this.currentUser.email,
                'stored_password' // En producción, manejar esto de forma segura
            );

            if (userCredential.user) {
                // Sincronizar datos locales con Firebase
                await setDoc(doc(db, 'users', userCredential.user.uid), {
                    ...this.currentUser,
                    uid: userCredential.user.uid,
                    isOnline: true,
                    lastSync: new Date().toISOString()
                }, { merge: true });

                // Actualizar estado local
                this.currentUser.uid = userCredential.user.uid;
                this.currentUser.isOnline = true;
                this.saveLocalUserData(this.currentUser);

                this.showNotification('Datos sincronizados con la nube', 'success');
            }
        } catch (error) {
            console.log('No se pudo sincronizar con Firebase:', error.message);
        }
    }

    // Funciones auxiliares
    validateUserData(userData) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!userData.fullName || userData.fullName.trim().length < 2) {
            throw new Error('El nombre debe tener al menos 2 caracteres');
        }

        if (!userData.email || !emailRegex.test(userData.email)) {
            throw new Error('Email inválido');
        }

        if (!userData.password || userData.password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        return true;
    }

    generateLocalUID() {
        return 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    saveLocalUserData(userData) {
        try {
            localStorage.setItem('homeDelight_userData', JSON.stringify(userData));
        } catch (error) {
            console.error('Error guardando datos localmente:', error);
        }
    }

    getLocalUserData() {
        try {
            const userData = localStorage.getItem('homeDelight_userData');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error leyendo datos locales:', error);
            return null;
        }
    }

    // Actualizar navegación basada en estado de autenticación
    updateNavigation(isLoggedIn) {
        const navBtn = document.querySelector('.Nav-btn');
        const userInfo = document.querySelector('.user-info');

        if (navBtn) {
            if (isLoggedIn) {
                navBtn.textContent = 'Dashboard';
                navBtn.href = 'dashboard.html';
                navBtn.onclick = (e) => {
                    e.preventDefault();
                    window.location.href = 'dashboard.html';
                };
            } else {
                navBtn.textContent = 'LogIn/Register';
                navBtn.href = 'login&register2.html';
                navBtn.onclick = null;
            }
        }

        // Actualizar información del usuario en el header si existe
        if (userInfo && isLoggedIn && this.currentUser) {
            const userName = userInfo.querySelector('.user-name');
            if (userName) {
                userName.textContent = this.currentUser.fullName || 'Usuario';
            }
        }

        // Mostrar/ocultar elementos basados en autenticación
        document.querySelectorAll('.auth-required').forEach(element => {
            element.style.display = isLoggedIn ? 'block' : 'none';
        });

        document.querySelectorAll('.guest-only').forEach(element => {
            element.style.display = isLoggedIn ? 'none' : 'block';
        });
    }

    // Sistema de notificaciones
    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Estilos para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            animation: slideInRight 0.3s ease-out;
            ${type === 'success' ? 'background: #28a745;' : ''}
            ${type === 'error' ? 'background: #dc3545;' : ''}
            ${type === 'info' ? 'background: #17a2b8;' : ''}
        `;

        document.body.appendChild(notification);

        // Manejar cierre manual
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
    }

    removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Verificar si el usuario está online (conectado a Firebase)
    isOnline() {
        return this.currentUser?.isOnline || false;
    }
}

// Crear instancia global del gestor de autenticación
const authManager = new AuthManager();

// Exponer funciones globales para uso en formularios
window.authManager = authManager;

// Funciones de conveniencia para formularios
window.registerUser = async (userData) => {
    return await authManager.register(userData);
};

window.loginUser = async (email, password) => {
    return await authManager.login(email, password);
};

window.logoutUser = async () => {
    return await authManager.logout();
};

window.updateUserProfile = async (newData) => {
    return await authManager.updateProfile(newData);
};

// CSS para las animaciones de notificaciones
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notification-close:hover {
        opacity: 0.8;
    }
`;

// Inyectar estilos
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Proteger rutas que requieren autenticación
function protectRoute() {
    const protectedPages = ['dashboard.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage) && !authManager.isAuthenticated()) {
        window.location.href = 'login&register2.html';
    }
}

// Ejecutar protección de rutas cuando se carga la página
document.addEventListener('DOMContentLoaded', protectRoute);

export { authManager, AuthManager };