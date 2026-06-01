import axios from 'axios';

const API_URL =  'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

const attendanceService = {
  // Employee APIs
  checkIn: async (locationData = null) => {
    try {
      const response = await axios.post(
        `${API_URL}/attendance/checkin`,
        locationData || {},
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  },

  checkOut: async (locationData = null) => {
    try {
      const response = await axios.post(
        `${API_URL}/attendance/checkout`,
        locationData || {},
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  },

  getMyAttendance: async (month = null, year = null, page = 1, limit = 30) => {
    try {
      let url = `${API_URL}/attendance/my-attendance?page=${page}&limit=${limit}`;
      if (month && year) {
        url += `&month=${month}&year=${year}`;
      }
      const response = await axios.get(url, getAuthHeader());
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  },

  getTodayStatus: async () => {
    try {
      const response = await axios.get(`${API_URL}/attendance/today-status`, getAuthHeader());
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  },

  applyLeave: async (leaveData) => {
    try {
      const response = await axios.post(
        `${API_URL}/attendance/leave/apply`,
        leaveData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  },

  getMyLeaveRequests: async (status = null, page = 1, limit = 50) => {
    try {
      let url = `${API_URL}/attendance/leave/my-requests?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      const response = await axios.get(url, getAuthHeader());
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  },

  // Admin/HR APIs
  getAllAttendance: async (filters = {}) => {
    try {
      let url = `${API_URL}/attendance/all?`;
      if (filters.startDate) url += `startDate=${filters.startDate}&`;
      if (filters.endDate) url += `endDate=${filters.endDate}&`;
      if (filters.employeeId) url += `employeeId=${filters.employeeId}&`;
      if (filters.status) url += `status=${filters.status}&`;
      if (filters.page) url += `page=${filters.page}&`;
      if (filters.limit) url += `limit=${filters.limit}&`;
      
      const response = await axios.get(url, getAuthHeader());
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  },

  getAttendanceReport: async (startDate, endDate, employeeId = null, format = 'json') => {
    try {
      let url = `${API_URL}/attendance/report?startDate=${startDate}&endDate=${endDate}&format=${format}`;
      if (employeeId) url += `&employeeId=${employeeId}`;
      
      if (format === 'xml') {
        const response = await axios.get(url, {
          ...getAuthHeader(),
          responseType: 'blob'
        });
        return response.data;
      }
      
      const response = await axios.get(url, getAuthHeader());
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  },

  manualAttendance: async (data) => {
    try {
      const response = await axios.post(
        `${API_URL}/attendance/manual`,
        data,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  },

  getAllLeaveRequests: async (status = null, employeeId = null, page = 1, limit = 50) => {
    try {
      let url = `${API_URL}/attendance/leave-requests?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      if (employeeId) url += `&employeeId=${employeeId}`;
      const response = await axios.get(url, getAuthHeader());
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  },

  processLeave: async (leaveId, action, rejectionReason = null) => {
    try {
      const response = await axios.put(
        `${API_URL}/attendance/leave/${leaveId}/${action}`,
        { rejectionReason },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  },

  getSettings: async () => {
    try {
      const response = await axios.get(`${API_URL}/attendance/settings`, getAuthHeader());
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  },

  updateSettings: async (settings) => {
    try {
      const response = await axios.put(
        `${API_URL}/attendance/settings`,
        settings,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  },

  downloadXMLReport: async (startDate, endDate, employeeId = null) => {
    try {
      let url = `${API_URL}/attendance/report?startDate=${startDate}&endDate=${endDate}&format=xml`;
      if (employeeId) url += `&employeeId=${employeeId}`;
      
      const response = await axios.get(url, {
        ...getAuthHeader(),
        responseType: 'blob'
      });
      
      // Create download link
      const blob = new Blob([response.data], { type: 'application/xml' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `attendance_report_${Date.now()}.xml`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};

export default attendanceService;