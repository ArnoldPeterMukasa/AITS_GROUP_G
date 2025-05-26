import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import { fetchStudentProfile, setAuthToken } from "../config.js";
import CreateIssueForm from "./CreateIssueForm";

function StudentDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "Loading...",
        email: "Loading...",
        registration_number: "Loading...",
        course: "Loading...",
        workedUponIssues: [],
    });

    const [showNotifications, setShowNotifications] = useState(false);
    const [issues, setIssues] = useState([]);

    const scrollToWelcome = () => {
        const welcomeSection = document.getElementById("welcome-section");
        if (welcomeSection) {
            welcomeSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate("/");
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) return navigate("/");

                setAuthToken(token);
                const profileData = await fetchStudentProfile();
                if (profileData.status === 'success' && profileData.student) {
                    const { name, email, registration_number, course } = profileData.student;
                    setUser({
                        name: name || "N/A",
                        email: email || "N/A",
                        registration_number: registration_number || "N/A",
                        course: course || "N/A",
                        workedUponIssues: profileData.notifications?.map(n => n.message) || [],
                    });
                    setIssues(profileData.issues || []);
                } else {
                    console.error("Profile fetch failed");
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate("/");
                }
                console.error("Fetch error:", error);
            }
        };
        fetchData();
    }, [navigate]);

    const handleIssueCreated = (newIssue) => {
        setIssues(prev => [...prev, newIssue]);
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar Navigation */}
            <div className="sidebar">
                <h2>Student</h2>
                <ul>
                    <li><button onClick={scrollToWelcome}>Home</button></li>
                    <li><button onClick={() => navigate("/inbox", { state: { user } })}>Inbox</button></li>
                    <li><button onClick={() => setShowNotifications(!showNotifications)}>Notifications</button></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="content">
                <h1 id="welcome-section" className="animate__animated animate__fadeInDown">
                    Welcome, {user?.name || "Student"}
                </h1>

                {!showNotifications ? (
                    <>
                        <div className="overview">
                            <div className="card">
                                 <div className="form-container">
                                    <h3>Your Profile</h3>
                                    <p><strong>Name:</strong> {user.name}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                    <p><strong>Reg No:</strong> {user.registration_number}</p>
                                </div>
                            </div>

                            <div className="card">
                                <h3>Course</h3>
                                <p>{user.course}</p>
                            </div>
                        </div>

                        
                            <h3>Create Issue</h3>
                            <CreateIssueForm onIssueCreated={handleIssueCreated} />
                        

                        
                            <h3>Your Issues</h3>
                            {issues.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Category</th>
                                            <th>Status</th>
                                            <th>Description</th>
                                            <th>Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {issues.map((issue, index) => (
                                            <tr key={index}>
                                                <td>{issue.category}</td>
                                                <td>{issue.status}</td>
                                                <td>{issue.description}</td>
                                                <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No issues submitted yet.</p>
                            )}
                    
                    </>
                ) : (
                    <div className="notifications">
                        <h3>Notifications</h3>
                        <ul className="notifications-list">
                            {user?.workedUponIssues?.length > 0 ? (
                                user.workedUponIssues.map((msg, idx) => (
                                    <li key={idx}>{msg}</li>
                                ))
                            ) : (
                                <p>No notifications available.</p>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentDashboard;


