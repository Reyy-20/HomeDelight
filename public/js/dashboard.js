// Dashboard JavaScript Functionality

class Dashboard {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupImageUpload();
        this.loadUserData();
    }

    setupEventListeners() {
        // Hamburger menu toggle
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const closeBtn = document.getElementById('closeBtn');

        hamburgerBtn.addEventListener('click', () => this.toggleSidebar());
        closeBtn.addEventListener('click', () => this.closeSidebar());
        overlay.addEventListener('click', () => this.closeSidebar());

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
                this.setActiveNavLink(link);
                this.closeSidebar();
            });
        });

        // Profile form
        const profileForm = document.querySelector('#profile .profile-info');
        if (profileForm) {
            const saveBtn = profileForm.querySelector('.btn-primary');
            saveBtn.addEventListener('click', () => this.saveProfile());
        }

        // Settings toggles
        this.setupSettingsToggles();

        // Property form
        const propertyForm = document.querySelector('.property-form');
        if (propertyForm) {
            propertyForm.addEventListener('submit', (e) => this.handlePropertySubmit(e));
        }

        // Change avatar button
        const changeAvatarBtn = document.querySelector('.change-avatar-btn');
        if (changeAvatarBtn) {
            changeAvatarBtn.addEventListener('click', () => this.changeAvatar());
        }

        // Responsive sidebar handling
        window.addEventListener('resize', () => this.handleResize());
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const hamburgerBtn = document.getElementById('hamburgerBtn');

        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const hamburgerBtn = document.getElementById('hamburgerBtn');

        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        hamburgerBtn.classList.remove('active');
    }

    showSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => section.classList.remove('active'));

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    setActiveNavLink(activeLink) {
        // Remove active class from all nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to clicked link
        activeLink.classList.add('active');
    }

    setupImageUpload() {
        const uploadArea = document.getElementById('imageUploadArea');
        const fileInput = document.getElementById('propertyImages');
        const imagePreview = document.getElementById('imagePreview');

        if (!uploadArea || !fileInput) return;

        // Click to upload
        uploadArea.addEventListener('click', () => fileInput.click());

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary-color)';
            uploadArea.style.background = 'rgba(37, 99, 235, 0.05)';
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border-color)';
            uploadArea.style.background = 'var(--background-color)';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border-color)';
            uploadArea.style.background = 'var(--background-color)';
            
            const files = e.dataTransfer.files;
            this.handleImageFiles(files, imagePreview);
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            this.handleImageFiles(files, imagePreview);
        });
    }

    handleImageFiles(files, previewContainer) {
        previewContainer.innerHTML = '';
        
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = 'Preview';
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    setupSettingsToggles() {
        const toggles = document.querySelectorAll('.switch input[type="checkbox"]');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.saveSettingToggle(e.target.id, e.target.checked);
            });
        });

        // Password change form
        const changePasswordBtn = document.querySelector('.settings-card .btn-secondary');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', () => this.changePassword());
        }
    }

    saveProfile() {
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            bio: document.getElementById('bio').value
        };

        // Simulate API call
        this.showNotification('Perfil actualizado correctamente', 'success');
        
        // Save to localStorage for demo
        localStorage.setItem('userProfile', JSON.stringify(formData));
    }

    loadUserData() {
        // Load from localStorage for demo
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            
            document.getElementById('fullName').value = profile.fullName || '';
            document.getElementById('email').value = profile.email || '';
            document.getElementById('phone').value = profile.phone || '';
            document.getElementById('location').value = profile.location || '';
            document.getElementById('bio').value = profile.bio || '';
        }

        // Load settings
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            Object.keys(settings).forEach(key => {
                const toggle = document.getElementById(key);
                if (toggle) {
                    toggle.checked = settings[key];
                }
            });
        }
    }

    saveSettingToggle(settingId, value) {
        let settings = {};
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
        }
        
        settings[settingId] = value;
        localStorage.setItem('userSettings', JSON.stringify(settings));
        
        this.showNotification('Configuración guardada', 'success');
    }

    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('Por favor completa todos los campos', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showNotification('Las contraseñas no coinciden', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            this.showNotification('Contraseña cambiada correctamente', 'success');
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
        }, 1000);
    }

    handlePropertySubmit(e) {
        e.preventDefault();
        
        const formData = {
            type: document.getElementById('propertyType').value,
            price: document.getElementById('propertyPrice').value,
            title: document.getElementById('propertyTitle').value,
            description: document.getElementById('propertyDescription').value,
            bedrooms: document.getElementById('bedrooms').value,
            bathrooms: document.getElementById('bathrooms').value,
            area: document.getElementById('area').value,
            address: document.getElementById('propertyAddress').value
        };

        // Validate required fields
        if (!formData.type || !formData.price || !formData.title || !formData.description || !formData.address) {
            this.showNotification('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        // Simulate API call
        this.showNotification('Propiedad publicada correctamente', 'success');
        
        // Reset form
        document.querySelector('.property-form').reset();
        document.getElementById('imagePreview').innerHTML = '';
        
        // Switch to properties view
        setTimeout(() => {
            this.showSection('my-properties');
            this.setActiveNavLink(document.querySelector('[data-section="my-properties"]'));
        }, 2000);
    }

    changeAvatar() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('profileImage').src = e.target.result;
                    this.showNotification('Avatar actualizado', 'success');
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 90px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 0.5rem;
                    color: white;
                    font-weight: 500;
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                    max-width: 400px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                
                .notification-success { background: var(--success-color); }
                .notification-error { background: var(--danger-color); }
                .notification-info { background: var(--primary-color); }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }

        // Add to page
        document.body.appendChild(notification);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.closeSidebar();
        }
    }
}

// Global functions for external access
window.showSection = function(sectionId) {
    const dashboard = window.dashboardInstance;
    if (dashboard) {
        dashboard.showSection(sectionId);
        const navLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (navLink) {
            dashboard.setActiveNavLink(navLink);
        }
    }
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardInstance = new Dashboard();
});

// Property management functions
function editProperty(propertyId) {
    console.log('Editing property:', propertyId);
    // Implement edit functionality
    window.dashboardInstance.showNotification('Función de edición en desarrollo', 'info');
}

function deleteProperty(propertyId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
        console.log('Deleting property:', propertyId);
        // Implement delete functionality
        window.dashboardInstance.showNotification('Propiedad eliminada', 'success');
    }
}
