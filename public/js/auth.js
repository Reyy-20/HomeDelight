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
                this.loadUserData(user.uid);
            } else {
                this.currentUser = null;
                this.updateUIForLoggedOutUser();
            }
        });
    }

    async loadUserData(uid) {
        try {
            // Check if user is a business
            const businessDoc = await this.db.collection('businesses').doc(uid).get();
            if (businessDoc.exists) {
                const businessData = businessDoc.data();
                this.currentUser.businessData = businessData;
                console.log('Business user loaded:', businessData);
            } else {
                // Check if user is a regular user
                const userDoc = await this.db.collection('users').doc(uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    this.currentUser.userData = userData;
                    console.log('Regular user loaded:', userData);
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    async register(email, password, userData, userType = 'user') {
        try {
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            const userInfo = {
                email: email,
                uid: user.uid,
                createdAt: new Date(),
                userType: userType,
                registrationDate: new Date(),
                lastLogin: new Date(),
                status: 'active',
                ...userData
            };

            // Save user data to appropriate collection
            if (userType === 'business') {
                await this.db.collection('businesses').doc(user.uid).set(userInfo);
                console.log('Business registered successfully in Firestore:', userInfo);
            } else {
                await this.db.collection('users').doc(user.uid).set(userInfo);
                console.log('User registered successfully in Firestore:', userInfo);
            }

            // Also save to activeUsers collection for real-time tracking
            await this.db.collection('activeUsers').doc(user.uid).set({
                uid: user.uid,
                email: email,
                userType: userType,
                lastSeen: new Date(),
                online: true,
                registrationDate: new Date()
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
            const user = userCredential.user;
            
            // Load user data after successful login
            await this.loadUserData(user.uid);
            
            // Update last login time in Firestore
            const userType = user.businessData ? 'business' : 'user';
            const collectionName = userType === 'business' ? 'businesses' : 'users';
            
            await this.db.collection(collectionName).doc(user.uid).update({
                lastLogin: new Date(),
                status: 'active'
            });
            
            // Update activeUsers collection
            await this.db.collection('activeUsers').doc(user.uid).set({
                uid: user.uid,
                email: user.email,
                userType: userType,
                lastSeen: new Date(),
                online: true
            }, { merge: true });
            
            console.log('User logged in successfully and updated in Firestore');
            
            return { success: true, user };
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
            const displayName = user.businessData?.businessName || user.userData?.name || user.email;
            actionsDiv.innerHTML = `
                <div class="profile-dropdown">
                    <div class="profile-icon" onclick="authManager.toggleDropdown()">
                        <i class="fas fa-user-circle"></i>
                        <span>${displayName}</span>
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

    // Real-time user tracking
    startUserTracking() {
        if (this.currentUser) {
            const userRef = this.db.collection('activeUsers').doc(this.currentUser.uid);
            userRef.set({
                uid: this.currentUser.uid,
                email: this.currentUser.email,
                lastSeen: new Date(),
                online: true
            });

            // Update last seen when user leaves
            window.addEventListener('beforeunload', () => {
                userRef.update({
                    lastSeen: new Date(),
                    online: false
                });
            });
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