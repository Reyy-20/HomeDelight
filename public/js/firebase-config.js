// Firebase Configuration and Initialization
class FirebaseConfig {
    constructor() {
        this.config = {
            apiKey: "AIzaSyCWW3XgtGG7agkUkdUiS7kU4X7ew2DjTic",
            authDomain: "expo-project-senior-6bfea.firebaseapp.com",
            databaseURL: "https://expo-project-senior-6bfea-default-rtdb.firebaseio.com",
            projectId: "expo-project-senior-6bfea",
            storageBucket: "expo-project-senior-6bfea.firebasestorage.app",
            messagingSenderId: "188431803500",
            appId: "1:188431803500:web:c6f64089f19ac1b64ca449",
            measurementId: "G-5Q8NB4WFK6"
        };
        
        this.initializeFirebase();
    }

    initializeFirebase() {
        try {
            // Initialize Firebase
            if (typeof firebase !== 'undefined') {
                this.app = firebase.initializeApp(this.config);
                this.auth = firebase.auth();
                this.db = firebase.firestore();
                
                console.log('Firebase inicializado correctamente');
                
                // Setup auth state listener
                this.setupAuthStateListener();
                
                // Setup Firestore settings
                this.setupFirestore();
                
            } else {
                console.error('Firebase SDK no está cargado');
            }
        } catch (error) {
            console.error('Error al inicializar Firebase:', error);
        }
    }

    setupAuthStateListener() {
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('Usuario autenticado:', user.email);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('userEmail', user.email);
                localStorage.setItem('userId', user.uid);
                
                // Update UI elements
                this.updateAuthUI(user);
                
            } else {
                console.log('Usuario no autenticado');
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userId');
                
                // Update UI elements
                this.updateAuthUI(null);
            }
        });
    }

    updateAuthUI(user) {
        const authButton = document.getElementById('authButton');
        if (authButton) {
            if (user) {
                authButton.textContent = 'Dashboard';
                authButton.href = 'gptdashboard.html';
            } else {
                authButton.textContent = 'LogIn/Register';
                authButton.href = 'login%26register2.html';
            }
        }
    }

    setupFirestore() {
        // Configure Firestore settings
        this.db.settings({
            timestampsInSnapshots: true
        });
    }

    // Authentication methods
    async signIn(email, password) {
        try {
            const result = await this.auth.signInWithEmailAndPassword(email, password);
            console.log('Inicio de sesión exitoso');
            return result;
        } catch (error) {
            console.error('Error en inicio de sesión:', error);
            throw error;
        }
    }

    async signUp(email, password, userData = {}) {
        try {
            const result = await this.auth.createUserWithEmailAndPassword(email, password);
            
            // Save additional user data to Firestore
            if (Object.keys(userData).length > 0) {
                await this.db.collection('users').doc(result.user.uid).set({
                    ...userData,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    email: email
                });
            }
            
            console.log('Registro exitoso');
            return result;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }

    async signOut() {
        try {
            await this.auth.signOut();
            console.log('Sesión cerrada');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            throw error;
        }
    }

    // Firestore methods
    async saveProperty(propertyData) {
        try {
            const docRef = await this.db.collection('properties').add({
                ...propertyData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('Propiedad guardada con ID:', docRef.id);
            return docRef;
        } catch (error) {
            console.error('Error al guardar propiedad:', error);
            throw error;
        }
    }

    async getProperties() {
        try {
            const snapshot = await this.db.collection('properties').get();
            const properties = [];
            snapshot.forEach(doc => {
                properties.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return properties;
        } catch (error) {
            console.error('Error al obtener propiedades:', error);
            throw error;
        }
    }

    // Utility methods
    getCurrentUser() {
        return this.auth.currentUser;
    }

    isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true';
    }
}

// Initialize Firebase when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.firebaseConfig = new FirebaseConfig();
});
