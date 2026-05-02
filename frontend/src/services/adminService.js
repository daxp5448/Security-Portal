import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const adminService = {
    getStats: async () => {
        const response = await axios.get(`${API_URL}/admin/stats`, getAuthHeader());
        return response.data;
    },
    getMapStats: async () => {
        const response = await axios.get(`${API_URL}/admin/stats/map`, getAuthHeader());
        return response.data;
    },
    getUsers: async () => {
        const response = await axios.get(`${API_URL}/admin/users`, getAuthHeader());
        return response.data;
    },
    getUser: async (id) => {
        const response = await axios.get(`${API_URL}/admin/users/${id}`, getAuthHeader());
        return response.data;
    },
    deleteUser: async (id) => {
        const response = await axios.delete(`${API_URL}/admin/users/${id}`, getAuthHeader());
        return response.data;
    },
    createUser: async (userData) => {
        const response = await axios.post(`${API_URL}/admin/users`, userData, getAuthHeader());
        return response.data;
    },
    updateUserRole: async (userId, role) => {
        const response = await axios.patch(`${API_URL}/admin/users/${userId}/role`, { role }, getAuthHeader());
        return response.data;
    },
    toggleUserBlock: async (userId, isActive) => {
        const response = await axios.patch(`${API_URL}/admin/users/${userId}/block`, { is_active: isActive }, getAuthHeader());
        return response.data;
    },
    getLogs: async (limit = 50) => {
        const response = await axios.get(`${API_URL}/logs?limit=${limit}`, getAuthHeader());
        return response.data;
    },
    getAuditLogs: async (limit = 50) => {
        const response = await axios.get(`${API_URL}/admin/audit-logs?limit=${limit}`, getAuthHeader());
        return response.data;
    },
    getDangerousAreas: async () => {
        const response = await axios.get(`${API_URL}/admin/analytics/dangerous-areas`, getAuthHeader());
        return response.data;
    },
    getIncidents: async () => {
        const response = await axios.get(`${API_URL}/incidents`, getAuthHeader());
        return response.data;
    },
    getAnalyticsTrends: async () => {
        const response = await axios.get(`${API_URL}/admin/analytics/trends`, getAuthHeader());
        return response.data;
    },
    getAnalyticsCategories: async () => {
        const response = await axios.get(`${API_URL}/admin/analytics/categories`, getAuthHeader());
        return response.data;
    },
    getAnalyticsResolution: async () => {
        const response = await axios.get(`${API_URL}/admin/analytics/resolution`, getAuthHeader());
        return response.data;
    },
    getOfficers: async () => {
        const response = await axios.get(`${API_URL}/admin/officers`, getAuthHeader());
        return response.data;
    },
    createOfficer: async (data) => {
        const response = await axios.post(`${API_URL}/admin/officers`, data, getAuthHeader());
        return response.data;
    },
    updateOfficerStatus: async (id, status) => {
        const response = await axios.patch(`${API_URL}/admin/officers/${id}/status`, { status }, getAuthHeader());
        return response.data;
    },
    assignOfficer: async (incidentId, officerId) => {
        const response = await axios.patch(`${API_URL}/admin/incidents/${incidentId}/assign`, { officer_id: officerId }, getAuthHeader());
        return response.data;
    },
    getSystemHealth: async () => {
        const response = await axios.get(`${API_URL}/admin/system/status`, getAuthHeader());
        return response.data;
    }
};
