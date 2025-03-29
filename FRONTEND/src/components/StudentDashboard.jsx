import React from "react";
import { useLocation } from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard() {
    const location = useLocation();
    const { user } = location.state || {};

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <nav className="dashboard-header">
                <h1>Student Dashboard</h1>
                <div className="header-actions">
                    <button className="header-button">Inbox</button>
                    <button className="header-button">Unread Messages</button>
                    <button className="header-button">Notifications</button>
                </div>
            </nav>

            {/* Content Section */}
            <div className="content">
                <h1>Welcome, {user?.name || "Student"}</h1>
                <div className="section">
                    <h2>Your Program</h2>
                    <p>{user?.program || "No program available"}</p>
                </div>
                <div className="section">
                    <h2>Pending Issues</h2>
                    <ul>
                        {user?.pendingIssues?.length > 0 ? (
                            user.pendingIssues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                            ))
                        ) : (
                            <p>No pending issues.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;