// properties-updated.js - JavaScript actualizado para Properties.html
// Este script debe reemplazar o complementar el script existente en Properties.html

// Configuración Firebase (misma configuración)
const firebaseConfig = {
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

// Propiedades estáticas originales (mantener compatibilidad)
const staticProperties = {
    'casa-el-roble': {
        title: 'Casa El Roble',
        price: 'B/. 395,000',
        discount: 'Rebajado 3%',
        image: 'https://i.pinimg.com/originals/95/4b/fc/954bfce34fb3b0ae957d87eec22b0843.jpg',
        description: 'Casa familiar con amplio jardín y árboles centenarios. Esta hermosa propiedad ofrece un ambiente tranquilo y natural, perfecta para familias que buscan comodidad y contacto con la naturaleza.',
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
    },
    'villa-serena': {
        title: 'Villa Serena',
        price: 'B/. 520,000',
        discount: 'Rebajado 6%',
        image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80',
        description: 'Ambientes abiertos, piscina privada y zona de BBQ. Esta lujosa villa ofrece el estilo de vida perfecto para quienes disfrutan del entretenimiento y la relajación.',
        rooms: 4,
        bathrooms: 4,
        area: '350 m²',
        location: 'Costa Sur',
        year: 2019,
        likes: 21,
        features: [
            'Piscina privada con sistema de filtrado',
            'Zona de BBQ completamente equipada',
            'Ambientes abiertos con concepto moderno',
            'Master suite con jacuzzi',
            'Terraza con vista panorámica',
            'Bodega climatizada'
        ]
    },
    'villa-sol-y-mar': {
        title: 'Villa Sol y Mar',
        price: 'B/. 420,000',
        discount: 'Rebajado 3%',
        image: 'https://armoniapanama.com/wp-content/uploads/2025/05/armonia-2-848x450.webp',
        description: 'Residencia frente al mar con piscina y terraza panorámica. Una oportunidad única de vivir con vista al océano en una de las zonas más exclusivas de la ciudad.',
        rooms: 4,
        bathrooms: 5,
        area: '380 m²',
        location: 'Punta Barco',
        year: 2020,
        likes: 34,
        features: [
            'Vista panorámica al mar',
            'Piscina infinita con sistema de calefacción',
            'Terraza amplia con jacuzzi',
            'Diseño arquitectónico único',
            'Acceso directo a playa privada',
            'Sistema domótico completo'
        ]
    },
    'casa-moderna': {
        title: 'Casa Moderna',
        price: 'B/. 280,000',
        discount: '',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80',
        description: 'Diseño contemporáneo con acabados de lujo y tecnología smart home. Esta propiedad combina elegancia y funcionalidad, ideal para profesionales que buscan comodidad.',
        rooms: 3,
        bathrooms: 3,
        area: '250 m²',
        location: 'San Francisco',
        year: 2021,
        likes: 18,
        features: [
            'Sistema smart home integrado',
            'Acabados de lujo en toda la casa',
            'Eficiencia energética A+',
            'Cocina gourmet con isla central',
            'Closets empotrados en todas las habitaciones',
            'Terraza con jardín vertical'
        ]
    },
    'mansion-costa-del-este': {
        title: 'Mansión Costa del Este',
        price: 'B/. 750,000',
        discount: 'Rebajado 8%',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
        description: 'Lujosa mansión con vista al mar, piscina infinita y garaje para 4 autos. La máxima expresión de lujo y comodidad en una de las zonas más exclusivas.',
        rooms: 6,
        bathrooms: 7,
        area: '580 m²',
        location: 'Costa del Este',
        year: 2019,
        likes: 42,
        features: [
            'Vista panorámica al mar',
            'Piscina infinita con iluminación LED',
            'Garaje para 4 vehículos',
            'Sala de cine privada',
            'Bodega de vinos climatizada',
            'Ascensor privado'
        ]
    },
    'casa-familiar': {
        title: 'Casa Familiar',
        price: 'B/. 180,000',
        discount: '',
        image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80',
        description: 'Casa ideal para familias, con jardín amplio y zona de juegos. Una propiedad acogedora que ofrece el espacio perfecto para el crecimiento familiar.',
        rooms: 3,
        bathrooms: 2,
        area: '200 m²',
        location: 'Tumba Muerto',
        year: 2017,
        likes: 15,
        features: [
            'Jardín amplio con zona de juegos',
            'Cocina familiar con comedor integrado',
            'Estacionamiento cubierto',
            'Área de lavandería exterior',
            'Seguridad perimetral',
            'Cerca de colegios y parques'
        ]
    },
    'apartamento-luz': {
        title: 'Apartamento Luz',
        price: 'B/. 560,900',
        discount: 'Rebajado 5%',
        image: 'https://cdn2.hubspot.net/hubfs/5264199/BLOG%202019/Apartamentos%20en%20Santa%20Maria/por%20que%20vivir%20en%20santa%20maria%20panama.jpg',
        description: 'Apartamento de lujo con acabados premium y vistas panorámicas. Ubicado en un edificio de alta gama con servicios de primera clase.',
        rooms: 5,
        bathrooms: 4,
        area: '459 m²',
        location: 'Brisas del Golf',
        year: 2018,
        likes: 50,
        features: [
            'Vistas panorámicas de la ciudad',
            'Acabados premium en toda la unidad',
            'Balcón privado con jacuzzi',
            'Cocina gourmet con electrodomésticos de lujo',
            'Sistema de climatización central',
            'Acceso a gimnasio y piscina del edificio'
        ]
    },
    'apartamento-sur': {
        title: 'Apartamento Sur',
        price: 'B/. 456,980',
        discount: 'Rebajado 4%',
        image: 'https://pic.le-cdn.com/thumbs/520x390/190/1/properties/Property-432a94040e74dfefa114523e1e9bd005-128152370.jpg',
        description: 'Apartamento con bonita vista al mar. Una oportunidad de vivir frente al océano con todas las comodidades modernas y acceso directo a la playa.',
        rooms: 4,
        bathrooms: 3,
        area: '320 m²',
        location: 'Costa Sur',
        year: 2021,
        likes: 68,
        features: [
            'Vista directa al mar',
            'Balcón amplio con vista panorámica',
            'Diseño moderno y funcional',
            'Cocina abierta con isla central',
            'Closets empotrados en todas las habitaciones',
            'Acceso a playa privada del edificio'
        ]
    },
    'propiedad-avenida-balboa': {
        title: 'Propiedad Avenida Balboa',
        price: 'B/. 568,990',
        discount: 'Rebajado 7%',
        image: 'https://www.activentas.com/wp-content/uploads/2024/07/photo_server-4409.jpeg',
        description: 'Propiedad moderna con excelente ubicación y acabados de calidad. Ubicada en una de las avenidas más importantes de la ciudad.',
        rooms: 3,
        bathrooms: 2,
        area: '340 m²',
        location: 'Avenida Balboa',
        year: 2019,
        likes: 30,
        features: [
            'Ubicación estratégica en avenida principal',
            'Acabados de calidad superior',
            'Diseño contemporáneo',
            'Estacionamiento para 2 vehículos',
            'Terraza con vista a la ciudad',
            'Cerca de centros comerciales y bancos'
        ]
    },
    'apartamento-albrook': {
        title: 'Apartamento en Albrook',
        price: 'B/. 795,490',
        discount: 'Rebajado 5%',
        image: 'https://forestgate.procasapanama.com/wp-content/uploads/comprar-apartamento-en-Panama-1-1-1024x768.jpeg',
        description: 'Apartamento moderno con excelente vista y acabados de lujo. Una propiedad de alta gama en una zona en constante desarrollo.',
        rooms: 4,
        bathrooms: 5,
        area: '458 m²',
        location: 'Albrook',
        year: 2020,
        likes: 58,
        features: [
            'Vista panorámica de la ciudad',
            'Acabados de lujo en toda la unidad',
            'Terraza privada con jacuzzi',
            'Cocina gourmet con electrodomésticos premium',
            'Sistema de climatización inteligente',
            'Acceso a amenities del edificio'
        ]
    }
};

// Variable global para almacenar todas las propiedades (estáticas + dinámicas)
let allProperties = { ...staticProperties };

// Función para cargar propiedades dinámicas de Firebase
async function loadDynamicProperties() {
    try {
        const snapshot = await db.collection('properties')
            .where('status', '==', 'active')
            .orderBy('createdAt', 'desc')
            .get();
        
        const dynamicProperties = {};
        snapshot.forEach(doc => {
            const data = doc.data();
            
            // Formatear los datos para que coincidan con la estructura esperada
            dynamicProperties[doc.id] = {
                title: data.title,
                price: typeof data.price === 'number' ? `B/. ${data.price.toLocaleString()}` : data.price,
                discount: data.discount || '',
                image: data.image,
                description: data.description,
                rooms: data.rooms,
                bathrooms: data.bathrooms,
                area: data.area,
                location: data.location,
                year: data.year,
                likes: data.likes || 0,
                features: data.features || ['Propiedad bien ubicada', 'Excelente oportunidad'],
                isDynamic: true,
                createdAt: data.createdAt ? data.createdAt.toDate() : new Date()
            };
        });
        
        // Combinar propiedades estáticas con dinámicas
        allProperties = { ...staticProperties, ...dynamicProperties };
        
        console.log('Propiedades cargadas:', Object.keys(allProperties).length);
        return allProperties;
        
    } catch (error) {
        console.error('Error loading dynamic properties:', error);
        // En caso de error, usar solo propiedades estáticas
        allProperties = { ...staticProperties };
        return allProperties;
    }
}

// Función actualizada para mostrar el marketplace (lista de propiedades)
function showMarketplace() {
    document.getElementById('marketplace').style.display = 'block';
    const propertyDetail = document.getElementById('property-detail');
    propertyDetail.style.display = 'none';
    propertyDetail.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función actualizada para mostrar la grilla de propiedades
function displayPropertiesGrid() {
    const container = document.querySelector('.property-grid');
    if (!container) return;
    
    const propertiesArray = Object.entries(allProperties);
    
    container.innerHTML = propertiesArray.map(([id, property]) => `
        <div class="property-card" onclick="showProperty('${id}')">
            <img src="${property.image}" alt="${property.title}" class="card-image">
            <div class="card-content">
                <div class="card-price">
                    ${property.price}
                    ${property.discount ? `<span class="discount">${property.discount}</span>` : ''}
                </div>
                <div class="card-title">${property.title}</div>
                <div class="card-specs">
                    <span>🏠 ${property.rooms}</span>
                    <span>🚿 ${property.bathrooms}</span>
                    <span>📐 ${property.area}</span>
                </div>
                ${property.isDynamic ? '<div class="dynamic-badge">Nuevo</div>' : ''}
            </div>
        </div>
    `).join('');
}

// Función actualizada para mostrar una propiedad específica
async function showProperty(propertyId) {
    console.log('Mostrando propiedad:', propertyId);
    
    let property = allProperties[propertyId];
    
    // Si no está en memoria, intentar cargarla de Firebase
    if (!property) {
        try {
            const doc = await db.collection('properties').doc(propertyId).get();
            if (doc.exists) {
                const data = doc.data();
                property = {
                    title: data.title,
                    price: typeof data.price === 'number' ? `B/. ${data.price.toLocaleString()}` : data.price,
                    discount: data.discount || '',
                    image: data.image,
                    description: data.description,
                    rooms: data.rooms,
                    bathrooms: data.bathrooms,
                    area: data.area,
                    location: data.location,
                    year: data.year,
                    likes: data.likes || 0,
                    features: data.features || ['Propiedad bien ubicada', 'Excelente oportunidad'],
                    isDynamic: true
                };
                
                // Incrementar vistas
                await db.collection('properties').doc(propertyId).update({
                    views: firebase.firestore.FieldValue.increment(1)
                });
            }
        } catch (error) {
            console.error('Error loading property:', error);
        }
    }
    
    if (!property) {
        console.log('Propiedad no encontrada:', propertyId);
        alert('Propiedad no encontrada');
        return;
    }
    
    // Cambiar vista
    document.getElementById('marketplace').style.display = 'none';
    const propertyDetail = document.getElementById('property-detail');
    propertyDetail.style.display = 'flex';
    propertyDetail.classList.add('active');
    
    // Cargar contenido de la propiedad
    displayPropertyDetail(property);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Función para mostrar los detalles de la propiedad
function displayPropertyDetail(property) {
    const propertyContent = document.getElementById('property-content');
    if (!propertyContent) return;
    
    propertyContent.innerHTML = `
        <img src="${property.image}" alt="${property.title}" class="property-image">
        
        <div class="property-header">
            <div>
                <h1 class="property-title">${property.title}</h1>
                <p style="font-size: 1.2rem; color: #666; margin-bottom: 1rem;">${property.description.split('.')[0]}.</p>
            </div>
            <div>
                <span class="property-price">${property.price}</span>
                ${property.discount ? `<span class="discount">${property.discount}</span>` : ''}
            </div>
        </div>

        <div class="property-specs">
            <div class="spec">🏠 ${property.rooms} Habitaciones</div>
            <div class="spec">🚿 ${property.bathrooms} Baños</div>
            <div class="spec">📐 ${property.area}</div>
            <div class="spec">📍 ${property.location}</div>
            <div class="spec">📅 ${property.year}</div>
            <div class="spec">❤️ ${property.likes} Me gusta</div>
        </div>

        <div class="property-description">
            ${property.description}
        </div>

        <div class="property-details">
            ${property.features.map(feature => `
                <div class="detail-item">
                    <h4>✓</h4>
                    <p>${feature}</p>
                </div>
            `).join('')}
        </div>
        
        <div class="contact-section">
            <h3>¿Interesado en esta propiedad?</h3>
            <p>Completa el formulario y nos pondremos en contacto contigo</p>
            
            <div class="property-info-form">
                <h4>${property.title}</h4>
                <p class="property-price-form">${property.price}</p>
            </div>
            
            <form id="interestForm" onsubmit="submitInterestForm(event)" class="interest-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="firstName">Nombre *</label>
                        <input type="text" id="firstName" name="firstName" required>
                    </div>
                    <div class="form-group">
                        <label for="lastName">Apellido *</label>
                        <input type="text" id="lastName" name="lastName" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="email">Correo electrónico *</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Teléfono</label>
                        <input type="tel" id="phone" name="phone">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="message">Mensaje *</label>
                    <textarea id="message" name="message" rows="4" 
                              placeholder="Cuéntanos más sobre tu interés en esta propiedad..." required></textarea>
                </div>
                
                <button type="submit" class="submit-btn">
                    <i class="bi bi-send"></i> Enviar consulta
                </button>
            </form>
            
            <div class="contact-info">
                <div class="contact-item">
                    <strong>📞 Teléfono</strong><br>
                    +507 6246-4959
                </div>
                <div class="contact-item">
                    <strong>📧 Email</strong><br>
                    homedelight@gmail.com
                </div>
                <div class="contact-item">
                    <strong>💬 WhatsApp</strong><br>
                    +507 6246-4959
                </div>
            </div>
        </div>
    `;
}

// Función para obtener el parámetro de la URL
function getPropertyFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('property');
}

// Función para enviar el formulario de interés
function submitInterestForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        property: formData.get('property') || 'Propiedad actual',
        price: formData.get('price') || 'Precio no disponible',
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };
    
    console.log('Datos del formulario:', data);
    alert('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.');
    
    // Limpiar formulario
    event.target.reset();
}

// Función principal de inicialización
async function initializePropertiesPage() {
    console.log('Inicializando página de propiedades...');
    
    // Cargar propiedades dinámicas
    await loadDynamicProperties();
    
    // Verificar si hay un parámetro de propiedad en la URL
    const propertyId = getPropertyFromURL();
    
    if (propertyId && allProperties[propertyId]) {
        // Mostrar propiedad específica
        showProperty(propertyId);
    } else {
        // Mostrar el marketplace
        displayPropertiesGrid();
        showMarketplace();
    }
}

// CSS adicional para el badge de "Nuevo"
const additionalStyles = `
    <style>
        .dynamic-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 600;
            z-index: 2;
        }
        
        .property-card {
            position: relative;
        }
    </style>
`;

// Inyectar estilos adicionales
document.head.insertAdjacentHTML('beforeend', additionalStyles);

// Inicialización cuando se carga la página
window.onload = function() {
    initializePropertiesPage();
};