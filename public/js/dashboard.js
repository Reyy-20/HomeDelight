// dashboard.js - Archivo JavaScript específico para el dashboard

// Configuración de Firebase (reutilizada)
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
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Funciones de dashboard
function showSection(sectionId) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));

    // Remover clase active de todos los items del sidebar
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => item.classList.remove('active'));

    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Agregar clase active al item clickeado
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// Función para regresar al marketplace
function goToMarketplace() {
    window.location.href = 'Marketplace.html';
}

// Función para toggle de notificaciones
function toggleNotification(toggle) {
    toggle.classList.toggle('active');
}

// Función para manejar formularios
function handleFormSubmit(formType) {
    console.log(`Formulario de ${formType} enviado correctamente`);
}

// FUNCIÓN DE LOGOUT PARA DASHBOARD
async function handleLogout() {
    console.log('Iniciando proceso de logout desde dashboard...'); // Debug

    // Mostrar confirmación
    if (!confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        return;
    }

    // Encontrar el botón de logout y mostrar indicador de carga
    const logoutBtn = document.querySelector('#logout-btn') || 
                      document.querySelector('.logout-btn') || 
                      document.querySelector('[data-action="logout"]');

    if (logoutBtn) {
        logoutBtn.disabled = true;
        const originalText = logoutBtn.textContent;
        logoutBtn.textContent = 'Cerrando sesión...';
        
        // Función para restaurar el botón después del proceso
        const restoreButton = () => {
            logoutBtn.textContent = originalText;
            logoutBtn.disabled = false;
        };
        
        // Restaurar el botón después de 5 segundos como failsafe
        setTimeout(restoreButton, 5000);
    }

    try {
        console.log('Cerrando sesión en Firebase...'); // Debug
        
        // Cerrar sesión en Firebase Auth
        await auth.signOut();
        
        console.log('Sesión cerrada exitosamente en Firebase'); // Debug

        // Limpiar datos locales
        localStorage.clear();
        sessionStorage.clear();
        
        console.log('Datos locales limpiados'); // Debug

        // Redirigir a la página de login
        window.location.href = 'login&register2.html';

    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        
        // Mostrar error específico
        let errorMessage = 'Error al cerrar sesión';
        switch (error.code) {
            case 'auth/network-request-failed':
                errorMessage = 'Error de conexión. Verifica tu internet';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Demasiados intentos. Intenta más tarde';
                break;
            default:
                errorMessage = `Error: ${error.message}`;
        }
        
        alert(errorMessage);
        
        // Restaurar botón en caso de error
        if (logoutBtn) {
            logoutBtn.textContent = 'Cerrar sesión';
            logoutBtn.disabled = false;
        }
    }
}

// Función alternativa para llamar desde HTML
window.logout = handleLogout;

// Verificar autenticación al cargar el dashboard
function checkDashboardAuth() {
    console.log('Verificando autenticación en dashboard...'); // Debug
    
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    // Si no hay datos de autenticación en localStorage, verificar con Firebase
    if (!isAuthenticated) {
        auth.onAuthStateChanged(function(user) {
            if (!user) {
                console.log('Usuario no autenticado, redirigiendo...'); // Debug
                window.location.href = 'login&register2.html';
            } else {
                console.log('Usuario autenticado:', user.email); // Debug
                
                // Actualizar localStorage con la información del usuario
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userEmail', user.email);
                localStorage.setItem('userId', user.uid);
                
                // Cargar información del usuario en el dashboard
                loadUserInfo(user);
            }
        });
    } else {
        console.log('Usuario autenticado según localStorage'); // Debug
    }
}

// Cargar información del usuario en el dashboard
async function loadUserInfo(user) {
    try {
        // Obtener información adicional del usuario desde Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            console.log('Datos del usuario cargados:', userData); // Debug
            
            // Actualizar la interfaz con la información del usuario
            const userInfoElement = document.querySelector('.user-info');
            if (userInfoElement) {
                const userName = userData.name || userData.businessName || user.email.split('@')[0];
                const userType = userData.userType === 'business' ? 'Negocio' : 'Cliente';
                userInfoElement.textContent = `👤 ${userName} (${userType})`;
            }
            
            // Guardar tipo de usuario en localStorage
            localStorage.setItem('userType', userData.userType);
        }
    } catch (error) {
        console.error('Error al cargar información del usuario:', error);
    }
}

// Configurar event listeners cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard cargado, configurando...'); // Debug
    
    // Verificar autenticación
    checkDashboardAuth();
    
    // Configurar botón de logout
    const logoutBtn = document.querySelector('#logout-btn') || 
                      document.querySelector('.logout-btn');
    
    if (logoutBtn) {
        console.log('Botón de logout encontrado, configurando event listener...'); // Debug
        
        // Remover cualquier onclick existente
        logoutBtn.removeAttribute('onclick');
        
        // Agregar nuevo event listener
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Click en botón de logout detectado'); // Debug
            handleLogout();
        });
        
        // Asegurar que el botón sea clickeable
        logoutBtn.style.cursor = 'pointer';
        logoutBtn.style.backgroundColor = 'transparent';
        logoutBtn.style.border = 'none';
        logoutBtn.style.padding = '10px 15px';
    } else {
        console.warn('Botón de logout no encontrado en el DOM');
    }
    
    // Configurar otros event listeners del dashboard
    setupDashboardEventListeners();
});

// Configurar otros event listeners del dashboard
function setupDashboardEventListeners() {
    // Agregar event listeners a los botones del dashboard
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        if (!button.onclick && button.id !== 'logout-btn') {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.closest('.content-section');
                const sectionTitle = section ? section.querySelector('.section-title')?.textContent : 'Sección';
                console.log(`Acción ejecutada en: ${sectionTitle}`);
            });
        }
    });

    // Animar entrada de estadísticas
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.style.animation = 'fadeIn 0.5s ease forwards';
    });
    
    // Configurar botón de regreso al marketplace
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            goToMarketplace();
        });
    }
}

// Responsive sidebar toggle
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Cerrar sidebar en mobile cuando se hace click fuera
document.addEventListener('click', function(e) {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        const isClickInsideSidebar = sidebar.contains(e.target);
        
        if (!isClickInsideSidebar && window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    }
});

// Monitorear cambios en el estado de autenticación
auth.onAuthStateChanged(function(user) {
    if (!user && window.location.pathname.includes('dashboard')) {
        console.log('Usuario desautenticado, redirigiendo al login...'); // Debug
        localStorage.clear();
        window.location.href = 'login&register2.html';
    }
});