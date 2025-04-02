import axios from "axios";

// Base URL for the Django backend
const BASE_URL = "http://127.0.0.1:8000/api"; // Update this to match your Django backend URL

// Create an Axios instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Function to set the Authorization token for authenticated requests
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

// Example API calls

// Fetch all issues
export const fetchIssues = async () => {
    try {
        const response = await api.get("/issues/");
        return response.data;
    } catch (error) {
        console.error("Error fetching issues:", error);
        throw error;
    }
};

// Create a new issue
export const createIssue = async (issueData) => {
    try {
        const response = await api.post("/issues/", issueData);
        return response.data;
    } catch (error) {
        console.error("Error creating issue:", error);
        throw error;
    }
};

// Fetch user profile
export const fetchUserProfile = async () => {
    try {
        const response = await api.get("/profile/");
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};
export const getUsers = async () => {
    try {
        const response = await api.get("/users/"); // Replace "/users/" with your actual Django API endpoint for users
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Export the Axios instance for custom requests
export default api;