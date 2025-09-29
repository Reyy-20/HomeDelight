// Firebase Error Handler
class FirebaseErrorHandler {
    constructor() {
        this.setupGlobalErrorHandling();
    }

    setupGlobalErrorHandling() {
        // Handle Firebase Auth errors
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    console.log('Usuario autenticado:', user.email);
                }
            }, (error) => {
                this.handleAuthError(error);
            });
        }

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            if (event.reason && event.reason.code) {
                this.handleFirebaseError(event.reason);
            }
        });
    }

    handleAuthError(error) {
        console.error('Error de autenticación:', error);
        
        switch (error.code) {
            case 'auth/user-not-found':
                this.showError('Usuario no encontrado');
                break;
            case 'auth/wrong-password':
                this.showError('Contraseña incorrecta');
                break;
            case 'auth/email-already-in-use':
                this.showError('El email ya está en uso');
                break;
            case 'auth/weak-password':
                this.showError('La contraseña es muy débil');
                break;
            case 'auth/invalid-email':
                this.showError('Email inválido');
                break;
            case 'auth/too-many-requests':
                this.showError('Demasiados intentos. Intenta más tarde');
                break;
            default:
                this.showError('Error de autenticación: ' + error.message);
        }
    }

    handleFirebaseError(error) {
        console.error('Error de Firebase:', error);
        
        if (error.code) {
            switch (error.code) {
                case 'permission-denied':
                    this.showError('No tienes permisos para realizar esta acción');
                    break;
                case 'unavailable':
                    this.showError('Servicio temporalmente no disponible');
                    break;
                case 'deadline-exceeded':
                    this.showError('Tiempo de espera agotado');
                    break;
                default:
                    this.showError('Error: ' + error.message);
            }
        }
    }

    showError(message) {
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-message">${message}</span>
                <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add styles
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.innerHTML = `
            <div class="success-content">
                <span class="success-icon">✅</span>
                <span class="success-message">${message}</span>
                <button class="success-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #44ff44;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            if (successDiv.parentElement) {
                successDiv.remove();
            }
        }, 3000);
    }
}

// Initialize error handler
document.addEventListener('DOMContentLoaded', function() {
    window.firebaseErrorHandler = new FirebaseErrorHandler();
});
