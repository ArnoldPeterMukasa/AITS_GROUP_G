"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "animate.css/animate.min.css" // ✅ corrected import (no trailing slash)
import "./AcademicRegistrarDashboard.css"

function AcademicRegistrarDashboard() {
  const [issues, setIssues] = useState([])
  const [lecturers, setLecturers] = useState([])
  const [analytics, setAnalytics] = useState({
    avgResolutionTime: 0,
    unresolvedIssues: 0,
    totalIssues: 0,
    overdueIssuesCount: 0,
  })
  const [filters, setFilters] = useState({
    course: "",
    status: "all",
  })
  const [notifications] = useState(["New issue reported!", "Lecturer request pending"])
  const [assigningIssue, setAssigningIssue] = useState(null)
  const [lecturerName, setLecturerName] = useState("")
  const [lecturerEmail, setLecturerEmail] = useState("")
  const [isAssigning, setIsAssigning] = useState(false)
  const [assignmentSuccess, setAssignmentSuccess] = useState(false)
  const [assignmentError, setAssignmentError] = useState("")
  const navigate = useNavigate()

  // ✅ Fetch registrar dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const response = await fetch("http://127.0.0.1:8000/api/RegistrarDashboard/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          setIssues(data.issues || [])
          setAnalytics({
            avgResolutionTime: data.avg_resolution_time || 0,
            unresolvedIssues: data.unresolved_issues || 0,
            totalIssues: data.total_issues || 0,
            overdueIssuesCount: data.overdue_issues_count || 0,
          })
        } else {
          console.error("Failed to fetch data from the backend.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  // Fetch lecturers for assignment dropdown
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const response = await fetch("http://127.0.0.1:8000/api/lecturers/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          setLecturers(data.lecturers || [])
        } else {
          console.error("Failed to fetch lecturers from the backend.")
        }
      } catch (error) {
        console.error("Error fetching lecturers:", error)
      }
    }

    fetchLecturers()
  }, [])

  // Reset assignment success message after 3 seconds
  useEffect(() => {
    if (assignmentSuccess) {
      const timer = setTimeout(() => {
        setAssignmentSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [assignmentSuccess])

  // Reset assignment error message after 5 seconds
  useEffect(() => {
    if (assignmentError) {
      const timer = setTimeout(() => {
        setAssignmentError("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [assignmentError])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/login")
  }

  const handleAssignIssue = (issueId) => {
    // Find the issue to get its details
    const issueToAssign = issues.find((issue) => issue.id === issueId)
    setAssigningIssue(issueToAssign)
    setLecturerName("")
    setLecturerEmail("")
    setIsAssigning(true)
    // Clear any previous error messages
    setAssignmentError("")
  }

  const handleLecturerNameChange = (e) => {
    setLecturerName(e.target.value)
  }

  const handleLecturerEmailChange = (e) => {
    setLecturerEmail(e.target.value)
  }

  const submitAssignment = async () => {
    if (!lecturerName || !lecturerEmail || !assigningIssue) {
      setAssignmentError("Please enter both lecturer name and email")
      return
    }

    try {
      const token = localStorage.getItem("authToken")

      // Using the correct endpoint format: issues/<int:pk>/assign/
      const response = await fetch(`http://127.0.0.1:8000/api/issues/${assigningIssue.id}/assign/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lecturer_name: lecturerName,
          lecturer_email: lecturerEmail,
        }),
      })

      // For debugging - log the response
      console.log("Assignment response status:", response.status)

      if (response.ok) {
        // Get the response data if available
        let responseData
        try {
          responseData = await response.json()
          console.log("Assignment response data:", responseData)
        } catch (e) {
          console.log("No JSON response body")
        }

        // Update the local state to reflect the assignment
        const updatedIssues = issues.map((issue) => {
          if (issue.id === assigningIssue.id) {
            return {
              ...issue,
              status: "assigned",
              assigned_to: lecturerName,
              assigned_date: new Date().toISOString().split("T")[0], // Today's date
            }
          }
          return issue
        })

        setIssues(updatedIssues)
        setIsAssigning(false)
        setAssigningIssue(null)
        setLecturerName("")
        setLecturerEmail("")
        setAssignmentSuccess(true)
      } else {
        // Try to get error details from response
        let errorMessage = "Failed to assign issue. Please try again."
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || errorData.message || errorMessage
          console.error("Error details:", errorData)
        } catch (e) {
          console.error("Could not parse error response")
        }

        setAssignmentError(errorMessage)
        console.error("Failed to assign issue. Status:", response.status)
      }
    } catch (error) {
      console.error("Error assigning issue:", error)
      setAssignmentError("An error occurred while assigning the issue. Please check your connection.")
    }
  }

  const cancelAssignment = () => {
    setIsAssigning(false)
    setAssigningIssue(null)
    setLecturerName("")
    setLecturerEmail("")
    setAssignmentError("")
  }

  const filteredIssues = issues.filter((issue) => {
    const statusMatch = filters.status === "all" || issue.status === filters.status
    const courseMatch = !filters.course || issue.course === filters.course
    return statusMatch && courseMatch
  })

  // Mock data for lecturers if API is not available yet
  const mockLecturers = [
    { id: 1, name: "Dr. John Smith", email: "john.smith@university.edu" },
    { id: 2, name: "Prof. Jane Doe", email: "jane.doe@university.edu" },
    { id: 3, name: "Dr. Robert Johnson", email: "robert.johnson@university.edu" },
  ]

  // Use mock data if no lecturers are fetched
  const displayLecturers = lecturers.length > 0 ? lecturers : mockLecturers

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h2>Dashboard</h2>
                <ul>
                    <li><Link to="/AcademicRegistrarDashboard">Home</Link></li>
                    <li><Link to="/manageUsersPage">Manage Users</Link></li>
                    <li><Link to="/Notifications">Notifications ({notifications.length})</Link></li>
                    <li><Link to="/Settings">Settings</Link></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
            </div>

      <div className="content">
        <h1 className="animate__animated animate__fadeInDown">Academic Registrar Dashboard</h1>

        {assignmentSuccess && (
          <div className="success-message animate__animated animate__fadeIn">
            Issue successfully assigned to lecturer!
          </div>
        )}

        {assignmentError && <div className="error-message animate__animated animate__fadeIn">{assignmentError}</div>}

        <div className="overview">
          <div className="card">
            <h3>Total Issues</h3>
            <p>{analytics.totalIssues}</p>
          </div>
          <div className="card">
            <h3>Unresolved Issues</h3>
            <p>{analytics.unresolvedIssues}</p>
          </div>
          <div className="card">
            <h3>Avg. Resolution Time</h3>
            <p>{analytics.avgResolutionTime}</p>
          </div>
          <div className="card">
            <h3>Overdue Issues</h3>
            <p>{analytics.overdueIssuesCount}</p>
          </div>
        </div>

        <div className="filters">
          <h3>Filters</h3>
          <form>
            <select name="course" value={filters.course} onChange={handleFilterChange}>
              <option value="">Select Course</option>
              <option value="Calculus 101">Calculus 101</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Data Structures">Data Structures</option>
            </select>

            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
            </select>
          </form>
        </div>

        {isAssigning && (
          <div className="assignment-modal">
            <div className="assignment-content">
              <h3>Assign Issue to Lecturer</h3>
              {assigningIssue && (
                <div className="issue-details">
                  <p>
                    <strong>Issue:</strong> {assigningIssue.title}
                  </p>
                  <p>
                    <strong>Category:</strong> {assigningIssue.category}
                  </p>
                  <p>
                    <strong>Course:</strong> {assigningIssue.course}
                  </p>
                </div>
              )}
              <div className="form-group">
                <label htmlFor="lecturerName">Lecturer Name:</label>
                <input
                  type="text"
                  id="lecturerName"
                  value={lecturerName}
                  onChange={handleLecturerNameChange}
                  className="lecturer-input"
                  placeholder="Enter lecturer's full name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lecturerEmail">Lecturer Email:</label>
                <input
                  type="email"
                  id="lecturerEmail"
                  value={lecturerEmail}
                  onChange={handleLecturerEmailChange}
                  className="lecturer-input"
                  placeholder="Enter lecturer's email address"
                  required
                />
              </div>
              <div className="assignment-actions">
                <button onClick={submitAssignment} disabled={!lecturerName || !lecturerEmail}>
                  Assign
                </button>
                <button onClick={cancelAssignment} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="issues-list">
          <h3>Issues</h3>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Category</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No issues found
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => (
                  <tr key={issue.id}>
                    <td>{issue.title}</td>
                    <td>
                      <span className={`status-badge status-${issue.status}`}>{issue.status}</span>
                    </td>
                    <td>{issue.category}</td>
                    <td>{issue.assigned_to || "Not assigned"}</td>
                    <td>
                      <button
                        onClick={() => handleAssignIssue(issue.id)}
                        className="assign-btn"
                        disabled={issue.status === "resolved"}
                      >
                        {issue.assigned_to ? "Reassign" : "Assign"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AcademicRegistrarDashboard;
