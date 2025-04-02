import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CreateIssueForm from "./CreateIssueForm";
import "./StudentDashboard.css";

function StudentDashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve the student name from the registration page (passed via state)
    const { name } = location.state || { name: "Student" };

    const [user, setUser] = useState({
        name: name, // Use the name passed from the registration page
        email: "",
        registrationNumber: "",
        program: "Computer Science",
        workedUponIssues: ["Issue A has been resolved", "Issue B has been reviewed"], // Example worked upon issues
    });

    const [newIssue, setNewIssue] = useState(""); // State to hold the new issue description
    const [issueType, setIssueType] = useState("Missing Marks"); // State to hold the selected issue type
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
            // Add the new issue with its type to the list
            setCreatedIssues([...createdIssues, { description: newIssue, type: issueType }]);
            setNewIssue(""); // Clear the input field
            setIssueType("Missing Marks"); // Reset the dropdown to the default value
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
                    <button className="button" onClick={scrollToWelcome}>
                        Home
                    </button>
                    <button
                        className="button"
                        onClick={() => navigate("/inbox", { state: { user } })}
                    >
                        Inbox
                    </button>
                    <button
                        className="button"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        Notifications
                    </button>
                    <button className="button logout-button" onClick={handleLogout}>
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
                                {/* Dropdown for Issue Type */}
                                <select
                                    value={issueType}
                                    onChange={(e) => setIssueType(e.target.value)}
                                    className="issue-dropdown"
                                >
                                    <option value="Missing Marks">Missing Marks</option>
                                    <option value="Appeal">Appeal</option>
                                    <option value="Correction for Marks">Correction for Marks</option>
                                </select>

                                {/* Input for Issue Description */}
                                <input
                                    type="text"
                                    placeholder="Enter issue description"
                                    value={newIssue}
                                    onChange={(e) => setNewIssue(e.target.value)}
                                    className="issue-input"
                                />

                                {/* Add Issue Button */}
                                <button className="create-issue-button" onClick={handleCreateIssue}>
                                    Add Issue
                                </button>
                            </div>

                            {/* Display Created Issues */}
                            <div className="created-issues">
                                <h3>Created Issues</h3>
                                <ul>
                                    {createdIssues.length > 0 ? (
                                        createdIssues.map((issue, index) => (
                                            <li key={index}>
                                                <strong>Type:</strong> {issue.type} <br />
                                                <strong>Description:</strong> {issue.description}
                                            </li>
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