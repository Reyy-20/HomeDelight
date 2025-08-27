// User Status Manager for HomeDelight
// Maneja la visualización del estado del usuario y acceso al dashboard

class UserStatusManager {
    constructor() {
        this.init();
    }

    init() {
        // Verificar estado de autenticación al cargar
        this.checkAuthStatus();
        
        // Escuchar cambios en el localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === 'isAuthenticated' || e.key === 'userType') {
                this.checkAuthStatus();
            }
        });
        
        // Escuchar mensajes de otras páginas
        window.addEventListener('message', (e) => {
            if (e.data.type === 'auth-status-changed') {
                this.checkAuthStatus();
            }
        });
    }

    checkAuthStatus() {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const userType = localStorage.getItem('userType');
        const userEmail = localStorage.getItem('userEmail');
        const userName = localStorage.getItem('userName');
        
        if (isAuthenticated && userType && userEmail && userName) {
            // Usuario está autenticado, mostrar estado
            this.showUserStatus(userType, userEmail, userName);
        } else {
            // Usuario no está autenticado, limpiar estado
            this.clearUserStatus();
        }
    }

    showUserStatus(userType, userEmail, userName) {
        // Cambiar la navegación de "LogIn/register" a icono de usuario
        this.updateNavigation(userType, userEmail, userName);
        
        // Crear o actualizar el indicador de usuario
        let userIndicator = document.getElementById('user-indicator');
        
        if (!userIndicator) {
            userIndicator = document.createElement('div');
            userIndicator.id = 'user-indicator';
            userIndicator.className = 'user-indicator';
            
            // Insertar después del header o en una ubicación apropiada
            const header = document.querySelector('header') || document.querySelector('.header') || document.body.firstChild;
            if (header) {
                header.parentNode.insertBefore(userIndicator, header.nextSibling);
            } else {
                document.body.insertBefore(userIndicator, document.body.firstChild);
            }
        }
        
        // Actualizar contenido del indicador
        userIndicator.innerHTML = `
            <div class="user-status-display">
                <div class="user-info">
                    <i class="fas fa-user-circle"></i>
                    <span class="user-name">${userName}</span>
                    <span class="user-type">${userType === 'client' ? 'Cliente' : 'Negocio'}</span>
                </div>
                <div class="user-actions">
                    <button class="btn-dashboard" onclick="openDashboard()">
                        <i class="fas fa-tachometer-alt"></i>
                        Dashboard
                    </button>
                    <button class="btn-logout" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        `;
        
        // Agregar estilos CSS
        this.addUserIndicatorStyles();
        
        // Mostrar notificación de login exitoso
        this.showLoginNotification(userName);
        
        // Agregar estilos para las notificaciones
        this.addNotificationStyles();
    }

    showLoginNotification(userName) {
        // Crear notificación de bienvenida
        const notification = document.createElement('div');
        notification.className = 'login-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>¡Bienvenido, ${userName}! Has iniciado sesión correctamente.</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Agregar estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            border-radius: 8px;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 350px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        `;
        
        // Agregar estilos para el botón de cerrar
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.style.cssText = `
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                margin-left: auto;
            `;
        }
        
        // Agregar a la página
        document.body.appendChild(notification);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('removing');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    addNotificationStyles() {
        // Verificar si ya existen los estilos
        if (document.getElementById('notification-styles')) {
            return;
        }
        
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification {
                animation: slideIn 0.3s ease-out;
            }
            
            .notification.removing {
                animation: slideOut 0.3s ease-in;
            }
        `;
        document.head.appendChild(styles);
    }

    hideUserStatus() {
        const userIndicator = document.getElementById('user-indicator');
        if (userIndicator) {
            userIndicator.remove();
        }
    }

    openDashboard() {
        const userType = localStorage.getItem('userType');
        
        if (userType === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            // Usar el dashboard existente para todos los tipos de usuario
            console.log('Abriendo dashboard existente...');
            window.location.href = 'gptdashboard.html';
        }
    }

    async logout() {
        try {
            // Mostrar confirmación
            if (!confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                return;
            }
            
            // Limpiar localStorage
            localStorage.removeItem('userType');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userId');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userName');
            
            // Cerrar sesión en Firebase si está disponible
            if (typeof firebase !== 'undefined' && firebase.auth) {
                try {
                    await firebase.auth().signOut();
                    console.log('Sesión cerrada en Firebase');
                } catch (firebaseError) {
                    console.error('Error al cerrar sesión en Firebase:', firebaseError);
                }
            }
            
            // Limpiar estado del usuario
            this.clearUserStatus();
            
            // Mostrar notificación de logout
            this.showLogoutNotification();
            
            // Redirigir a la página principal después de un breve delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } catch (error) {
            console.error('Error durante el logout:', error);
            // Aún así, limpiar el estado local
            this.clearUserStatus();
            window.location.href = 'index.html';
        }
    }

    showLogoutNotification() {
        // Crear notificación de logout
        const notification = document.createElement('div');
        notification.className = 'logout-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-sign-out-alt"></i>
                <span>Sesión cerrada correctamente. Redirigiendo...</span>
            </div>
        `;
        
        // Agregar estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: #6c757d;
            color: white;
            border-radius: 8px;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        // Agregar a la página
        document.body.appendChild(notification);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    updateNavigation(userType, userEmail, userName) {
        // Buscar el enlace "LogIn/register" en la navegación
        const loginLink = document.querySelector('a[href="login&register2.html"]');
        
        if (loginLink) {
            // Cambiar el enlace por un icono de usuario
            loginLink.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>${userName}</span>
            `;
            loginLink.href = '#';
            loginLink.className = 'nav-link user-profile-link';
            loginLink.onclick = (e) => {
                e.preventDefault();
                this.openDashboard();
            };
            
            // Agregar estilos para el icono de usuario
            this.addUserProfileStyles();
        }
    }

    addUserProfileStyles() {
        // Verificar si ya existen los estilos
        if (document.getElementById('user-profile-styles')) {
            return;
        }
        
        const styles = document.createElement('style');
        styles.id = 'user-profile-styles';
        styles.textContent = `
            .user-profile-link {
                display: flex !important;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .user-profile-link i {
                font-size: 18px;
                color: var(--primary-gold, #D8AF53);
            }
            
            .user-profile-link:hover {
                transform: translateY(-2px);
                color: var(--secondary-gold, #D3B76D) !important;
            }
            
            .user-profile-link:hover i {
                color: var(--secondary-gold, #D3B76D);
            }
        `;
        document.head.appendChild(styles);
    }

    addUserIndicatorStyles() {
        // Verificar si los estilos ya existen
        if (document.getElementById('user-indicator-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'user-indicator-styles';
        style.textContent = `
            .user-indicator {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 15px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                padding: 15px;
                z-index: 1000;
                min-width: 250px;
                border: 2px solid var(--primary-gold, #D8AF53);
            }

            .user-info {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .user-avatar {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #D8AF53, #D3B76D);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 18px;
            }

            .user-details {
                display: flex;
                flex-direction: column;
                flex: 1;
            }

            .user-name {
                font-weight: 600;
                color: #000;
                font-size: 14px;
            }

            .user-type {
                font-size: 12px;
                color: #929191;
                text-transform: capitalize;
            }

            .user-actions {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .btn-dashboard, .btn-logout {
                padding: 8px 12px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.3s ease;
            }

            .btn-dashboard {
                background: #D8AF53;
                color: white;
            }

            .btn-dashboard:hover {
                background: #D3B76D;
                transform: translateY(-2px);
            }

            .btn-logout {
                background: #f8f9fa;
                color: #6c757d;
                border: 1px solid #dee2e6;
            }

            .btn-logout:hover {
                background: #e9ecef;
                color: #495057;
            }

            @media (max-width: 768px) {
                .user-indicator {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    min-width: auto;
                }

                .user-info {
                    flex-direction: column;
                    text-align: center;
                }

                .user-actions {
                    flex-direction: row;
                    justify-content: center;
                }
            }
        `;

        document.head.appendChild(style);
    }

    clearUserStatus() {
        // Restaurar navegación original
        this.restoreNavigation();
        
        // Remover indicador de usuario
        const userIndicator = document.getElementById('user-indicator');
        if (userIndicator) {
            userIndicator.remove();
        }
        
        // Remover estilos del perfil de usuario
        const userProfileStyles = document.getElementById('user-profile-styles');
        if (userProfileStyles) {
            userProfileStyles.remove();
        }
        
        // Limpiar localStorage
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userName');
    }

    restoreNavigation() {
        // Buscar el enlace de perfil de usuario
        const userProfileLink = document.querySelector('.user-profile-link');
        
        if (userProfileLink) {
            // Restaurar el enlace original "LogIn/register"
            userProfileLink.innerHTML = 'LogIn/register';
            userProfileLink.href = 'login&register2.html';
            userProfileLink.className = 'nav-link';
            userProfileLink.onclick = null;
        }
    }
}

// Inicializar cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si Font Awesome está disponible, si no, cargarlo
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }

    // Inicializar el gestor de estado del usuario
    window.userStatusManager = new UserStatusManager();
});

// Función global para abrir dashboard (para compatibilidad con onclick)
function openDashboard() {
    if (window.userStatusManager) {
        window.userStatusManager.openDashboard();
    }
}

// Función global para logout (para compatibilidad con onclick)
function logout() {
    if (window.userStatusManager) {
        window.userStatusManager.logout();
    }
}
