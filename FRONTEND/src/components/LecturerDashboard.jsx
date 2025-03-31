import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./LecturerDashboard.css";

function LecturerDashboard() {
    const location = useLocation();
    const { user } = location.state || {};

    const [complaints, setComplaints] = useState([]);
    const [marks, setMarks] = useState([]);
    const [notifications, setNotifications] = useState([
        "New complaint from student in Data Structures.",
        "Reminder to grade student assignments in Mechanical Engineering.",
    ]);

    useEffect(() => {
        // Simulating fetching complaints data and marks assigned
        setComplaints([
            { id: 1, student: "John Doe", complaint: "Issue with course material", status: "open" },
            { id: 2, student: "Jane Smith", complaint: "Need extra class hours", status: "resolved" },
            { id: 3, student: "Alice Johnson", complaint: "Technical difficulties", status: "open" },
        ]);

        setMarks([
            { student: "John Doe", course: "Calculus 101", marks: 85 },
            { student: "Jane Smith", course: "Data Structures", marks: 92 },
        ]);
    }, []);

    const handleResolveComplaint = (complaintId) => {
        setComplaints((prevComplaints) =>
            prevComplaints.map((complaint) =>
                complaint.id === complaintId ? { ...complaint, status: "resolved" } : complaint
            )
        );
    };

    const handleAssignMarks = (studentName, course, marks) => {
        setMarks((prevMarks) => [
            ...prevMarks,
            { student: studentName, course, marks: parseInt(marks) },
        ]);
    };

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <nav className="dashboard-header">
                <h1>Lecturer Dashboard</h1>
                <div className="header-actions">
                    <button className="header-button">Inbox</button>
                    <button className="header-button">Notifications</button>
                </div>
            </nav>

            {/* Content Section */}
            <div className="content">
                <h1>Welcome, {user?.name || "Lecturer"}</h1>

                {/* Notifications Section */}
                <div className="section">
                    <h2>Notifications</h2>
                    <ul>
                        {notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                                <li key={index}>{notification}</li>
                            ))
                        ) : (
                            <p>No new notifications.</p>
                        )}
                    </ul>
                </div>

                {/* Complaints Section */}
                <div className="section">
                    <h2>Pending Complaints</h2>
                    <ul>
                        {complaints.length > 0 ? (
                            complaints.map((complaint, index) => (
                                <li key={index}>
                                    {complaint.student}: {complaint.complaint} ({complaint.status}){" "}
                                    {complaint.status === "open" && (
                                        <button onClick={() => handleResolveComplaint(complaint.id)}>
                                            Resolve
                                        </button>
                                    )}
                                </li>
                            ))
                        ) : (
                            <p>No complaints to resolve.</p>
                        )}
                    </ul>
                </div>

                {/* Assign Marks Section */}
                <div className="section">
                    <h2>Assign Marks</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAssignMarks(
                                e.target.studentName.value,
                                e.target.course.value,
                                e.target.marks.value
                            );
                        }}
                    >
                        <input type="text" name="studentName" placeholder="Student Name" required />
                        <input type="text" name="course" placeholder="Course" required />
                        <input type="number" name="marks" placeholder="Marks" required />
                        <button type="submit">Assign Marks</button>
                    </form>
                    <h3>Assigned Marks</h3>
                    <ul>
                        {marks.length > 0 ? (
                            marks.map((mark, index) => (
                                <li key={index}>
                                    {mark.student} - {mark.course}: {mark.marks} marks
                                </li>
                            ))
                        ) : (
                            <p>No marks assigned yet.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default LecturerDashboard;
