"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./LecturerDashboard.css" // Include CSS file for styling

function LecturerDashboard() {
  const [issues, setIssues] = useState([])
  const [assignments, setAssignments] = useState([])
  const [notifications, setNotifications] = useState(["New assignment posted!", "Course content updated"])
  const [courseContent] = useState([
    { id: 1, title: "Lecture 1 - Introduction to Programming", dateUploaded: "2025-03-15" },
    { id: 2, title: "Lecture 2 - Data Structures", dateUploaded: "2025-03-18" },
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Fetch assigned issues from the backend
  useEffect(() => {
    const fetchAssignedIssues = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("authToken")
        if (!token) {
          navigate("/login")
          return
        }

        const response = await fetch("http://127.0.0.1:8000/api/lecturer/assigned-issues/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          setIssues(data.issues || [])

          // If there are new assignments, add a notification
          if (data.issues && data.issues.length > 0) {
            const newIssues = data.issues.filter((issue) => issue.status === "assigned")
            if (newIssues.length > 0) {
              setNotifications((prev) => [`${newIssues.length} new issue(s) assigned to you`, ...prev])
            }
          }
        } else {
          console.error("Failed to fetch assigned issues")
          setError("Failed to load assigned issues. Please try again later.")
        }
      } catch (error) {
        console.error("Error fetching assigned issues:", error)
        setError("An error occurred while loading your assigned issues.")
      } finally {
        setLoading(false)
      }
    }

    fetchAssignedIssues()

    // Set up polling to check for new assignments every minute
    const intervalId = setInterval(fetchAssignedIssues, 60000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [navigate])

  // Fetch assignments data
  useEffect(() => {
    // For now, using sample data
    setAssignments([
      { id: 1, title: "Assignment 1 - Introduction to Programming", dueDate: "2025-04-10" },
      { id: 2, title: "Assignment 2 - Data Structures", dueDate: "2025-04-15" },
    ])
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("authToken") // Clear token
    navigate("/login") // Navigate to the login page
  }

  const handleResolveIssue = async (issueId) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("http://127.0.0.1:8000/api/issues/resolve/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issue_id: issueId,
          resolution_notes: "Issue resolved by lecturer",
        }),
      })

      if (response.ok) {
        // Update the local state to reflect the change
        setIssues(issues.map((issue) => (issue.id === issueId ? { ...issue, status: "resolved" } : issue)))
        alert("Issue has been resolved successfully!")
      } else {
        alert("Failed to resolve the issue. Please try again.")
      }
    } catch (error) {
      console.error("Error resolving issue:", error)
      alert("An error occurred while resolving the issue.")
    }
  }

  const handleEscalateIssue = async (issueId) => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("http://127.0.0.1:8000/api/issues/escalate/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issue_id: issueId,
          escalation_reason: "Needs registrar attention",
        }),
      })

      if (response.ok) {
        // Update the local state to reflect the change
        setIssues(issues.map((issue) => (issue.id === issueId ? { ...issue, status: "escalated" } : issue)))
        alert("Issue has been escalated to the registrar.")
      } else {
        alert("Failed to escalate the issue. Please try again.")
      }
    } catch (error) {
      console.error("Error escalating issue:", error)
      alert("An error occurred while escalating the issue.")
    }
  }

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Lecturer Dashboard</h2>
        <ul>
          <li>
            <Link to="/LecturerDashboard">Home</Link>
          </li>
          <li>
            <Link to="/ManageIssues">Manage Issues</Link>
          </li>
          <li>
            <Link to="/ReportsPage">Reports</Link>
          </li>
          <li>
            <Link to="/Assignments">Assignments</Link>
          </li>
          <li>
            <Link to="/CourseContent">Course Content</Link>
          </li>
          <li>
            <Link to="/Notifications">Notifications ({notifications.length})</Link>
          </li>
          <li>
            <Link to="/Settings">Settings</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>

      <div className="content">
        <h1>Welcome to the Lecturer Dashboard</h1>

        {/* Home Section */}
        <div className="overview">
          <h3>Recent Activities</h3>
          <div className="card">
            <h4>Assigned Issues</h4>
            <p>
              {issues.filter((issue) => issue.status === "assigned" || issue.status === "open").length} issues to handle
            </p>
          </div>
          <div className="card">
            <h4>Upcoming Assignments</h4>
            <p>{assignments.length} upcoming assignments</p>
          </div>
          <div className="card">
            <h4>Course Content Updates</h4>
            <p>{courseContent.length} course materials uploaded</p>
          </div>
        </div>

        {/* Manage Issues */}
        <div className="issues-list">
          <h3>Assigned Issues</h3>
          {loading ? (
            <p>Loading issues...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : issues.length === 0 ? (
            <p>No issues assigned to you at this time.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Course</th>
                  <th>Student</th>
                  <th>Date Assigned</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id}>
                    <td>{issue.title}</td>
                    <td>
                      <span className={`status-badge status-${issue.status}`}>{issue.status}</span>
                    </td>
                    <td>{issue.course}</td>
                    <td>{issue.student_name || "N/A"}</td>
                    <td>{issue.assigned_date || "N/A"}</td>
                    <td>
                      {(issue.status === "assigned" || issue.status === "open") && (
                        <div className="action-buttons">
                          <button className="resolve-btn" onClick={() => handleResolveIssue(issue.id)}>
                            Resolve
                          </button>
                          <button className="escalate-btn" onClick={() => handleEscalateIssue(issue.id)}>
                            Escalate
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
              {assignments.map((assignment) => (
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
              {courseContent.map((content) => (
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
  )
}

export default LecturerDashboard;
