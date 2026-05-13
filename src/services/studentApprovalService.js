// src/services/studentApprovalService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token
const getAuthToken = () => {
    return localStorage.getItem('adminToken');
};

// Axios instance with interceptors
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

// Student Approval Service
const studentApprovalService = {
    // Fetch pending students
    getPendingStudents: async () => {
        try {
            const response = await apiClient.get('/admin/pending-students');
            return response.data;
        } catch (error) {
            console.error('Error fetching pending students:', error);
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },

    // Fetch approved students
    getApprovedStudents: async () => {
        try {
            const response = await apiClient.get('/admin/approved-students');
            return response.data;
        } catch (error) {
            console.error('Error fetching approved students:', error);
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },

    // Fetch rejected students
    getRejectedStudents: async () => {
        try {
            const response = await apiClient.get('/admin/rejected-students');
            return response.data;
        } catch (error) {
            console.error('Error fetching rejected students:', error);
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },

    // Fetch all students
    getAllStudents: async () => {
        try {
            const response = await apiClient.get('/admin/all-students');
            return response.data;
        } catch (error) {
            console.error('Error fetching all students:', error);
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },

    // Approve single student
    approveStudent: async (studentId) => {
        try {
            const response = await apiClient.put(`/admin/approve-student/${studentId}`);
            return response.data;
        } catch (error) {
            console.error('Error approving student:', error);
            throw error.response?.data || { success: false, message: 'Error approving student' };
        }
    },

    // Reject single student
    rejectStudent: async (studentId, remarks) => {
        try {
            const response = await apiClient.put(`/admin/reject-student/${studentId}`, { remarks });
            return response.data;
        } catch (error) {
            console.error('Error rejecting student:', error);
            throw error.response?.data || { success: false, message: 'Error rejecting student' };
        }
    },

    // Bulk approve students
    bulkApproveStudents: async (studentIds) => {
        try {
            const response = await apiClient.post('/admin/bulk-approve-students', { studentIds });
            return response.data;
        } catch (error) {
            console.error('Error bulk approving students:', error);
            throw error.response?.data || { success: false, message: 'Error bulk approving students' };
        }
    },

    // Bulk reject students
    bulkRejectStudents: async (studentIds, remarks) => {
        try {
            const response = await apiClient.post('/admin/bulk-reject-students', { studentIds, remarks });
            return response.data;
        } catch (error) {
            console.error('Error bulk rejecting students:', error);
            throw error.response?.data || { success: false, message: 'Error bulk rejecting students' };
        }
    },

    // Get student stats
    getStudentStats: async () => {
        try {
            const response = await apiClient.get('/admin/student-stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching student stats:', error);
            throw error.response?.data || { success: false, message: 'Error fetching stats' };
        }
    }
};

export default studentApprovalService;