// Variables globales
const modal = document.getElementById('modalAnuncio');
const propertiesGrid = document.getElementById('propertiesGrid');
let allProperties = [];

// Inicializar propiedades existentes
function initializeProperties() {
    const propertyCards = document.querySelectorAll('.property-card');
    allProperties = Array.from(propertyCards).map(card => ({
        element: card,
        precio: parseInt(card.dataset.precio),
        ubicacion: card.dataset.ubicacion,
        categoria: card.dataset.categoria
    }));
}

// Modal logic
function openModal() {
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
    document.getElementById('formAnuncio').reset();
    document.getElementById('imgPreview').style.display = 'none';
}

// Cerrar modal al hacer clic fuera
window.onclick = function (event) {
    if (event.target === modal) closeModal();
}

// Preview de imagen
document.getElementById('imgInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const preview = document.getElementById('imgPreview');
    if (file) {
        const reader = new FileReader();
        reader.onload = function (ev) {
            preview.src = ev.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
    }
});

// Funciones de filtrado
function filterProperties() {
    const precioMin = document.getElementById('precioMin').value;
    const precioMax = document.getElementById('precioMax').value;
    const ubicacion = document.getElementById('ubicacionFiltro').value;
    const searchInput = document.querySelector('.search-input').value.toLowerCase();

    allProperties.forEach(property => {
        let visible = true;

        // Filtro por precio
        if (precioMin && property.precio < parseInt(precioMin)) visible = false;
        if (precioMax && property.precio > parseInt(precioMax)) visible = false;

        // Filtro por ubicación
        if (ubicacion && !property.ubicacion.includes(ubicacion)) visible = false;

        // Filtro por búsqueda
        if (searchInput) {
            const title = property.element.querySelector('.property-title').textContent.toLowerCase();
            const desc = property.element.querySelector('.property-description').textContent.toLowerCase();
            const location = property.element.querySelector('.property-location').textContent.toLowerCase();

            if (!title.includes(searchInput) &&
                !desc.includes(searchInput) &&
                !location.includes(searchInput)) {
                visible = false;
            }
        }

        property.element.style.display = visible ? 'block' : 'none';
    });

    updatePropertyCount();
}

function updatePropertyCount() {
    const visibleProperties = allProperties.filter(p => p.element.style.display !== 'none').length;
    document.querySelector('.properties-count').textContent = `${visibleProperties} propiedades encontradas`;
}

// Añadir nueva propiedad
document.getElementById('formAnuncio').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = {
        nombre: document.getElementById('nombre').value,
        precio: document.getElementById('precio').value,
        categoria: document.getElementById('categoria').value,
        desc: document.getElementById('desc').value,
        ubicacion: document.getElementById('ubicacion').value,
        habitaciones: document.getElementById('habitaciones').value,
        banos: document.getElementById('banos').value,
        tamano: document.getElementById('tamano').value
    };

    const imgFile = document.getElementById('imgInput').files[0];

    if (imgFile) {
        const reader = new FileReader();
        reader.onload = function (ev) {
            createPropertyCard(formData, ev.target.result);
            closeModal();
        }
        reader.readAsDataURL(imgFile);
    }
});

function createPropertyCard(data, imageSrc) {
    const categoryTags = {
        'casa-grande': { class: 'tag-casa-grande', text: 'Casa Grande' },
        'casa-pequena': { class: 'tag-casa-pequena', text: 'Casa Pequeña' },
        'departamento': { class: 'tag-departamento', text: 'Departamento' }
    };

    const tag = categoryTags[data.categoria];
    const priceFormatted = parseInt(data.precio).toLocaleString('es-MX');

    const card = document.createElement('div');
    card.className = 'property-card';
    card.setAttribute('data-precio', data.precio);
    card.setAttribute('data-ubicacion', data.ubicacion);
    card.setAttribute('data-categoria', data.categoria);

    card.innerHTML = `
                <div class="property-image" style="background-image: url('${imageSrc}'); background-size: cover; background-position: center;">
                    <span class="property-tag ${tag.class}">${tag.text}</span>
                </div>
                <div class="property-content">
                    <h3 class="property-title">${data.nombre}</h3>
                    <div class="property-location">
                        <i class="bi bi-geo-alt"></i> ${data.ubicacion}
                    </div>
                    <p class="property-description">${data.desc}</p>
                    <div class="property-price">${priceFormatted}</div>
                </div>
            `;

    propertiesGrid.insertBefore(card, propertiesGrid.firstChild);

    // Actualizar la lista de propiedades
    allProperties.unshift({
        element: card,
        precio: parseInt(data.precio),
        ubicacion: data.ubicacion,
        categoria: data.categoria
    });

    updatePropertyCount();

    // Animación de entrada
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
        card.style.transition = 'all 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);
}

// Event listeners para filtros
document.getElementById('precioMin').addEventListener('input', filterProperties);
document.getElementById('precioMax').addEventListener('input', filterProperties);
document.getElementById('ubicacionFiltro').addEventListener('change', filterProperties);
document.querySelector('.search-input').addEventListener('input', filterProperties);

// Filtros de categoría
document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', function () {
        document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        const categoria = this.textContent.trim();
        allProperties.forEach(property => {
            if (categoria === 'Todas las categorías') {
                property.element.style.display = 'block';
            } else {
                const categoryMap = {
                    'Casas Grandes': 'casa-grande',
                    'Casas Pequeñas': 'casa-pequena',
                    'Departamentos': 'departamento'
                };

                const targetCategory = categoryMap[categoria];
                property.element.style.display =
                    property.categoria === targetCategory ? 'block' : 'none';
            }
        });
        updatePropertyCount();
    });
});

// Filtros rápidos de precio
document.querySelectorAll('.quick-filter-item').forEach(item => {
    item.addEventListener('click', function () {
        document.querySelectorAll('.quick-filter-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        const range = this.dataset.range.split('-');
        const min = parseInt(range[0]);
        const max = parseInt(range[1]);

        document.getElementById('precioMin').value = min;
        document.getElementById('precioMax').value = max === 999999999 ? '' : max;

        filterProperties();
    });
});

// Botones de vista
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const grid = document.querySelector('.properties-grid');
        if (this.querySelector('i').classList.contains('bi-list')) {
            grid.style.gridTemplateColumns = '1fr';
        } else {
            grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(380px, 1fr))';
        }
    });
});

// Inicializar
document.addEventListener('DOMContentLoaded', function () {
    initializeProperties();
    updatePropertyCount();
});

// Escape key para cerrar modal
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
});
