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
        // Hamburger button toggle
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
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }

    setActiveNavLink(activeLink) {
        // Remove active class from all nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to clicked link
        activeLink.classList.add('active');
    }

    setupSettingsToggles() {
        const toggles = document.querySelectorAll('.switch input');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const settingId = e.target.id;
                const isEnabled = e.target.checked;
                this.saveSetting(settingId, isEnabled);
            });
        });
    }

    setupImageUpload() {
        const uploadArea = document.getElementById('imageUploadArea');
        const fileInput = document.getElementById('propertyImages');
        const preview = document.getElementById('imagePreview');

        if (uploadArea && fileInput && preview) {
            // Click to upload
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });

            // Drag and drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#2563eb';
                uploadArea.style.backgroundColor = 'rgba(37, 99, 235, 0.05)';
            });

            uploadArea.addEventListener('dragleave', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#e2e8f0';
                uploadArea.style.backgroundColor = '#f8fafc';
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = '#e2e8f0';
                uploadArea.style.backgroundColor = '#f8fafc';
                
                const files = e.dataTransfer.files;
                this.handleFiles(files, preview);
            });

            // File input change
            fileInput.addEventListener('change', (e) => {
                const files = e.target.files;
                this.handleFiles(files, preview);
            });
        }
    }

    handleFiles(files, preview) {
        preview.innerHTML = '';
        
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = file.name;
                    preview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    saveProfile() {
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            location: document.getElementById('location').value,
            bio: document.getElementById('bio').value
        };

        // Save to localStorage
        localStorage.setItem('userProfile', JSON.stringify(formData));
        
        // Show success message
        this.showNotification('Perfil guardado exitosamente', 'success');
    }

    saveSetting(settingId, value) {
        // Save setting to localStorage
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        settings[settingId] = value;
        localStorage.setItem('userSettings', JSON.stringify(settings));
        
        // Show notification
        const message = value ? 'Configuración activada' : 'Configuración desactivada';
        this.showNotification(message, 'info');
    }

    handlePropertySubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const propertyData = Object.fromEntries(formData);
        
        // Here you would typically send the data to your backend
        console.log('Property data:', propertyData);
        
        this.showNotification('Propiedad enviada exitosamente', 'success');
        e.target.reset();
        
        // Clear image preview
        const preview = document.getElementById('imagePreview');
        if (preview) {
            preview.innerHTML = '';
        }
    }

    changeAvatar() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const profileImage = document.getElementById('profileImage');
                    if (profileImage) {
                        profileImage.src = e.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
        
        input.click();
    }

    loadUserData() {
        // Load profile data
        const profileData = JSON.parse(localStorage.getItem('userProfile') || '{}');
        if (profileData.fullName) {
            document.getElementById('fullName').value = profileData.fullName;
        }
        if (profileData.email) {
            document.getElementById('email').value = profileData.email;
        }
        if (profileData.phone) {
            document.getElementById('phone').value = profileData.phone;
        }
        if (profileData.location) {
            document.getElementById('location').value = profileData.location;
        }
        if (profileData.bio) {
            document.getElementById('bio').value = profileData.bio;
        }

        // Load settings
        const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
        Object.keys(settings).forEach(settingId => {
            const toggle = document.getElementById(settingId);
            if (toggle) {
                toggle.checked = settings[settingId];
            }
        });
    }

    handleResize() {
        // Close sidebar on mobile when screen size changes
        if (window.innerWidth > 768) {
            this.closeSidebar();
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});

// Global function for section navigation (used in HTML)
function showSection(sectionId) {
    const dashboard = new Dashboard();
    dashboard.showSection(sectionId);
}
