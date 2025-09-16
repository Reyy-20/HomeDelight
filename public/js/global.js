// global-auth.js - Script para manejar autenticación en todas las páginas

// Configuración de Firebase (mismo config que usas)
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

// Inicializar Firebase solo si no está inicializado
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Función para actualizar el botón de autenticación
function updateAuthButton(isAuthenticated, userData = null) {
    const authButton = document.getElementById('authButton');
    
    if (!authButton) {
        console.warn('Botón de autenticación no encontrado');
        return;
    }

    if (isAuthenticated) {
        // Usuario logueado - cambiar a Dashboard
        authButton.href = 'gptdashboard.html';
        authButton.textContent = 'Dashboard';
        authButton.classList.add('authenticated');
        
        
        console.log('Botón actualizado: Dashboard');
    } else {
        // Usuario no logueado - cambiar a Login/Register
        authButton.href = 'login&register2.html';
        authButton.textContent = 'LogIn/Register';
        authButton.classList.remove('authenticated');
        
        
        console.log('Botón actualizado: LogIn/Register');
    }
}

// Función para verificar estado de autenticación usando localStorage
function checkAuthFromLocalStorage() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userEmail = localStorage.getItem('userEmail');
    const userType = localStorage.getItem('userType');
    
    if (isAuthenticated === 'true' && userEmail) {
        updateAuthButton(true, { email: userEmail, userType: userType });
        return true;
    }
    
    updateAuthButton(false);
    return false;
}

// Función principal para manejar el estado de autenticación
function handleAuthState() {
    // Primero verificar localStorage para respuesta inmediata
    const hasLocalAuth = checkAuthFromLocalStorage();
    
    // Luego verificar con Firebase para estar seguro
    auth.onAuthStateChanged(function(user) {
        if (user) {
            console.log('Usuario autenticado:', user.email);
            
            // Actualizar localStorage si no está actualizado
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userId', user.uid);
            
            // Obtener información adicional del usuario
            db.collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        localStorage.setItem('userType', userData.userType);
                        updateAuthButton(true, userData);
                    } else {
                        updateAuthButton(true, { email: user.email });
                    }
                })
                .catch((error) => {
                    console.warn('Error al obtener datos del usuario:', error);
                    updateAuthButton(true, { email: user.email });
                });
                
        } else {
            console.log('Usuario no autenticado');
            
            // Limpiar localStorage
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userId');
            localStorage.removeItem('userType');
            
            updateAuthButton(false);
        }
    });
}

// Función para manejar logout desde cualquier página
function handleGlobalLogout() {
    auth.signOut().then(() => {
        console.log('Sesión cerrada exitosamente');
        localStorage.clear();
        updateAuthButton(false);
        
        // Redirigir solo si estamos en página protegida
        const currentPage = window.location.pathname.split('/').pop();
        const protectedPages = ['gptdashboard.html', 'dashboard.html', 'profile.html'];
        
        if (protectedPages.includes(currentPage)) {
            window.location.href = 'login&register2.html';
        }
    }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
    });
}

// Función para verificar si el usuario debe estar autenticado en la página actual
function checkPageAuth() {
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['gptdashboard.html', 'dashboard.html', 'profile.html'];
    const authPages = ['login&register2.html', 'login.html', 'register.html'];
    
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const user = firebase.auth().currentUser;
    
    if (protectedPages.includes(currentPage) && !isAuthenticated && !user) {
        console.log('Página protegida, redirigiendo al login...');
        window.location.href = 'login&register2.html';
    }
    
    if (authPages.includes(currentPage) && isAuthenticated && user) {
        console.log('Usuario ya autenticado, redirigiendo al dashboard...');
        window.location.href = 'gptdashboard.html';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando manejo global de autenticación...');
    
    // Esperar un poco para que Firebase se inicialice completamente
    setTimeout(() => {
        handleAuthState();
        checkPageAuth();
    }, 100);
    
    // Escuchar cambios en localStorage (para sincronizar entre pestañas)
    window.addEventListener('storage', function(e) {
        if (e.key === 'isAuthenticated') {
            console.log('Estado de autenticación cambió en otra pestaña');
            handleAuthState();
        }
    });
});

// Función de utilidad para otras páginas
window.updateAuthButton = updateAuthButton;
window.handleGlobalLogout = handleGlobalLogout;
window.checkAuthState = handleAuthState;

// Función para llamar desde HTML si es necesario
window.logout = function() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        handleGlobalLogout();
    }
};

// Prevenir que Firebase se inicialice múltiples veces
window.globalAuthInitialized = true;