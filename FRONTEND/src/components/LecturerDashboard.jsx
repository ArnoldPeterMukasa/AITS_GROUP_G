import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./LecturerDashboard.css";

function LecturerDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
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
      { id: 2, student: "Jane Smith", complaint: "Need extra class hours", status: "open" },
      { id: 3, student: "Alice Johnson", complaint: "Technical difficulties", status: "open" },
    ]);

    setMarks([
      { student: "John Doe", course: "Calculus 101", marks: 85 },
      { student: "Jane Smith", course: "Data Structures", marks: 92 },
    ]);
  }, []);

  const handleResolveComplaint = (complaintId) => {
    setComplaints((prevComplaints) =>
      prevComplaints.filter((complaint) => complaint.id !== complaintId) // Remove the resolved complaint
    );
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      `Complaint by student ${complaintId} has been resolved.`,
    ]);
  };

  const handleAssignMarks = (studentName, course, marks) => {
    setMarks((prevMarks) => [
      ...prevMarks,
      { student: studentName, course, marks: parseInt(marks) },
    ]);
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      `Marks assigned to ${studentName} in ${course}.`,
    ]);
  };

  const handleLogout = () => {
    navigate("/login"); // Navigate to the login page when logged out
  };

  return (
    <div className="dashboard-container">
      {/* Navbar Section */}
      <nav className="navbar">
        <h2 className="navbar-title">Lecturer Dashboard</h2>
        <ul className="navbar-links">
          <li><button onClick={() => navigate("/home")}>Home</button></li>
          <li><button onClick={() => navigate("/manage-issues")}>Manage Issues</button></li>
          <li><button onClick={() => navigate("/reports")}>Reports</button></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
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
