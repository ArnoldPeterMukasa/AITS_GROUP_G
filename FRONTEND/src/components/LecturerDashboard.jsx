import React, { useState } from "react";
import "./LecturerDashboard.css";

function LecturerDashboard() {
    // Hardcoded issues for demonstration
    const [issues, setIssues] = useState([
        { id: 1, title: "Issue 1", description: "Description of issue 1" },
        { id: 2, title: "Issue 2", description: "Description of issue 2" },
        { id: 3, title: "Issue 3", description: "Description of issue 3" },
    ]);

    const [selectedIssue, setSelectedIssue] = useState(null);
    const [response, setResponse] = useState("");

    const handleIssueClick = (issue) => {
        setSelectedIssue(issue);
    };

    const handleResponseChange = (event) => {
        setResponse(event.target.value);
    };

    const handleSendResponse = () => {
        // Update the issue with the response locally
        const updatedIssues = issues.map((issue) =>
            issue.id === selectedIssue.id
                ? { ...issue, response }
                : issue
        );
        setIssues(updatedIssues);
        setSelectedIssue(null);
        setResponse("");
        alert("Response sent successfully!");
    };

    return (
        <div className="dashboard-container">
            <h1>Lecturer Dashboard</h1>
            <div className="issues-list">
                <h2>Student Issues</h2>
                <ul>
                    {issues.map((issue) => (
                        <li key={issue.id} onClick={() => handleIssueClick(issue)}>
                            {issue.title}
                        </li>
                    ))}
                </ul>
            </div>
            {selectedIssue && (
                <div className="issue-details">
                    <h2>Issue Details</h2>
                    <p><strong>Title:</strong> {selectedIssue.title}</p>
                    <p><strong>Description:</strong> {selectedIssue.description}</p>
                    <textarea
                        value={response}
                        onChange={handleResponseChange}
                        placeholder="Enter your response"
                    />
                    <button onClick={handleSendResponse}>Send Response</button>
                </div>
            )}
        </div>
    );
}

export default LecturerDashboard;