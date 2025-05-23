import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import { fetchStudentProfile, setAuthToken } from "./Api";
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
                    navigate("/");
                    return;
                }

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
                if (error.response?.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate("/");
                }
                console.error("Error fetching data:", error);
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
                <h1 className="dashboard-title">Student Dashboard</h1>
                <div className="header-actions">
                    <button className="button" onClick={scrollToWelcome}>Home</button>
                    <button className="button" onClick={() => navigate("/inbox", { state: { user } })}>Inbox</button>
                    <button className="button" onClick={() => setShowNotifications(!showNotifications)}>Notifications</button>
                    <button className="button logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="dashboard-main">
                {!showNotifications ? (
                    <>
                        <h2 id="welcome-section" className="welcome-heading">Welcome, {user?.name || "Student"}</h2>

                        {/* Two-column layout */}
                        <div className="dashboard-grid">
                            {/* Left Column */}
                            <div className="dashboard-column">
                                <div className="card">
                                    <h3>Your Profile</h3>
                                    <p><strong>Name:</strong> {user?.name}</p>
                                    <p><strong>Email:</strong> {user?.email}</p>
                                    <p><strong>Registration Number:</strong> {user?.registration_number}</p>
                                </div>

                                <div className="card">
                                    <h3>Course</h3>
                                    <p>{user?.course}</p>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="dashboard-column">
                                <div className="card">
                                    <h3>Create Issue</h3>
                                    <CreateIssueForm onIssueCreated={handleIssueCreated} />
                                </div>

                                <div className="card">
                                    <h3>Your Issues</h3>
                                    {issues.length > 0 ? (
                                        <ul className="issues-list">
                                            {issues.map((issue, index) => (
                                                <li key={index} className="issue-item">
                                                    <div className="issue-header">
                                                        <span className="issue-category">{issue.category}</span>
                                                        <span className={`issue-status status-${issue.status}`}>{issue.status}</span>
                                                    </div>
                                                    <div className="issue-description">{issue.description}</div>
                                                    <div className="issue-date">Created: {new Date(issue.created_at).toLocaleDateString()}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No issues submitted yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="card">
                        <h3>Notifications</h3>
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
