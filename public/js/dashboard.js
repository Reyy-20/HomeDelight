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
// API Key de ImageBB
const IMAGEBB_API_KEY = '8f1ff347c29761b3daa42850e314b9ee';

// =====================================================
// Función para subir imagen a ImageBB
// =====================================================
async function uploadImageToImageBB(file) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', IMAGEBB_API_KEY);
    
    try {
        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            return data.data.url;
        } else {
            throw new Error('Error uploading image to ImageBB');
        }
    } catch (error) {
        console.error('Error uploading to ImageBB:', error);
        throw error;
    }
}

// =====================================================
// dashboard.js - Funciones para el Dashboard
// =====================================================

// Función mejorada para subir propiedades con ImageBB
async function submitPropertyForm(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Subiendo propiedad...';
    
    try {
        const formData = new FormData(event.target);
        const imageFile = formData.get('propertyImage');
        
        let imageURL = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80';
        
        // Subir imagen a ImageBB si se proporcionó una
        if (imageFile && imageFile.size > 0) {
            submitBtn.textContent = 'Subiendo imagen...';
            imageURL = await uploadImageToImageBB(imageFile);
        }
        
        submitBtn.textContent = 'Guardando propiedad...';
        
        // Crear objeto de propiedad con todos los campos necesarios
        const property = {
            id: generatePropertyId(),
            title: formData.get('title'),
            price: parseFloat(formData.get('price')),
            location: formData.get('location'),
            description: formData.get('description'),
            rooms: parseInt(formData.get('rooms')) || 3,
            bathrooms: parseInt(formData.get('bathrooms')) || 2,
            area: formData.get('area') || '250 m²',
            year: parseInt(formData.get('year')) || new Date().getFullYear(),
            propertyType: formData.get('propertyType') || 'casa',
            status: 'active',
            image: imageURL,
            likes: 0,
            views: 0,
            discount: formData.get('discount') || '',
            features: [
                formData.get('feature1') || 'Cocina completamente equipada',
                formData.get('feature2') || 'Estacionamiento privado',
                formData.get('feature3') || 'Sistema de seguridad',
                formData.get('feature4') || 'Área de lavandería',
                formData.get('feature5') || 'Jardín privado',
                formData.get('feature6') || 'Acabados de calidad'
            ].filter(feature => feature.trim() !== ''),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            ownerId: getCurrentUserId()
        };
        
        // Guardar en Firestore
        await db.collection('properties').doc(property.id).set(property);
        
        alert('¡Propiedad publicada exitosamente!');
        event.target.reset();
        
        // Limpiar preview de imagen
        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) {
            imagePreview.style.display = 'none';
            imagePreview.innerHTML = '';
        }
        
        // Recargar la lista de propiedades
        loadUserProperties();
        
    } catch (error) {
        console.error('Error al subir propiedad:', error);
        alert('Error al publicar la propiedad. Por favor, intenta de nuevo.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Publicar Propiedad';
    }
}

// Generar ID único para la propiedad
function generatePropertyId() {
    return 'prop_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Obtener ID del usuario actual
function getCurrentUserId() {
    const user = firebase.auth().currentUser;
    return user ? user.uid : 'user_demo';
}

// Cargar propiedades del usuario actual en el dashboard
async function loadUserProperties() {
    try {
        const userId = getCurrentUserId();
        const snapshot = await db.collection('properties')
            .where('ownerId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        
        const properties = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            properties.push({ 
                id: doc.id, 
                ...data,
                createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
            });
        });
        
        displayUserProperties(properties);
        updateDashboardStats(properties);
        
    } catch (error) {
        console.error('Error loading user properties:', error);
    }
}

// Mostrar propiedades del usuario en el dashboard
function displayUserProperties(properties) {
    const container = document.getElementById('user-properties-list');
    if (!container) return;
    
    if (properties.length === 0) {
        container.innerHTML = '<p>No tienes propiedades publicadas aún.</p>';
        return;
    }
    
    container.innerHTML = properties.map(property => `
        <div class="property-item">
            <div class="property-image">
                <img src="${property.image}" alt="${property.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
            </div>
            <div class="property-details">
                <h4>${property.title}</h4>
                <div class="property-price">B/. ${property.price.toLocaleString()}</div>
                <div class="property-location">${property.location}</div>
                <div class="property-stats">
                    <span>👁️ ${property.views || 0} vistas</span>
                    <span>❤️ ${property.likes || 0} me gusta</span>
                    <span class="status-${property.status}">${property.status === 'active' ? 'Activa' : 'Inactiva'}</span>
                </div>
            </div>
            <div class="property-actions">
                <button onclick="editProperty('${property.id}')" class="btn-edit">Editar</button>
                <button onclick="togglePropertyStatus('${property.id}', '${property.status}')" class="btn-toggle">
                    ${property.status === 'active' ? 'Desactivar' : 'Activar'}
                </button>
                <button onclick="deleteProperty('${property.id}')" class="btn-delete">Eliminar</button>
            </div>
        </div>
    `).join('');
}

// Actualizar estadísticas del dashboard
function updateDashboardStats(properties) {
    const activeProperties = properties.filter(p => p.status === 'active').length;
    const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalLikes = properties.reduce((sum, p) => sum + (p.likes || 0), 0);
    const completedSales = properties.filter(p => p.status === 'sold').length;
    
    // Actualizar elementos del DOM con fallbacks
    const updateStat = (selector, value) => {
        const element = document.querySelector(selector);
        if (element) element.textContent = value;
    };
    
    updateStat('.stat-card:nth-child(1) .stat-number', activeProperties);
    updateStat('.stat-card:nth-child(2) .stat-number', totalViews);
    updateStat('.stat-card:nth-child(3) .stat-number', totalLikes);
    updateStat('.stat-card:nth-child(4) .stat-number', completedSales);
}

// Funciones para gestionar propiedades
async function togglePropertyStatus(propertyId, currentStatus) {
    try {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        await db.collection('properties').doc(propertyId).update({
            status: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        loadUserProperties();
    } catch (error) {
        console.error('Error updating property status:', error);
    }
}

async function deleteProperty(propertyId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
        try {
            await db.collection('properties').doc(propertyId).delete();
            loadUserProperties();
            alert('Propiedad eliminada exitosamente');
        } catch (error) {
            console.error('Error deleting property:', error);
            alert('Error al eliminar la propiedad');
        }
    }
}

// Preview de imagen en el formulario
function previewImage(input) {
    const file = input.files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px;">
                <p style="margin-top: 10px; font-size: 0.9rem; color: #666;">
                    ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
            `;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}