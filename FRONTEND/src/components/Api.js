import axios from 'axios';

// Single backend URL for all environments
const API_BASE_URL = 'https://aits-group-g-backend.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Important for handling cookies and JWT tokens
});

// Add token to requests if it exists
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Store the token in localStorage for persistence
        localStorage.setItem('authToken', token);
    } else {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('authToken');
    }
};

// Initialize token from localStorage if it exists
const token = localStorage.getItem('authToken');
if (token) {
    setAuthToken(token);
}

// Get Users
export const getUsers = async () => {
    try {
        const response = await api.get('/users/');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Student Profile
export const fetchStudentProfile = async () => {
    try {
        const response = await api.get('/studentDashboard/');
        return response.data;
    } catch (error) {
        console.error('Error fetching student profile:', error);
        throw error;
    }
};

// Issue Management
export const createIssue = async (issueData) => {
    try {
        const response = await api.post('/create-issues/', issueData);
        return response.data;
    } catch (error) {
        console.error('Error creating issue:', error);
        throw error;
    }
};

// Notifications
export const fetchNotifications = async () => {
    try {
        const response = await api.get('/notifications/');
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await api.patch(`/notifications/${notificationId}/`, {
            is_read: true
        });
        return response.data;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

export default api; 