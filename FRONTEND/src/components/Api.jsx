import axios from "axios";

// ✅ Base URL for your Django API
const BASE_URL = "http://127.0.0.1:8000/api";

// Axios instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Set token for auth
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

// ✅ STUDENT dashboard endpoint
export const fetchStudentProfile = async () => {
    try {
        const response = await api.get("/studentDashboard/");
        console.log("STUDENT PROFILE RESPONSE:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching student profile:", error);
        throw error;
    }
};

// ✅ REGISTRAR dashboard
export const fetchRegistrarProfile = async () => {
    try {
        const response = await api.get("/RegistrarDashboard/");
        return response.data;
    } catch (error) {
        console.error("Error fetching registrar profile:", error);
        throw error;
    }
};

// ✅ LECTURER dashboard
export const fetchLecturerProfile = async () => {
    try {
        const response = await api.get("/dashboard/lecturer/");
        return response.data;
    } catch (error) {
        console.error("Error fetching lecturer profile:", error);
        throw error;
    }
};

// ✅ ISSUES: list and create
export const fetchIssues = async () => {
    try {
        const response = await api.get("/create-issues/");
        return response.data;
    } catch (error) {
        console.error("Error fetching issues:", error);
        throw error;
    }
};

export const createIssue = async (issueData) => {
    try {
        const response = await api.post("/create-issues/", issueData);
        return response.data;
    } catch (error) {
        console.error("Error creating issue:", error);
        throw error;
    }
};

// ✅ USERS: get all
export const getUsers = async () => {
    try {
        const response = await api.get("/users/");
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// ✅ Fetch only lecturers (for dropdown in registrar issue assignment)
export const fetchLecturers = async () => {
    try {
        const response = await api.get("/users/?user_type=lecturer");
        return response.data;
    } catch (error) {
        console.error("Error fetching lecturers:", error);
        throw error;
    }
};

// ✅ Assign issue to lecturer by username
export const assignIssueToLecturer = async (issueId, lecturerUsername) => {
    try {
        const response = await api.patch(`/issues/${issueId}/assign/`, {
            lecturer_username: lecturerUsername,
        });
        return response.data;
    } catch (error) {
        console.error("Error assigning issue:", error);
        throw error;
    }
};

export default api;
