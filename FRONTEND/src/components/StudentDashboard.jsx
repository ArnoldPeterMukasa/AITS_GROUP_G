import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect to login if studentData is not passed in state
    useEffect(() => {
        if (!location.state?.studentData) {
            navigate("/login"); // Redirect to login if student info is missing
        }
    }, [location.state, navigate]);

    // Default to empty data to avoid undefined errors before redirect
    const studentData = location.state?.studentData || {
        name: "",
        email: "",
        registrationNumber: "",
        program: ""
    };

    const [user, setUser] = useState({
        name: studentData.name,
        email: studentData.email,
        registrationNumber: studentData.registrationNumber,
        program: studentData.program,
        workedUponIssues: ["Issue A has been resolved", "Issue B has been reviewed"],
    });

    const [newIssue, setNewIssue] = useState("");
    const [issueType, setIssueType] = useState("Missing Marks");
    const [showNotifications, setShowNotifications] = useState(false);

    // Fetch data for student dashboard
    useEffect(() => {
        if (studentData?.email) {
            fetchStudentData();
        }
    }, [studentData]);

    const fetchStudentData = async () => {
        try {
            const response = await fetch(`/api/student/dashboard?email=${studentData.email}`);
            const data = await response.json();
            setUser((prevUser) => ({
                ...prevUser,
                workedUponIssues: data.notifications || [],
                createdIssues: data.issues || [],
            }));
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    };

    const scrollToWelcome = () => {
        const welcomeSection = document.getElementById("welcome-section");
        if (welcomeSection) {
            welcomeSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleCreateIssue = () => {
        if (newIssue.trim() !== "") {
            setUser({
                ...user,
                createdIssues: [...user.createdIssues, { description: newIssue, type: issueType }],
            });
            setNewIssue("");
            setIssueType("Missing Marks");
        }
    };

    const handleSubmitIssues = async () => {
        if (user.createdIssues.length > 0) {
            try {
                const response = await fetch("/api/issues", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        issues: user.createdIssues,
                    }),
                });

                if (response.ok) {
                    alert("Issues submitted successfully!");
                    setUser({
                        ...user,
                        submittedIssues: [...user.submittedIssues, ...user.createdIssues],
                        createdIssues: [],
                    });
                } else {
                    alert("Failed to submit issues.");
                }
            } catch (error) {
                alert("Error submitting issues.");
            }
        } else {
            alert("No issues to submit!");
        }
    };

    const handleLogout = () => {
        navigate("/"); // Log out and navigate to the login page
    };

    // Fetch notifications from the Django backend
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/notifications/");
                const data = await response.json();
                if (data.notifications) {
                    setUser((prevUser) => ({
                        ...prevUser,
                        workedUponIssues: data.notifications
                    }));
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        if (showNotifications) {
            fetchNotifications();
        }
    }, [showNotifications]);

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
                            <p><strong>Registration Number:</strong> {user?.registrationNumber || "N/A"}</p>
                        </div>

                        {/* Program */}
                        <div className="section">
                            <h2>Course</h2>
                            <p>{user?.program || "No program available"}</p>
                        </div>

                        {/* Create Issue */}
                        <div className="section">
                            <h2>Create Issue</h2>
                            <div className="create-issue-form">
                                <select
                                    value={issueType}
                                    onChange={(e) => setIssueType(e.target.value)}
                                    className="issue-dropdown"
                                >
                                    <option value="Missing Marks">Missing Marks</option>
                                    <option value="Appeal">Appeal</option>
                                    <option value="Correction for Marks">Correction for Marks</option>
                                </select>
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

                            {/* Created Issues List */}
                            <div className="created-issues">
                                <h3>Created Issues</h3>
                                <ul>
                                    {user.createdIssues.length > 0 ? (
                                        user.createdIssues.map((issue, index) => (
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
                    // Notifications Panel
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
