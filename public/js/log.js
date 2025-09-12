// log.js - Funciones de autenticación y manejo de sesión

// Configuración de Firebase (asegurate de que coincida con tu configuración)
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

// Inicializar Firebase si no está inicializado
let auth;
let db;

// Verificar si Firebase ya está inicializado
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

auth = firebase.auth();
db = firebase.firestore();

/**
 * Función principal para cerrar sesión
 * Cierra sesión en Firebase y limpia todos los datos locales
 */
async function handleLogout() {
    try {
        console.log('Iniciando proceso de cierre de sesión...');
        
        // Mostrar confirmación al usuario
        const confirmLogout = confirm('¿Estás seguro de que deseas cerrar sesión?');
        
        if (!confirmLogout) {
            console.log('Cierre de sesión cancelado por el usuario');
            return;
        }

        // Mostrar indicador de carga (opcional)
        showLogoutLoading(true);

        // 1. Cerrar sesión en Firebase
        await auth.signOut();
        console.log('Sesión cerrada en Firebase exitosamente');

        // 2. Limpiar datos del almacenamiento local
        clearLocalStorage();

        // 3. Limpiar datos del almacenamiento de sesión
        clearSessionStorage();

        // 4. Limpiar cookies relacionadas (si las hay)
        clearAuthCookies();

        // 5. Mostrar mensaje de éxito
        showLogoutMessage('Sesión cerrada exitosamente. Redirigiendo...', false);

        // 6. Redirigir después de un breve delay
        setTimeout(() => {
            window.location.href = 'login&register2.html';
        }, 1500);

    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        
        // Mostrar mensaje de error al usuario
        showLogoutMessage('Error al cerrar sesión. Inténtalo de nuevo.', true);
        
        // Aun así, limpiar datos locales y redirigir
        clearLocalStorage();
        clearSessionStorage();
        
        setTimeout(() => {
            window.location.href = 'login&register2.html';
        }, 2000);
        
    } finally {
        // Ocultar indicador de carga
        showLogoutLoading(false);
    }
}

/**
 * Limpia todos los datos del localStorage relacionados con la autenticación
 */
function clearLocalStorage() {
    try {
        // Lista de claves específicas a limpiar
        const keysToRemove = [
            'userType',
            'userEmail', 
            'userId',
            'userName',
            'userPhone',
            'businessName',
            'isAuthenticated',
            'authToken',
            'userSession',
            'lastLogin',
            'userPreferences',
            'dashboardData'
        ];

        // Remover claves específicas
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });

        // Opcional: Limpiar completamente localStorage (comentado por seguridad)
        // localStorage.clear();
        
        console.log('LocalStorage limpiado exitosamente');
    } catch (error) {
        console.error('Error al limpiar localStorage:', error);
    }
}

/**
 * Limpia todos los datos del sessionStorage
 */
function clearSessionStorage() {
    try {
        sessionStorage.clear();
        console.log('SessionStorage limpiado exitosamente');
    } catch (error) {
        console.error('Error al limpiar sessionStorage:', error);
    }
}

/**
 * Limpia cookies relacionadas con la autenticación
 */
function clearAuthCookies() {
    try {
        // Lista de cookies que podrían estar relacionadas con la autenticación
        const cookiesToClear = [
            'authToken',
            'userSession', 
            'rememberMe',
            'lastLogin'
        ];

        cookiesToClear.forEach(cookieName => {
            // Limpiar cookie para el dominio actual
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            // Limpiar cookie para subdominios
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
        });

        console.log('Cookies de autenticación limpiadas');
    } catch (error) {
        console.error('Error al limpiar cookies:', error);
    }
}

/**
 * Muestra/oculta el indicador de carga durante el logout
 */
function showLogoutLoading(show) {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        if (show) {
            logoutBtn.innerHTML = '<span>Cerrando sesión...</span>';
            logoutBtn.style.opacity = '0.7';
            logoutBtn.style.pointerEvents = 'none';
        } else {
            logoutBtn.innerHTML = 'Cerrar sesión';
            logoutBtn.style.opacity = '1';
            logoutBtn.style.pointerEvents = 'auto';
        }
    }
}

/**
 * Muestra mensajes durante el proceso de logout
 */
function showLogoutMessage(message, isError = false) {
    // Crear o encontrar contenedor de mensaje
    let messageContainer = document.getElementById('logout-message');
    
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'logout-message';
        messageContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 9999;
            transition: all 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        document.body.appendChild(messageContainer);
    }

    // Aplicar estilos según el tipo de mensaje
    if (isError) {
        messageContainer.style.backgroundColor = '#f8d7da';
        messageContainer.style.color = '#721c24';
        messageContainer.style.border = '1px solid #f5c6cb';
    } else {
        messageContainer.style.backgroundColor = '#d4edda';
        messageContainer.style.color = '#155724';
        messageContainer.style.border = '1px solid #c3e6cb';
    }

    messageContainer.textContent = message;
    messageContainer.style.display = 'block';
    messageContainer.style.opacity = '1';

    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        if (messageContainer) {
            messageContainer.style.opacity = '0';
            setTimeout(() => {
                if (messageContainer && messageContainer.parentNode) {
                    messageContainer.parentNode.removeChild(messageContainer);
                }
            }, 300);
        }
    }, 3000);
}

/**
 * Verifica si el usuario está autenticado
 */
function checkAuthStatus() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe(); // Desuscribir inmediatamente
            resolve(!!user);
        });
    });
}

/**
 * Función para proteger páginas que requieren autenticación
 */
async function requireAuth() {
    const isAuthenticated = await checkAuthStatus();
    const hasLocalAuth = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated && !hasLocalAuth) {
        console.log('Usuario no autenticado, redirigiendo al login...');
        window.location.href = 'login&register2.html';
        return false;
    }
    
    return true;
}


// Exportar funciones para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleLogout,
        clearLocalStorage,
        clearSessionStorage,
        checkAuthStatus,
        requireAuth
    };
}