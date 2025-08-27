// Auth Manager for HomeDelight
// Maneja la autenticación y gestión de usuarios con Firebase

class AuthManager {
    constructor() {
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.currentUser = null;
        this.init();
    }

    init() {
        // Escuchar cambios en el estado de autenticación
        this.auth.onAuthStateChanged((user) => {
            this.currentUser = user;
            if (user) {
                this.updateUserLastLogin(user.uid);
                this.redirectIfAuthenticated();
            }
        });
    }

    // Cliente Login
    async clientLogin(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Verificar que sea un cliente
            const userDoc = await this.db.collection('users').doc(user.uid).get();
            if (userDoc.exists && userDoc.data().userType === 'client') {
                this.saveUserSession(user, 'client');
                return { success: true, message: 'Login exitoso' };
            } else {
                throw new Error('Esta cuenta no está registrada como cliente');
            }
        } catch (error) {
            return this.handleAuthError(error);
        }
    }

    // Cliente Register
    async clientRegister(userData) {
        try {
            const userCredential = await this.auth.createUserWithEmailAndPassword(
                userData.email, 
                userData.password
            );
            const user = userCredential.user;
            
            // Guardar información adicional en Firestore
            await this.db.collection('users').doc(user.uid).set({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                userType: 'client',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            });
            
            return { success: true, message: 'Registro exitoso' };
        } catch (error) {
            return this.handleAuthError(error);
        }
    }

    // Negocio Login
    async businessLogin(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Verificar que sea un negocio
            const userDoc = await this.db.collection('users').doc(user.uid).get();
            if (userDoc.exists && userDoc.data().userType === 'business') {
                if (userDoc.data().status === 'pending') {
                    throw new Error('Tu cuenta está pendiente de aprobación');
                }
                this.saveUserSession(user, 'business');
                return { success: true, message: 'Login exitoso' };
            } else {
                throw new Error('Esta cuenta no está registrada como negocio');
            }
        } catch (error) {
            return this.handleAuthError(error);
        }
    }

    // Negocio Register
    async businessRegister(userData) {
        try {
            const userCredential = await this.auth.createUserWithEmailAndPassword(
                userData.email, 
                userData.password
            );
            const user = userCredential.user;
            
            // Guardar información adicional en Firestore
            await this.db.collection('users').doc(user.uid).set({
                businessName: userData.businessName,
                email: userData.email,
                phone: userData.phone,
                address: userData.address,
                license: userData.license,
                userType: 'business',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'pending' // Para aprobación del administrador
            });
            
            return { success: true, message: 'Registro exitoso. Pendiente de aprobación.' };
        } catch (error) {
            return this.handleAuthError(error);
        }
    }

    // Cerrar sesión
    async logout() {
        try {
            await this.auth.signOut();
            this.clearUserSession();
            return { success: true, message: 'Sesión cerrada' };
        } catch (error) {
            return { success: false, message: 'Error al cerrar sesión' };
        }
    }

    // Guardar sesión del usuario
    saveUserSession(user, userType) {
        localStorage.setItem('userType', userType);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('isAuthenticated', 'true');
    }

    // Limpiar sesión del usuario
    clearUserSession() {
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAuthenticated');
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true';
    }

    // Obtener información del usuario actual
    getCurrentUser() {
        if (this.isAuthenticated()) {
            return {
                uid: localStorage.getItem('userId'),
                email: localStorage.getItem('userEmail'),
                userType: localStorage.getItem('userType')
            };
        }
        return null;
    }

    // Actualizar último login
    async updateUserLastLogin(uid) {
        try {
            await this.db.collection('users').doc(uid).update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Error actualizando último login:', error);
        }
    }

    // Redirigir si está autenticado
    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    }

    // Manejar errores de autenticación
    handleAuthError(error) {
        console.error('Error de autenticación:', error);
        let errorMessage = 'Error de autenticación';
        
        if (error.code) {
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'No existe una cuenta con este email';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Contraseña incorrecta';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Esta cuenta ha sido deshabilitada';
                    break;
                case 'auth/email-already-in-use':
                    errorMessage = 'Ya existe una cuenta con este email';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'La contraseña debe tener al menos 6 caracteres';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
                    break;
                default:
                    errorMessage = error.message || 'Error desconocido';
            }
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        return { success: false, message: errorMessage };
    }

    // Obtener estadísticas de usuarios (para monitoreo)
    async getUserStats() {
        try {
            const usersSnapshot = await this.db.collection('users').get();
            const stats = {
                total: 0,
                clients: 0,
                businesses: 0,
                active: 0,
                pending: 0
            };
            
            usersSnapshot.forEach(doc => {
                const userData = doc.data();
                stats.total++;
                
                if (userData.userType === 'client') {
                    stats.clients++;
                } else if (userData.userType === 'business') {
                    stats.businesses++;
                }
                
                if (userData.status === 'active') {
                    stats.active++;
                } else if (userData.status === 'pending') {
                    stats.pending++;
                }
            });
            
            return { success: true, stats };
        } catch (error) {
            return { success: false, message: 'Error obteniendo estadísticas' };
        }
    }

    // Obtener actividad reciente
    async getRecentActivity(limit = 10) {
        try {
            const activitySnapshot = await this.db.collection('users')
                .orderBy('lastLogin', 'desc')
                .limit(limit)
                .get();
            
            const activities = [];
            activitySnapshot.forEach(doc => {
                const userData = doc.data();
                activities.push({
                    uid: doc.id,
                    email: userData.email,
                    userType: userData.userType,
                    lastLogin: userData.lastLogin,
                    status: userData.status
                });
            });
            
            return { success: true, activities };
        } catch (error) {
            return { success: false, message: 'Error obteniendo actividad reciente' };
        }
    }
}

// Inicializar AuthManager cuando se cargue la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que Firebase esté disponible
    if (typeof firebase !== 'undefined') {
        window.authManager = new AuthManager();
    } else {
        console.error('Firebase no está disponible');
    }
});

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
