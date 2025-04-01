import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        registrationNumber: "",
        program: "Computer Science",
        workedUponIssues: ["Issue A has been resolved", "Issue B has been reviewed"], // Example worked upon issues
    });

    const [newIssue, setNewIssue] = useState(""); // State to hold the new issue
    const [createdIssues, setCreatedIssues] = useState([]); // State to hold created issues
    const [submittedIssues, setSubmittedIssues] = useState([]); // State to hold submitted issues
    const [showNotifications, setShowNotifications] = useState(false); // State to toggle notifications

    const scrollToWelcome = () => {
        const welcomeSection = document.getElementById("welcome-section");
        if (welcomeSection) {
            welcomeSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleCreateIssue = () => {
        if (newIssue.trim() !== "") {
            setCreatedIssues([...createdIssues, newIssue]); // Add the new issue to the list
            setNewIssue(""); // Clear the input field
        }
    };

    const handleSubmitIssues = () => {
        if (createdIssues.length > 0) {
            setSubmittedIssues([...submittedIssues, ...createdIssues]); // Add created issues to submitted issues
            setCreatedIssues([]); // Clear the created issues list
            alert("Issues submitted successfully!");
        } else {
            alert("No issues to submit!");
        }
    };

    const handleLogout = () => {
        navigate("/"); // Redirect to the initial home page
    };

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <nav className="dashboard-header">
                <h1>Student Dashboard</h1>
                <div className="header-actions">
                    <button className="header-button" onClick={scrollToWelcome}>
                        Home
                    </button>
                    <button
                        className="navbar-button"
                        onClick={() => navigate("/inbox", { state: { user } })}
                    >
                        Inbox
                    </button>
                    <button
                        className="header-button"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        Notifications
                    </button>
                    <button className="header-button logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Content Section */}
            <div className="content">
                {!showNotifications ? (
                    <>
                        <h1 id="welcome-section">Welcome, {user?.name || "Student"}</h1>
                        <div className="section profile-section">
                            <h2>Your Profile</h2>
                            <p>
                                <strong>Name:</strong> {user?.name || "N/A"}
                            </p>
                            <p>
                                <strong>Email:</strong> {user?.email || "N/A"}
                            </p>
                            <p>
                                <strong>Registration Number:</strong> {user?.registrationNumber || "N/A"}
                            </p>
                        </div>

                        <div className="section">
                            <h2>Your Program</h2>
                            <p>{user?.program || "No program available"}</p>
                        </div>

                        {/* Create Issue Section */}
                        <div className="section">
                            <h2>Create Issue</h2>
                            <div className="create-issue-form">
                                <input
                                    type="text"
                                    placeholder="Enter issue description"
                                    value={newIssue}
                                    onChange={(e) => setNewIssue(e.target.value)}
                                    className="issue-input"
                                />
                                <button className="create-issue-button" onClick={handleCreateIssue}>
                                    Add Issue
                                </button>
                            </div>
                            <div className="created-issues">
                                <h3>Created Issues</h3>
                                <ul>
                                    {createdIssues.length > 0 ? (
                                        createdIssues.map((issue, index) => (
                                            <li key={index}>{issue}</li>
                                        ))
                                    ) : (
                                        <p>No issues created yet.</p>
                                    )}
                                </ul>
                                {createdIssues.length > 0 && (
                                    <button
                                        className="submit-issues-button"
                                        onClick={handleSubmitIssues}
                                    >
                                        Submit Issues
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    /* Notifications Section */
                    <div className="section">
                        <h2>Notifications</h2>
                        <ul className="notifications-list">
                            {user?.workedUponIssues?.length > 0 ? (
                                user.workedUponIssues.map((message, index) => (
                                    <li key={index} className="notification-item">
                                        {message}
                                    </li>
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