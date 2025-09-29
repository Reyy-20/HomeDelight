// Firebase Properties Management System
class FirebasePropertiesSystem {
    constructor() {
        this.db = null;
        this.properties = [];
        this.initializeFirestore();
    }

    async initializeFirestore() {
        try {
            if (typeof firebase !== 'undefined' && firebase.firestore) {
                this.db = firebase.firestore();
                await this.loadProperties();
            } else {
                console.error('Firebase Firestore no está disponible');
            }
        } catch (error) {
            console.error('Error al inicializar Firestore:', error);
        }
    }

    async loadProperties() {
        try {
            const snapshot = await this.db.collection('properties').get();
            this.properties = [];
            snapshot.forEach(doc => {
                this.properties.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            console.log('Propiedades cargadas:', this.properties.length);
            return this.properties;
        } catch (error) {
            console.error('Error al cargar propiedades:', error);
            return [];
        }
    }

    async addProperty(propertyData) {
        try {
            const docRef = await this.db.collection('properties').add({
                ...propertyData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Add to local array
            this.properties.push({
                id: docRef.id,
                ...propertyData
            });
            
            console.log('Propiedad agregada con ID:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error al agregar propiedad:', error);
            throw error;
        }
    }

    async updateProperty(propertyId, updateData) {
        try {
            await this.db.collection('properties').doc(propertyId).update({
                ...updateData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Update local array
            const index = this.properties.findIndex(p => p.id === propertyId);
            if (index !== -1) {
                this.properties[index] = {
                    ...this.properties[index],
                    ...updateData
                };
            }
            
            console.log('Propiedad actualizada:', propertyId);
            return true;
        } catch (error) {
            console.error('Error al actualizar propiedad:', error);
            throw error;
        }
    }

    async deleteProperty(propertyId) {
        try {
            await this.db.collection('properties').doc(propertyId).delete();
            
            // Remove from local array
            this.properties = this.properties.filter(p => p.id !== propertyId);
            
            console.log('Propiedad eliminada:', propertyId);
            return true;
        } catch (error) {
            console.error('Error al eliminar propiedad:', error);
            throw error;
        }
    }

    getPropertyById(propertyId) {
        return this.properties.find(p => p.id === propertyId);
    }

    getPropertiesByLocation(location) {
        return this.properties.filter(p => 
            p.location && p.location.toLowerCase().includes(location.toLowerCase())
        );
    }

    getPropertiesByPriceRange(minPrice, maxPrice) {
        return this.properties.filter(p => {
            const price = parseFloat(p.price);
            return price >= minPrice && price <= maxPrice;
        });
    }

    getPropertiesByType(type) {
        return this.properties.filter(p => 
            p.type && p.type.toLowerCase() === type.toLowerCase()
        );
    }

    filterProperties(filters) {
        let filtered = [...this.properties];

        if (filters.location) {
            filtered = filtered.filter(p => 
                p.location && p.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        if (filters.minPrice) {
            filtered = filtered.filter(p => parseFloat(p.price) >= parseFloat(filters.minPrice));
        }

        if (filters.maxPrice) {
            filtered = filtered.filter(p => parseFloat(p.price) <= parseFloat(filters.maxPrice));
        }

        if (filters.type) {
            filtered = filtered.filter(p => 
                p.type && p.type.toLowerCase() === filters.type.toLowerCase()
            );
        }

        return filtered;
    }

    // Dashboard specific methods
    async getUserProperties(userId) {
        try {
            const snapshot = await this.db.collection('properties')
                .where('userId', '==', userId)
                .get();
            
            const userProperties = [];
            snapshot.forEach(doc => {
                userProperties.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return userProperties;
        } catch (error) {
            console.error('Error al obtener propiedades del usuario:', error);
            return [];
        }
    }

    async saveUserProperty(propertyData) {
        try {
            const user = firebase.auth().currentUser;
            if (!user) {
                throw new Error('Usuario no autenticado');
            }

            const propertyWithUser = {
                ...propertyData,
                userId: user.uid,
                userEmail: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await this.db.collection('properties').add(propertyWithUser);
            console.log('Propiedad del usuario guardada:', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error al guardar propiedad del usuario:', error);
            throw error;
        }
    }

    // Search functionality
    searchProperties(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.properties.filter(p => 
            (p.title && p.title.toLowerCase().includes(lowercaseQuery)) ||
            (p.description && p.description.toLowerCase().includes(lowercaseQuery)) ||
            (p.location && p.location.toLowerCase().includes(lowercaseQuery))
        );
    }
}

// Initialize properties system
document.addEventListener('DOMContentLoaded', function() {
    window.firebasePropertiesSystem = new FirebasePropertiesSystem();
});
