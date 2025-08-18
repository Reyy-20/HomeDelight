// Real-time monitoring system
class RealtimeMonitor {
    constructor() {
        this.db = window.db;
        this.activeUsers = new Map();
        this.init();
    }

    init() {
        // Listen for real-time changes in active users
        this.db.collection('activeUsers').onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const userData = change.doc.data();
                
                if (change.type === 'added' || change.type === 'modified') {
                    this.activeUsers.set(change.doc.id, userData);
                    this.updateActiveUsersDisplay();
                } else if (change.type === 'removed') {
                    this.activeUsers.delete(change.doc.id);
                    this.updateActiveUsersDisplay();
                }
            });
        });

        // Clean up offline users every 5 minutes
        setInterval(() => {
            this.cleanupOfflineUsers();
        }, 5 * 60 * 1000);
    }

    updateActiveUsersDisplay() {
        const container = document.getElementById('active-users-container');
        if (!container) return;

        const onlineUsers = Array.from(this.activeUsers.values()).filter(user => user.online);
        const offlineUsers = Array.from(this.activeUsers.values()).filter(user => !user.online);

        container.innerHTML = `
            <div class="active-users-section">
                <h3>Active Users (${onlineUsers.length})</h3>
                <div class="users-grid">
                    ${onlineUsers.map(user => this.createUserCard(user, true)).join('')}
                </div>
            </div>
            <div class="recent-users-section">
                <h3>Recent Users (${offlineUsers.length})</h3>
                <div class="users-grid">
                    ${offlineUsers.slice(0, 10).map(user => this.createUserCard(user, false)).join('')}
                </div>
            </div>
        `;
    }

    createUserCard(user, isOnline) {
        const lastSeen = user.lastSeen ? new Date(user.lastSeen.toDate()).toLocaleString() : 'Unknown';
        const statusClass = isOnline ? 'online' : 'offline';
        
        return `
            <div class="user-card ${statusClass}">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-info">
                    <div class="user-email">${user.email}</div>
                    <div class="user-status">
                        <span class="status-dot ${statusClass}"></span>
                        ${isOnline ? 'Online' : 'Offline'}
                    </div>
                    <div class="user-last-seen">Last seen: ${lastSeen}</div>
                </div>
            </div>
        `;
    }

    async cleanupOfflineUsers() {
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

        const offlineUsers = await this.db.collection('activeUsers')
            .where('online', '==', false)
            .where('lastSeen', '<', fiveMinutesAgo)
            .get();

        const batch = this.db.batch();
        offlineUsers.docs.forEach(doc => {
            batch.delete(doc.ref);
        });

        await batch.commit();
    }

    // Get user statistics
    async getUserStats() {
        const usersSnapshot = await this.db.collection('users').get();
        const businessesSnapshot = await this.db.collection('businesses').get();
        const activeUsersSnapshot = await this.db.collection('activeUsers').get();

        return {
            totalUsers: usersSnapshot.size,
            totalBusinesses: businessesSnapshot.size,
            activeUsers: activeUsersSnapshot.size,
            onlineUsers: Array.from(this.activeUsers.values()).filter(user => user.online).length
        };
    }

    // Display statistics
    async displayStats() {
        const stats = await this.getUserStats();
        const statsContainer = document.getElementById('user-stats');
        
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${stats.totalUsers}</div>
                        <div class="stat-label">Total Users</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.totalBusinesses}</div>
                        <div class="stat-label">Total Businesses</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.onlineUsers}</div>
                        <div class="stat-label">Online Now</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.activeUsers}</div>
                        <div class="stat-label">Active Today</div>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize real-time monitor
const realtimeMonitor = new RealtimeMonitor();

// Export for use in other files
window.realtimeMonitor = realtimeMonitor; 