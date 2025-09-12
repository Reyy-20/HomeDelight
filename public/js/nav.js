// Function to check localStorage and update the authentication button
        function checkAuthStatus() {
            const authButton = document.getElementById('authButton');
            
            // Check if user is logged in (you can customize this key name)
            const isLoggedIn = localStorage.getItem('userLoggedIn');
            const userData = localStorage.getItem('userData');
            
            if (isLoggedIn === 'true' || userData) {
                // User is logged in - show Dashboard button
                authButton.textContent = 'Dashboard';
                authButton.href = 'gptdashboard.html'; // Update href to dashboard page
            } else {
                // User is not logged in - show LogIn/Register button
                authButton.textContent = 'LogIn/Register';
                authButton.className = 'Nav-btn';
                authButton.href = 'public/login&register2.html'; // Update href to login page
            }
        }

        // Function to handle successful login
        function onLoginSuccess(userData) {
            // Store user session in localStorage
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Update the header
            checkAuthStatus();
        }

        // Function to handle logout
        function onLogout() {
            // Clear user session from localStorage
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('userData');
            
            // Update the header
            checkAuthStatus();
        }

        // Demo functions for testing (remove these in production)
        function simulateLogin() {
            const demoUser = {
                id: 123,
                name: 'John Doe',
                email: 'john@example.com'
            };
            onLoginSuccess(demoUser);
            alert('Login simulated! The header button should now show "Dashboard"');
        }

        function simulateLogout() {
            onLogout();
            alert('Logout simulated! The header button should now show "LogIn/Register"');
        }

        // Check authentication status when the page loads
        document.addEventListener('DOMContentLoaded', function() {
            checkAuthStatus();
        });

        // Optional: Listen for storage changes from other tabs/windows
        window.addEventListener('storage', function(e) {
            if (e.key === 'userLoggedIn' || e.key === 'userData') {
                checkAuthStatus();
            }
        });

        // Handle click on the auth button
        document.getElementById('authButton').addEventListener('click', function(e) {
            e.preventDefault();
            
            const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
            
            if (isLoggedIn) {
                // Redirect to dashboard or show dashboard content
                console.log('Redirecting to dashboard...');
                window.location.href = 'gptdashboard.html'
            } else {
                // Redirect to login page
                console.log('Redirecting to login...');
                window.location.href ='login&register2.html'
            }
        });