// =====================================================
// marketplace.js - Funciones para el Marketplace
// =====================================================

// Cargar todas las propiedades activas en el marketplace (mantiene diseño actual)
async function loadMarketplaceProperties() {
    try {
        const snapshot = await db.collection('properties')
            .where('status', '==', 'active')
            .orderBy('createdAt', 'desc')
            .get();
        
        const properties = [];
        const staticProperties = getStaticProperties(); // Propiedades estáticas existentes
        
        snapshot.forEach(doc => {
            const data = doc.data();
            properties.push({ 
                id: doc.id, 
                ...data,
                createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
            });
        });
        
        // Combinar propiedades estáticas con las nuevas
        const allProperties = [...staticProperties, ...properties];
        displayMarketplaceProperties(allProperties);
        
    } catch (error) {
        console.error('Error loading marketplace properties:', error);
        // Mostrar solo propiedades estáticas en caso de error
        displayMarketplaceProperties(getStaticProperties());
    }
}

// Obtener propiedades estáticas existentes
function getStaticProperties() {
    return [
        {
            id: 'casa-el-roble',
            title: 'Casa El Roble',
            price: 395000,
            location: 'Albrook',
            description: 'Casa familiar con amplio jardín y árboles centenarios.',
            rooms: 3,
            bathrooms: 2,
            area: '306 m²',
            year: 2018,
            likes: 27,
            discount: 'Rebajado 3%',
            image: 'https://i.pinimg.com/originals/95/4b/fc/954bfce34fb3b0ae957d87eec22b0843.jpg',
            isStatic: true
        }
        // ... agregar más propiedades estáticas según necesites
    ];
}

// Mostrar propiedades en el marketplace (mantiene diseño actual)
function displayMarketplaceProperties(properties) {
    const container = document.getElementById('cardsContainer');
    if (!container) return;
    
    // Mantener las cards estáticas existentes y agregar las nuevas
    const newCards = properties.filter(p => !p.isStatic).map(property => `
        <div class="property-card" data-ubicacion="${property.location}" data-precio="${property.price}">
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
                    <span class="interested"><i class="bi bi-heart-fill"></i> ${property.likes}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Agregar las nuevas cards al final del contenedor
    container.innerHTML += newCards;
    
    // Reinicializar filtros
    if (typeof filtrar === 'function') {
        todasLasCards = Array.from(document.querySelectorAll('.property-card'));
    }
}

// =====================================================
// properties.js - Funciones para Properties
// =====================================================

// Cargar todas las propiedades para Properties (diseño diferente)
async function loadPropertiesPage() {
    try {
        const snapshot = await db.collection('properties')
            .where('status', '==', 'active')
            .orderBy('createdAt', 'desc')
            .get();
        
        const dynamicProperties = {};
        snapshot.forEach(doc => {
            const data = doc.data();
            dynamicProperties[doc.id] = {
                id: doc.id,
                ...data,
                createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
            };
        });
        
        // Combinar con propiedades estáticas
        const staticProperties = getStaticPropertiesForPropertiesPage();
        const allProperties = { ...staticProperties, ...dynamicProperties };
        
        // Actualizar el objeto global properties si existe
        if (typeof properties !== 'undefined') {
            Object.assign(properties, allProperties);
        }
        
        displayPropertiesGrid(Object.values(allProperties));
        
    } catch (error) {
        console.error('Error loading properties page:', error);
    }
}

// Propiedades estáticas para la página Properties
function getStaticPropertiesForPropertiesPage() {
    return {
        'casa-el-roble': {
            title: 'Casa El Roble',
            price: 'B/. 395,000',
            discount: 'Rebajado 3%',
            image: 'https://i.pinimg.com/originals/95/4b/fc/954bfce34fb3b0ae957d87eec22b0843.jpg',
            description: 'Casa familiar con amplio jardín y árboles centenarios.',
            rooms: 3,
            bathrooms: 2,
            area: '306 m²',
            location: 'Albrook',
            year: 2018,
            likes: 27,
            features: [
                'Jardín amplio con árboles centenarios',
                'Diseño moderno y funcional',
                'Cocina completamente equipada',
                'Estacionamiento para 2 vehículos',
                'Sistema de seguridad 24/7',
                'Área de lavandería independiente'
            ]
        }
        // ... más propiedades estáticas
    };
}

// Mostrar propiedades en la grilla (para Properties page)
function displayPropertiesGrid(properties) {
    const container = document.querySelector('.property-grid');
    if (!container) return;
    
    container.innerHTML = properties.map(property => `
        <div class="property-card" onclick="showProperty('${property.id}')">
            <img src="${property.image}" alt="${property.title}" class="card-image">
            <div class="card-content">
                <div class="card-price">
                    ${typeof property.price === 'number' ? `B/. ${property.price.toLocaleString()}` : property.price}
                    ${property.discount ? `<span class="discount">${property.discount}</span>` : ''}
                </div>
                <div class="card-title">${property.title}</div>
                <div class="card-specs">
                    <span>🏠 ${property.rooms}</span>
                    <span>🚿 ${property.bathrooms}</span>
                    <span>📐 ${property.area}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// =====================================================
// Inicialización
// =====================================================

// Cargar datos cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.toLowerCase();
    
    if (currentPage.includes('dashboard')) {
        // Dashboard: cargar propiedades del usuario y configurar formulario
        loadUserProperties();
        
        const propertyForm = document.getElementById('property-form');
        if (propertyForm) {
            propertyForm.addEventListener('submit', submitPropertyForm);
        }
        
        // Configurar preview de imagen
        const imageInput = document.getElementById('propertyImage');
        if (imageInput) {
            imageInput.addEventListener('change', function() {
                previewImage(this);
            });
        }
        
    } else if (currentPage.includes('marketplace')) {
        // Marketplace: cargar todas las propiedades activas
        loadMarketplaceProperties();
        
    } else if (currentPage.includes('properties')) {
        // Properties: cargar propiedades para vista detallada
        loadPropertiesPage();
    }
});
