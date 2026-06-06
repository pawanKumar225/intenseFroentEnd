

// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

class AdminAPI {
    constructor() {
        this.token = localStorage.getItem('adminToken');
    }

    getToken() {
        return localStorage.getItem('adminToken') || localStorage.getItem('token');
    }

    isLoggedIn() {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
        return !!token;
    }

    getCurrentAdmin() {
        const adminData = localStorage.getItem('adminData') || localStorage.getItem('userData');
        return adminData ? JSON.parse(adminData) : null;
    }

    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Store in both formats for compatibility
                localStorage.setItem('adminToken', data.data.token);
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('adminData', JSON.stringify(data.data.admin));
                localStorage.setItem('userData', JSON.stringify(data.data.admin));
                localStorage.setItem('requiresPasswordChange', data.data.requiresPasswordChange);
                this.token = data.data.token;
            }
            return data;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error' };
        }
    }

    async changePassword(oldPassword, newPassword) {
        try {
            const token = this.getToken();
            const response = await fetch(`${API_BASE_URL}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Change password error:', error);
            return {
                success: false,
                message: 'Network error. Please try again.'
            };
        }
    }

    async firstTimePasswordChange(newPassword, confirmPassword) {
        try {
            const token = this.getToken();
            if (!token) {
                return { success: false, message: 'No authentication token found' };
            }

            const response = await fetch(`${API_BASE_URL}/admin/first-time-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newPassword, confirmPassword })
            });
            
            const data = await response.json();
            
            // If password change successful, update stored token and flag
            if (data.success && data.token) {
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('token', data.token);
                localStorage.setItem('requiresPasswordChange', 'false');
                if (data.data) {
                    localStorage.setItem('adminData', JSON.stringify(data.data));
                    localStorage.setItem('userData', JSON.stringify(data.data));
                }
            }
            
            return data;
        } catch (error) {
            console.error('First time password change error:', error);
            return {
                success: false,
                message: 'Network error. Please try again.'
            };
        }
    }

    logout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isFirstTimeLogin');
        this.token = null;
        localStorage.clear();
    }

    async createAdmin(adminData) {
        try {
            const token = this.getToken();
            const response = await fetch(`${API_BASE_URL}/admins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(adminData)
            });
            return await response.json();
        } catch (error) {
            console.error('Create admin error:', error);
            return { success: false, message: 'Network error' };
        }
    }
}

export default new AdminAPI();