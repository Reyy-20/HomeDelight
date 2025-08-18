// Firebase Error Handler
class FirebaseErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        // Listen for Firebase connection errors
        if (window.db) {
            this.setupErrorHandling();
        } else {
            console.error('Firebase not initialized properly');
        }
    }

    setupErrorHandling() {
        // Handle Firestore connection errors
        window.db.enableNetwork().catch(error => {
            console.error('Firestore network error:', error);
            this.handleConnectionError(error);
        });

        // Handle authentication errors
        if (window.auth) {
            window.auth.onAuthStateChanged((user) => {
                if (user) {
                    console.log('User authenticated:', user.email);
                }
            }, (error) => {
                console.error('Authentication error:', error);
                this.handleAuthError(error);
            });
        }
    }

    handleConnectionError(error) {
        const errorMessage = this.getErrorMessage(error);
        
        // Show user-friendly error message
        if (window.notificationManager) {
            window.notificationManager.showError(`Error de conexión: ${errorMessage}`);
        } else {
            alert(`Error de conexión: ${errorMessage}`);
        }

        // Log detailed error for debugging
        console.error('Firebase connection error details:', {
            code: error.code,
            message: error.message,
            stack: error.stack
        });
    }

    handleAuthError(error) {
        const errorMessage = this.getErrorMessage(error);
        
        if (window.notificationManager) {
            window.notificationManager.showError(`Error de autenticación: ${errorMessage}`);
        } else {
            alert(`Error de autenticación: ${errorMessage}`);
        }
    }

    getErrorMessage(error) {
        switch (error.code) {
            case 'permission-denied':
                return 'No tienes permisos para acceder a la base de datos. Verifica las reglas de Firestore.';
            case 'unavailable':
                return 'La base de datos no está disponible. Verifica tu conexión a internet.';
            case 'unauthenticated':
                return 'No estás autenticado. Inicia sesión nuevamente.';
            case 'not-found':
                return 'El recurso no fue encontrado.';
            case 'already-exists':
                return 'El recurso ya existe.';
            case 'resource-exhausted':
                return 'Se agotaron los recursos. Inténtalo más tarde.';
            case 'failed-precondition':
                return 'La operación falló debido a una condición previa.';
            case 'aborted':
                return 'La operación fue abortada.';
            case 'out-of-range':
                return 'La operación está fuera del rango válido.';
            case 'unimplemented':
                return 'La operación no está implementada.';
            case 'internal':
                return 'Error interno del servidor.';
            case 'data-loss':
                return 'Se perdió información.';
            case 'unknown':
                return 'Error desconocido.';
            default:
                return error.message || 'Error de conexión con Firebase.';
        }
    }

    // Test Firebase connection
    async testConnection() {
        try {
            const testDoc = window.db.collection('test').doc('connection-test');
            await testDoc.set({
                timestamp: new Date(),
                test: true
            });
            
            // Clean up test document
            await testDoc.delete();
            
            console.log('Firebase connection test successful');
            return true;
        } catch (error) {
            console.error('Firebase connection test failed:', error);
            this.handleConnectionError(error);
            return false;
        }
    }

    // Retry mechanism for failed operations
    async retryOperation(operation, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                console.error(`Attempt ${i + 1} failed:`, error);
                
                if (i === maxRetries - 1) {
                    throw error;
                }
                
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }
}

// Initialize error handler
const firebaseErrorHandler = new FirebaseErrorHandler();

// Export for use in other files
window.firebaseErrorHandler = firebaseErrorHandler; 