// services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class AdminAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to handle fetch requests
  async fetchWithConfig(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', // Important for CORS with credentials
    };

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, finalOptions);
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return { response, data };
      }
      
      return { response, data: null };
    } catch (error) {
      console.error(`Fetch error for ${endpoint}:`, error);
      throw error;
    }
  }
 // Check if user is logged in
    isLoggedIn() {
        const token = localStorage.getItem('adminToken');
        return token !== null && token !== undefined && token !== '';
    }

  // Test backend connection
  async testConnection() {
    try {
      const { response } = await this.fetchWithConfig('/health', {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Admin login
  async login(email, password) {
    try {
      const { response, data } = await this.fetchWithConfig('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(data?.message || 'Login failed');
      }

      return {
        success: true,
        ...data,
      };
    } catch (error) {
      console.error('Login API error:', error);
      return {
        success: false,
        message: error.message || 'Network error occurred',
      };
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminData');
  }

  // Check if authenticated
  isAuthenticated() {
    const token = localStorage.getItem('adminToken');
    return !!token;
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('adminToken');
  }
}

const adminAPI = new AdminAPI();
export default adminAPI;