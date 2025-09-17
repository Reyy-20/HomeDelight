// marketplace-integration.js - Integración específica para Marketplace
// Este script debe cargarse en la página Marketplace.html

// Configuración de Firebase (reutilizar la misma configuración)
const firebaseConfig = {
    // Tu configuración de Firebase aquí
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Inicializar Firebase si no está inicializado
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Función para cargar propiedades dinámicas en el Marketplace
async function loadDynamicPropertiesForMarketplace() {
    try {
        const snapshot = await db.collection('properties')
            .where('status', '==', 'active')
            .orderBy('createdAt', 'desc')
            .get();
        
        const dynamicProperties = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            dynamicProperties.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
            });
        });
        
        if (dynamicProperties.length > 0) {
            appendDynamicPropertiesToMarketplace(dynamicProperties);
            updateFiltersWithNewLocations(dynamicProperties);
            refreshFilterSystem();
        }
        
    } catch (error) {
        console.error('Error loading dynamic properties:', error);
    }
}

// Función para agregar propiedades dinámicas al HTML del Marketplace
function appendDynamicPropertiesToMarketplace(properties) {
    const cardsContainer = document.getElementById('cardsContainer');
    if (!cardsContainer) return;
    
    const newCardsHTML = properties.map(property => {
        // Determinar el tipo de propiedad para el título
        let propertyTypeTitle = '';
        if (property.propertyType) {
            switch(property.propertyType.toLowerCase()) {
                case 'casa':
                    propertyTypeTitle = 'Casa';
                    break;
                case 'apartamento':
                    propertyTypeTitle = 'Apartamento';
                    break;
                case 'ph':
                    propertyTypeTitle = 'PH';
                    break;
                case 'villa':
                    propertyTypeTitle = 'Villa';
                    break;
                case 'mansion':
                    propertyTypeTitle = 'Mansión';
                    break;
                default:
                    propertyTypeTitle = '';
            }
        }
        
        return `
        <div class="property-card" data-ubicacion="${property.location}" 
             data-precio="${property.price}" data-id="${property.id}">
            <img src="${property.image}" class="property-image" alt="${property.title}">
            <div class="options"><i class="bi bi-three-dots"></i></div>
            <div class="property-content">
                <div class="property-header-row">
                    <div class="property-price">
                        B/. ${property.price.toLocaleString()}
                        ${property.discount ? `<span class="rebajado">${property.discount}</span>` : ''}
                    </div>
                </div>
                <div class="property-title">${property.title}</div>
                <div class="property-desc">${property.description}</div>
                <div class="property-details-row">
                    <span><i class="bi bi-house"></i> ${property.rooms}</span>
                    <span><i class="bi bi-badge-wc"></i> ${property.bathrooms}</span>
                    <span><i class="bi bi-aspect-ratio"></i> ${property.area}</span>
                </div>
                <div class="property-meta-row">
                    <span><i class="bi bi-geo-alt"></i> ${property.location}</span>
                    <span><i class="bi bi-calendar"></i> ${property.year}</span>
                    <span class="interested"><i class="bi bi-heart-fill"></i> ${property.likes || 0}</span>
                </div>
            </div>
        </div>`;
    }).join('');
    
    // Agregar las nuevas cards al contenedor
    cardsContainer.insertAdjacentHTML('beforeend', newCardsHTML);
    
    // Agregar event listeners para las nuevas cards
    addClickEventsToDynamicProperties(properties);
}

// Agregar eventos de click a las propiedades dinámicas
function addClickEventsToDynamicProperties(properties) {
    properties.forEach(property => {
        const card = document.querySelector(`[data-id="${property.id}"]`);
        if (card) {
            card.addEventListener('click', () => {
                // Incrementar vistas
                incrementPropertyViews(property.id);
                
                // Redirigir a Properties.html con el ID de la propiedad
                window.location.href = `Properties.html?property=${property.id}`;
            });
        }
    });
}

// Función para incrementar vistas de una propiedad
async function incrementPropertyViews(propertyId) {
    try {
        await db.collection('properties').doc(propertyId).update({
            views: firebase.firestore.FieldValue.increment(1)
        });
    } catch (error) {
        console.error('Error incrementing views:', error);
    }
}

// Actualizar filtros de ubicación con nuevas ubicaciones
function updateFiltersWithNewLocations(properties) {
    const locationFilter = document.getElementById('filtroUbicacion');
    if (!locationFilter) return;
    
    const existingLocations = Array.from(locationFilter.options).map(option => option.value);
    const newLocations = [...new Set(properties.map(p => p.location))];
    
    newLocations.forEach(location => {
        if (location && !existingLocations.includes(location)) {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationFilter.appendChild(option);
        }
    });
}

// Actualizar el sistema de filtros para incluir las nuevas propiedades
function refreshFilterSystem() {
    // Actualizar la variable global todasLasCards si existe
    if (typeof todasLasCards !== 'undefined') {
        todasLasCards = Array.from(document.querySelectorAll('.property-card'));
        console.log('Filtros actualizados. Total de cards:', todasLasCards.length);
    }
}

// Función para manejar "Me gusta" en las propiedades
async function toggleLikeProperty(propertyId, heartElement) {
    try {
        // Por ahora, solo incrementar likes (en una implementación real, 
        // verificarías si el usuario ya dio like)
        await db.collection('properties').doc(propertyId).update({
            likes: firebase.firestore.FieldValue.increment(1)
        });
        
        // Actualizar la UI
        const currentLikes = parseInt(heartElement.textContent) || 0;
        heartElement.textContent = currentLikes + 1;
        heartElement.style.color = '#ff6b6b';
        
    } catch (error) {
        console.error('Error updating likes:', error);
    }
}

// Función para manejar el menú de opciones de cada card
function setupCardOptionsMenu() {
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('bi-three-dots')) {
            event.stopPropagation();
            
            const card = event.target.closest('.property-card');
            const propertyId = card.dataset.id;
            
            if (propertyId) {
                showPropertyOptionsMenu(event, propertyId, card);
            }
        }
    });
}

// Mostrar menú de opciones para propiedades dinámicas
function showPropertyOptionsMenu(event, propertyId, card) {
    // Crear menú contextual
    const menu = document.createElement('div');
    menu.className = 'property-context-menu';
    menu.innerHTML = `
        <div class="menu-item" onclick="toggleLikeProperty('${propertyId}', this.closest('.property-card').querySelector('.interested'))">
            <i class="bi bi-heart"></i> Me gusta
        </div>
        <div class="menu-item" onclick="shareProperty('${propertyId}')">
            <i class="bi bi-share"></i> Compartir
        </div>
        <div class="menu-item" onclick="reportProperty('${propertyId}')">
            <i class="bi bi-flag"></i> Reportar
        </div>
    `;
    
    // Estilos para el menú
    menu.style.cssText = `
        position: absolute;
        top: ${event.pageY}px;
        left: ${event.pageX}px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        min-width: 150px;
    `;
    
    // Agregar estilos para menu-item si no existen
    const style = document.createElement('style');
    style.textContent = `
        .property-context-menu .menu-item {
            padding: 12px 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background-color 0.2s;
        }
        .property-context-menu .menu-item:hover {
            background-color: #f5f5f5;
        }
        .property-context-menu .menu-item:first-child:hover {
            border-radius: 8px 8px 0 0;
        }
        .property-context-menu .menu-item:last-child:hover {
            border-radius: 0 0 8px 8px;
        }
    `;
    
    if (!document.querySelector('#context-menu-styles')) {
        style.id = 'context-menu-styles';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(menu);
    
    // Remover menú al hacer click fuera
    setTimeout(() => {
        document.addEventListener('click', function removeMenu() {
            if (menu.parentNode) {
                menu.remove();
            }
            document.removeEventListener('click', removeMenu);
        });
    }, 10);
}

// Funciones auxiliares para el menú de opciones
function shareProperty(propertyId) {
    const card = document.querySelector(`[data-id="${propertyId}"]`);
    const title = card.querySelector('.property-title').textContent;
    const url = `${window.location.origin}/Properties.html?property=${propertyId}`;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        });
    } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(url).then(() => {
            alert('Enlace copiado al portapapeles');
        });
    }
}

function reportProperty(propertyId) {
    // Implementar sistema de reportes
    const reason = prompt('¿Por qué quieres reportar esta propiedad?');
    if (reason) {
        // En una implementación real, enviarías esto a un sistema de moderación
        console.log(`Propiedad ${propertyId} reportada: ${reason}`);
        alert('Gracias por tu reporte. Lo revisaremos pronto.');
    }
}

// Inicialización para la página de Marketplace
document.addEventListener('DOMContentLoaded', function() {
    // Solo ejecutar si estamos en la página de Marketplace
    if (window.location.pathname.toLowerCase().includes('marketplace')) {
        console.log('Inicializando integración de Marketplace...');
        
        // Cargar propiedades dinámicas
        loadDynamicPropertiesForMarketplace();
        
        // Configurar menú de opciones
        setupCardOptionsMenu();
        
        // Configurar actualización periódica (opcional)
        // setInterval(loadDynamicPropertiesForMarketplace, 300000); // cada 5 minutos
    }
});

// Función para refrescar manualmente las propiedades
function refreshMarketplaceProperties() {
    loadDynamicPropertiesForMarketplace();
}

// Exportar funciones para uso global
window.marketplaceIntegration = {
    loadDynamicProperties: loadDynamicPropertiesForMarketplace,
    refreshProperties: refreshMarketplaceProperties,
    toggleLike: toggleLikeProperty
};