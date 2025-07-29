// Authentication functions
class AuthManager {
    constructor() {
        this.auth = window.auth;
        this.db = window.db;
        this.currentUser = null;
        this.init();
    }

    init() {
        // Listen for auth state changes
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                this.currentUser = user;
                this.updateUIForLoggedInUser(user);
            } else {
                this.currentUser = null;
                this.updateUIForLoggedOutUser();
            }
        });
    }

    async register(email, password, businessData) {
        try {
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Save additional business data to Firestore
            await this.db.collection('businesses').doc(user.uid).set({
                email: email,
                businessName: businessData.businessName,
                phone: businessData.phone,
                address: businessData.address,
                license: businessData.license,
                createdAt: new Date(),
                uid: user.uid
            });

            return { success: true, user };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    }

    async login(email, password) {
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    async logout() {
        try {
            await this.auth.signOut();
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    }

    updateUIForLoggedInUser(user) {
        const actionsDiv = document.querySelector('.actions');
        if (actionsDiv) {
            actionsDiv.innerHTML = `
                <div class="profile-dropdown">
                    <div class="profile-icon" onclick="authManager.toggleDropdown()">
                        <i class="fas fa-user-circle"></i>
                        <span>${user.email}</span>
                    </div>
                    <div class="dropdown-menu" id="profileDropdown">
                        <a href="dashboard.html" class="dropdown-item">
                            <i class="fas fa-tachometer-alt"></i> Dashboard
                        </a>
                        <a href="Upload.html" class="dropdown-item">
                            <i class="fas fa-upload"></i> Upload
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item" onclick="authManager.logout()">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </a>
                    </div>
                </div>
            `;
        }

        // Hide login/register links in navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.textContent === 'Dashboard' || item.textContent === 'Upload') {
                item.style.display = 'none';
            }
        });
    }

    updateUIForLoggedOutUser() {
        const actionsDiv = document.querySelector('.actions');
        if (actionsDiv) {
            actionsDiv.innerHTML = `
                <a class="login-btn" href="business-login.html">Log in</a>
                <button class="cta-btn" onclick="window.location.href='dashboard.html'">Find Yours Now</button>
            `;
        }

        // Show login/register links in navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.textContent === 'Dashboard' || item.textContent === 'Upload') {
                item.style.display = 'inline-block';
            }
        });
    }

    toggleDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }

    // Close dropdown when clicking outside
    closeDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.profile-dropdown')) {
        authManager.closeDropdown();
    }
});

// Export for use in other files
window.authManager = authManager; 