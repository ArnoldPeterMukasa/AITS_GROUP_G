
import { useState, useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./LecturerDashboard.css"
import API from "../config.js";
import { NotificationContext } from "../contexts/NotificationContext";
import CustomNotification from "../components/CustomNotification";

function LecturerDashboard() {
  const { showNotification } = useContext(NotificationContext);
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

  const STATUS_CHOICES = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
  ]
 
  const fetchAssignedIssues = async () => {
  setLoading(true);
  setError(null);
  try {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      showNotification("Session expired! Please log in again", "error");
      navigate("/login");
      return;
    }

    const response = await API.get("/api/issues/assigned/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data;
    const issuesData = Array.isArray(data) ? data : data.issues || data.data || [];
    setIssues(issuesData);

    const newIssues = issuesData.filter(issue => issue.status === "open");
    if (newIssues.length > 0) {
      showNotification(`${newIssues.length} new issue(s) assigned to you`, "info");
      setNotifications(prev => [`${newIssues.length} new issue(s) assigned to you`, ...prev]);
    }

  } catch (error) {
    console.error('Fetch error:', error);
    
    if (error.response?.status === 401) {
      showNotification("Session expired! Please log in again", "error");
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      navigate("/login");
    } else {
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      showNotification(`Failed to load issues: ${errorMessage}`, "error");
      setError(`Failed to load assigned issues: ${errorMessage}`);
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchAssignedIssues()
    const intervalId = setInterval(fetchAssignedIssues, 60000)
    return () => clearInterval(intervalId)
  }, [navigate])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showStatusDropdown && !event.target.closest('.status-dropdown-container')) {
        setShowStatusDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showStatusDropdown])

  const handleLogout = () => {
    showNotification("Logging out...", "info");
    setTimeout(() => {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      showNotification("You have been logged out!", "success");
      setTimeout(() => navigate("/login"), 2000);
    }, 1000);
    localStorage.removeItem("authToken")
    sessionStorage.removeItem("authToken") // Also clear sessionStorage
    navigate("/login")
  }
  const openResolveModal = (issue) => {
    setSelectedIssue(issue)
    setResolutionComment("")
    setSelectedStatus(issue.status || "resolved") // Set current status as default
    setIsResolveModalOpen(true)
  }

  const closeResolveModal = () => {
    setIsResolveModalOpen(false)
    setSelectedIssue(null)
    setResolutionComment("")
  }

const handleResolveIssue = async () => {
  if (!selectedIssue?.id) {
    showNotification("No issue selected", "error");
    return;
  }

  try {
    showNotification("Updating issue status...", "info");
    
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) {
      showNotification("Session expired! Please log in again", "error");
      navigate("/login");
      return;
    }

    const response = await API.patch(`/api/issues/resolve/${selectedIssue.id}/`, {
      status: selectedStatus,
      resolution_comment: resolutionComment || `Status changed to ${selectedStatus} by lecturer`,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data;
    const updatedIssue = data.issue || data;

    setIssues(prevIssues =>
      prevIssues.map(issue => (issue.id === selectedIssue.id ? updatedIssue : issue))
    );

    showNotification(`Issue status updated to ${selectedStatus} successfully!`, "success");
    closeResolveModal();
    await fetchAssignedIssues();

  } catch (error) {
    console.error('Update error:', error);
    
    if (error.response?.status === 401) {
      showNotification("Session expired! Please log in again", "error");
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      navigate("/login");
    } else {
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      showNotification(`Failed to update issue: ${errorMessage}`, "error");
    }
  }
};

  return (
<div className="dashboard-container">
    <CustomNotification />
      <div className="sidebar">
        <h2>Lecturer Dashboard</h2>
        <ul>
          <li><Link to="/LecturerDashboard">Home</Link></li>
          {/* <li><Link to="/ManageIssues">Manage Issues</Link></li> */}
          <li><Link to="/ReportsPage">Reports</Link></li>
          <li><Link to="/CourseContent">Course Content</Link></li>
          <li><Link to="/Settings">Settings</Link></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </div>

      <div className="content">
        <h1>Welcome to the Lecturer Dashboard</h1>

        <div className="actions-bar">
          <button className="refresh-btn" onClick={fetchAssignedIssues} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Issues'}
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
                          {STATUS_CHOICES.find(s => s.value === issue.status)?.label || issue.status}
                        </span>
                      </td>
                      <td>{issue.category}</td>
                      <td>{issue.reported_by_name || issue.reported_by?.first_name || "N/A"}</td>
                      <td>{issue.created_at ? new Date(issue.created_at).toLocaleDateString() : "N/A"}</td>
                      <td>
                        {issue.status !== "resolved" && (
                          <div className="action-buttons">
                            <button className="detail-btn" onClick={() => openResolveModal(issue)}>
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

      {isResolveModalOpen && selectedIssue && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
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
              <button className="cancel-btn" onClick={closeResolveModal}>Cancel</button>
              <button className="resolve-btn" onClick={handleResolveIssue}>Update Status</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LecturerDashboard;