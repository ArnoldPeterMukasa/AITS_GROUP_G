// config.js
import axios from "axios";

const baseURLs = [
  "https://aits-group-g-backend.onrender.com",
  "http://127.0.0.1:8000",
];

// Choose base URL dynamically
const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const currentBaseURL = isLocalhost ? baseURLs[1] : baseURLs[0];

console.log("Hostname:", window.location.hostname);
console.log("Selected Base URL:", currentBaseURL);

const API = axios.create({
  baseURL: currentBaseURL,
});

// Set token for authentication
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

// Fetch student profile
export const fetchStudentProfile = async () => {
  const response = await API.get("api/studentDashboard/");
  return response.data;
};

// Create an issue
export const createIssue = async (issueData) => {
  try {
    const response = await API.post("/api/create-issues/", issueData);
    return response.data;
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await API.post("/api/login/", credentials);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export default API;
