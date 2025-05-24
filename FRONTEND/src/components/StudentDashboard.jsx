import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import { fetchStudentProfile, setAuthToken } from "../config.js"; // Adjust the import path as necessary
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

                if (!token) {
                    console.error("No auth token found");
                    navigate("/");
                    return;
                }

                // Set token for API requests
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

                    if (profileData.issues) {
                        setIssues(profileData.issues);
                    }
                } else {
                    console.error("Failed to fetch profile data");
                }
            } catch (error) {
                console.error("Error fetching data:", error);

                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate("/");
                }
            }
        };

        fetchData();
    }, [navigate]);

    const handleIssueCreated = (newIssue) => {
        setIssues(prevIssues => [...prevIssues, newIssue]);
    };

    return (
        <div className="dashboard-container">
            {/* Header */}
            <nav className="dashboard-header">
                <h1>Student Dashboard</h1>
                <div className="header-actions">
                    <button className="button" onClick={scrollToWelcome}>Home</button>
                    <button className="button" onClick={() => navigate("/inbox", { state: { user } })}>Inbox</button>
                    <button className="button" onClick={() => setShowNotifications(!showNotifications)}>Notifications</button>
                    <button className="button logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="content">
                {!showNotifications ? (
                    <>
                        <h1 id="welcome-section">Welcome, {user?.name || "Student"}</h1>

                        {/* Profile Info */}
                        <div className="section profile-section">
                            <h2>Your Profile</h2>
                            <p><strong>Name:</strong> {user?.name || "N/A"}</p>
                            <p><strong>Email:</strong> {user?.email || "N/A"}</p>
                            <p><strong>Registration Number:</strong> {user?.registration_number || "N/A"}</p>
                        </div>

                        {/* Course Info */}
                        <div className="section">
                            <h2>Course</h2>
                            <p>{user?.course || "No course available"}</p>
                        </div>

                        {/* Create Issue */}
                        <div className="section">
                            <h2>Create Issue</h2>
                            <CreateIssueForm onIssueCreated={handleIssueCreated} />
                        </div>

                        {/* Display Issues */}
                        <div className="section">
                            <h2>Your Issues</h2>
                            {issues.length > 0 ? (
                                <ul className="issues-list">
                                    {issues.map((issue, index) => (
                                        <li key={index} className="issue-item">
                                            <div className="issue-header">
                                                <span className="issue-category">{issue.category}</span>
                                                <span className={`issue-status status-${issue.status}`}>{issue.status}</span>
                                            </div>
                                            <div className="issue-description">{issue.description}</div>
                                            <div className="issue-date">
                                                Created: {new Date(issue.created_at).toLocaleDateString()}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No issues submitted yet.</p>
                            )}
                        </div>
                    </>
                ) : (
                    // Notifications Section
                    <div className="section">
                        <h2>Notifications</h2>
                        <ul className="notifications-list">
                            {user?.workedUponIssues?.length > 0 ? (
                                user.workedUponIssues.map((message, index) => (
                                    <li key={index} className="notification-item">{message}</li>
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
