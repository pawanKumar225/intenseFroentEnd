// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

class AdminAPI {
    constructor() {
        this.token = localStorage.getItem('adminToken');
    }

    getToken() {
        return localStorage.getItem('adminToken');
    }

   // src/services/api.js (Add this method if missing)
isLoggedIn() {
  const token = localStorage.getItem('adminToken');
  return !!token;
}
    getCurrentAdmin() {
        const adminData = localStorage.getItem('adminData');
        return adminData ? JSON.parse(adminData) : null;
    }

    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            console.log("base URL:", `${API_BASE_URL}/login`)
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('adminToken', data.data.token);
                localStorage.setItem('adminData', JSON.stringify(data.data.admin));
                this.token = data.data.token;
            }
            return data;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error' };
        }
    }

// Change Password
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
    logout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        this.token = null;
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