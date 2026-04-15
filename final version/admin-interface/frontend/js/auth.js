/**
 * Authentication Module
 * Handles user login, logout, and session management
 */

const Auth = {
    apiBase: 'api', // Adjust this based on your server setup
    
    /**
     * Login user with credentials
     */
    async login(username, password) {
        try {
            const response = await fetch(`${this.apiBase}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password.trim()
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store user data and token
                localStorage.setItem('auth_user', JSON.stringify(data.user));
                localStorage.setItem('auth_token', data.token);
                return {
                    success: true,
                    user: data.user,
                    token: data.token
                };
            } else {
                return {
                    success: false,
                    message: data.message || 'Login failed'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Network error. Please try again.'
            };
        }
    },

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        window.location.href = 'index.html';
    },

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return localStorage.getItem('auth_token') !== null;
    },

    /**
     * Get current user
     */
    getCurrentUser() {
        const userStr = localStorage.getItem('auth_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Get auth token
     */
    getToken() {
        return localStorage.getItem('auth_token');
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}
