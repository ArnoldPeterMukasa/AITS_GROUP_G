"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./LecturerDashboard.css" // Include CSS file for styling

function LecturerDashboard() {
  const [issues, setIssues] = useState([])
  const [notifications, setNotifications] = useState(["New assignment posted!", "Course content updated"])
  const [courseContent] = useState([
    { id: 1, title: "Lecture 1 - Introduction to Programming", dateUploaded: "2025-03-15" },
    { id: 2, title: "Lecture 2 - Data Structures", dateUploaded: "2025-03-18" },
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [resolutionComment, setResolutionComment] = useState("")
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("resolved")
  const [showStatusDropdown, setShowStatusDropdown] = useState(null)
  const navigate = useNavigate()

  // Status options from the model
  const STATUS_CHOICES = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
  ]

  useEffect(() => {
<<<<<<< HEAD
    const fetchAssignedIssues = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
        console.log("TOKEN:", token); // Add this
        if (!token) {
          navigate("/login")
          return
        }

        const response = await fetch("http://127.0.0.1:8000/api/issues/assigned/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          setIssues(data || [])

          if (data && data.length > 0) {
            const newIssues = data.filter((issue) => issue.status === "assigned")
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

=======
>>>>>>> c9d1c12864e24106d0ac1dc857ccc0c0fd75f43c
    fetchAssignedIssues()
    const intervalId = setInterval(fetchAssignedIssues, 60000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (showStatusDropdown && !event.target.closest('.status-dropdown-container')) {
        setShowStatusDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showStatusDropdown])

  const fetchAssignedIssues = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("authToken")
      console.log("TOKEN:", token)
      if (!token) {
        navigate("/login")
        return
      }

      const response = await fetch("http://127.0.0.1:8000/api/issues/assigned/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("API Response Status:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log("API Response Data:", data)
        
        // Handle both response formats - array or object with issues property
        let issuesData = []
        if (data.issues) {
          issuesData = data.issues
        } else if (Array.isArray(data)) {
          issuesData = data
        } else if (typeof data === 'object' && data !== null) {
          console.log("Unexpected data format:", data)
          issuesData = data.data || []
        }
        
        console.log("Processed Issues:", issuesData)
        setIssues(issuesData)
        
        // Update notifications for new issues
        if (issuesData.length > 0) {
          const newIssues = issuesData.filter(issue => issue.status === "open")
          if (newIssues.length > 0) {
            setNotifications(prev => [`${newIssues.length} new issue(s) assigned to you`, ...prev])
          }
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
        console.error("Failed to fetch assigned issues:", errorData)
        setError(`Failed to load assigned issues: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Error fetching assigned issues:", error)
      setError(`An error occurred while loading your assigned issues: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/login")
  }

  const openResolveModal = (issue) => {
    setSelectedIssue(issue)
    setResolutionComment("")
    setSelectedStatus("resolved")
    setIsResolveModalOpen(true)
  }

  const closeResolveModal = () => {
    setIsResolveModalOpen(false)
    setSelectedIssue(null)
  }

  const handleResolveIssue = async () => {
    if (!selectedIssue || !selectedIssue.id) {
      alert("No issue selected")
      return
    }
    
    try {
      const token = localStorage.getItem("authToken")
      console.log("Updating issue:", selectedIssue.id, "with status:", selectedStatus)
      
      const response = await fetch(`http://127.0.0.1:8000/api/issues/resolve/${selectedIssue.id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: selectedStatus,
          resolution_comment: resolutionComment || `Status changed to ${selectedStatus} by lecturer`,
        }),
      })

      console.log("Update API Response Status:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log("Update API Response Data:", data)
        
        // Determine what data structure we're receiving
        const updatedIssue = data.issue || data
        
        // Update the state with the updated issue
        setIssues(issues.map(issue => 
          issue.id === selectedIssue.id ? updatedIssue : issue
        ))
        
        alert(`Issue status has been updated to ${selectedStatus} successfully!`)
        closeResolveModal()
        
        // Refresh the issues list to ensure data is up-to-date
        fetchAssignedIssues()
      } else {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
        alert(`Failed to update the issue: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Error updating issue:", error)
      alert(`An error occurred while updating the issue: ${error.message}`)
    }
  }

  const toggleStatusDropdown = (issueId) => {
    // This function now explicitly toggles the dropdown
    setShowStatusDropdown(currentValue => currentValue === issueId ? null : issueId)
  }

  const handleStatusChange = async (issueId, status) => {
    try {
      const token = localStorage.getItem("authToken")
      console.log("Updating issue status:", issueId, "to", status)
      
      const response = await fetch(`http://127.0.0.1:8000/api/issues/resolve/${issueId}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
          resolution_comment: `Status changed to ${status} by lecturer`,
        }),
      })

      console.log("Update Status API Response Status:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log("Update Status API Response Data:", data)
        
        // Update the state with the updated issue
        const updatedIssue = data.issue || data
        setIssues(issues.map(issue => 
          issue.id === issueId ? updatedIssue : issue
        ))
        
        alert(`Issue status has been updated to ${status} successfully!`)
        setShowStatusDropdown(null)
        
        // Refresh the issues list to ensure data is up-to-date
        fetchAssignedIssues()
      } else {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
        alert(`Failed to update the issue: ${errorData.message || response.statusText}`)
      }
    } catch (error) {
      console.error("Error updating issue status:", error)
      alert(`An error occurred while updating the issue: ${error.message}`)
    }
  }

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Lecturer Dashboard</h2>
        <ul>
          <li><Link to="/LecturerDashboard">Home</Link></li>
          <li><Link to="/ManageIssues">Manage Issues</Link></li>
          <li><Link to="/ReportsPage">Reports</Link></li>
          <li><Link to="/CourseContent">Course Content</Link></li>
          <li><Link to="/Notifications">Notifications ({notifications.length})</Link></li>
          <li><Link to="/Settings">Settings</Link></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>

      <div className="content">
        <h1>Welcome to the Lecturer Dashboard</h1>
        
        <div className="actions-bar">
          <button className="refresh-btn" onClick={fetchAssignedIssues}>
            Refresh Issues
          </button>
        </div>

        <div className="overview">
          <h3>Recent Activities</h3>
          <div className="card">
            <h4>Assigned Issues</h4>
            <p>{issues.filter(issue => issue.status === "open" || issue.status === "in_progress").length} issues to handle</p>
          </div>
          <div className="card">
            <h4>Course Content Updates</h4>
            <p>{courseContent.length} course materials uploaded</p>
          </div>
        </div>

        <div className="issues-list">
          <h3>Assigned Issues</h3>
          {loading ? (
            <p>Loading issues...</p>
          ) : error ? (
            <div>
              <p className="error-message">{error}</p>
              <button className="retry-btn" onClick={fetchAssignedIssues}>Try Again</button>
            </div>
          ) : issues.length === 0 ? (
            <p>No issues assigned to you at this time.</p>
          ) : (
            <div className="table-responsive">
              <table className="issues-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Category</th>
                    <th>Student</th>
                    <th>Date Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr key={issue.id || `issue-${Math.random()}`}>
                      <td>{issue.id}</td>
                      <td className="title-cell">{issue.title}</td>
                      <td>
                        <span className={`status-badge status-${issue.status}`}>
                          {issue.status === "open" ? "Open" : 
                           issue.status === "in_progress" ? "In Progress" : 
                           issue.status === "resolved" ? "Resolved" : issue.status}
                        </span>
                      </td>
                      <td>{issue.category}</td>
                      <td>{issue.reported_by_name || issue.reported_by?.first_name || "N/A"}</td>
                      <td>{issue.created_at ? new Date(issue.created_at).toLocaleDateString() : "N/A"}</td>
                      <td>
                        {issue.status !== "resolved" && (
                          <div className="action-buttons">
                            <button 
                              className="detail-btn" 
                              onClick={() => openResolveModal(issue)}
                            >
                              Update Status
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="course-content-list">
          <h3>Course Content</h3>
          <div className="table-responsive">
            <table className="content-table">
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

      {/* Resolution Modal - For detailed resolutions with comments */}
      {isResolveModalOpen && selectedIssue && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Update Issue Status</h2>
            <p><strong>Title:</strong> {selectedIssue.title}</p>
            <p><strong>Description:</strong> {selectedIssue.description}</p>
            
            <div className="form-group">
              <label htmlFor="status-select">Status:</label>
              <select
                id="status-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="status-select"
              >
                {STATUS_CHOICES.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="resolution-comment">Resolution Comment:</label>
              <textarea
                id="resolution-comment"
                value={resolutionComment}
                onChange={(e) => setResolutionComment(e.target.value)}
                placeholder="Add notes about this status update..."
                rows={4}
                className="resolution-textarea"
              />
            </div>
            
            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeResolveModal}>
                Cancel
              </button>
              <button className="resolve-btn" onClick={handleResolveIssue}>
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LecturerDashboard;
