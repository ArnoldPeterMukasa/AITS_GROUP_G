import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LecturerDashboard.css'; // Include CSS file for styling

function LecturerDashboard() {
    const [issues, setIssues] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [notifications] = useState(["New assignment posted!", "Course content updated"]);
    const [courseContent] = useState([
        { id: 1, title: "Lecture 1 - Introduction to Programming", dateUploaded: "2025-03-15" },
        { id: 2, title: "Lecture 2 - Data Structures", dateUploaded: "2025-03-18" }
    ]);
    const navigate = useNavigate();

    // Sample data (could come from an API)
    useEffect(() => {
        setIssues([
            { id: 1, title: "Issue with course materials", status: "open", department: "Computer Science", course: "Data Structures" },
            { id: 2, title: "Assignment not uploading", status: "resolved", department: "Computer Science", course: "Programming 101" }
        ]);
        setAssignments([
            { id: 1, title: "Assignment 1 - Introduction to Programming", dueDate: "2025-04-10" },
            { id: 2, title: "Assignment 2 - Data Structures", dueDate: "2025-04-15" }
        ]);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authToken"); // Clear token
        navigate("/login"); // Navigate to the login page
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h2>Lecturer Dashboard</h2>
                <ul>
                    <li><Link to="/LecturerDashboard">Home</Link></li>
                    <li><Link to="/ManageIssues">Manage Issues</Link></li>
                    <li><Link to="/ReportsPage">Reports</Link></li>
                    <li><Link to="/Assignments">Assignments</Link></li>
                    <li><Link to="/CourseContent">Course Content</Link></li>
                    <li><Link to="/Notifications">Notifications ({notifications.length})</Link></li>
                    <li><Link to="/Settings">Settings</Link></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
            </div>

            <div className="content">
                <h1>Welcome to the Lecturer Dashboard</h1>

                {/* Home Section */}
                <div className="overview">
                    <h3>Recent Activities</h3>
                    <div className="card">
                        <h4>New Issues</h4>
                        <p>{issues.filter(issue => issue.status === 'open').length} new issues</p>
                    </div>
                    <div className="card">
                        <h4>Upcoming Assignments</h4>
                        <p>{assignments.length} upcoming assignments</p>
                    </div>
                    <div className="card">
                        <h4>Course Content Updates</h4>
                        <p>{courseContent.length} new course materials uploaded</p>
                    </div>
                </div>

                {/* Manage Issues */}
                <div className="issues-list">
                    <h3>Issues</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Course</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issues.map(issue => (
                                <tr key={issue.id}>
                                    <td>{issue.title}</td>
                                    <td>{issue.status}</td>
                                    <td>{issue.course}</td>
                                    <td>
                                        {issue.status === "open" && (
                                            <>
                                                <button>Resolve</button>
                                                <button>Escalate</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Assignments Section */}
                <div className="assignments-list">
                    <h3>Assignments</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map(assignment => (
                                <tr key={assignment.id}>
                                    <td>{assignment.title}</td>
                                    <td>{assignment.dueDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Course Content Section */}
                <div className="course-content-list">
                    <h3>Course Content</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Date Uploaded</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseContent.map(content => (
                                <tr key={content.id}>
                                    <td>{content.title}</td>
                                    <td>{content.dateUploaded}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default LecturerDashboard;
