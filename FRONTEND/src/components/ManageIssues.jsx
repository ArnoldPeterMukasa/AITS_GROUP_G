import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageIssues.css';
import API from "../config.js";

function ManageIssues() {
    const [complaints, setComplaints] = useState([]);
    const [assignedComplaints, setAssignedComplaints] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        status: '',
    });
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [assigningIssues, setAssigningIssues] = useState(new Set());
    const navigate = useNavigate();

    // Fetch issues function (moved outside useEffect so it can be reused)    
    const fetchIssues = async () => {
        try {
            const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
            if (!token) {
                navigate("/login");
                return;
            }

            // Use your configured API instance
            const response = await API.get("/api/RegistrarIssues/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data && response.data.status === 'success') {
                // Separate issues based on status
                const assigned = response.data.issues.filter(issue => issue.status === 'assigned');
                const unassigned = response.data.issues.filter(issue => issue.status !== 'assigned');
                
                setAssignedComplaints(assigned);
                setComplaints(unassigned);
            } else {
                // Handle case where response doesn't have expected structure
                const issues = response.data.issues || response.data || [];
                const assigned = issues.filter(issue => issue.status === 'assigned');
                const unassigned = issues.filter(issue => issue.status !== 'assigned');
                
                setAssignedComplaints(assigned);
                setComplaints(unassigned);
            }
        } catch (error) {
            console.error("Error fetching issues:", error);
            
            if (error.response?.status === 401) {
                localStorage.removeItem("authToken");
                sessionStorage.removeItem("authToken");
                navigate("/login");
            } else {
                const errorMessage = error.response?.data?.message || error.message || "Failed to fetch issues";
                setError(errorMessage);
            }
        }
    };

    // Fetch lecturers function
    const fetchLecturers = async () => {
        try {
            const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
            if (!token) {
                navigate("/login");
                return;
            }

            // Use your configured API instance
            const response = await API.get("/api/lecturers/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const lecturersData = response.data;
            const lecturersOnly = Array.isArray(lecturersData) 
                ? lecturersData.filter(user => user.user_type === 'lecturer')
                : [];
            
            setLecturers(lecturersOnly);
        } catch (error) {
            console.error("Error fetching lecturers:", error);
            
            if (error.response?.status === 401) {
                localStorage.removeItem("authToken");
                sessionStorage.removeItem("authToken");
                navigate("/login");
            } else {
                const errorMessage = error.response?.data?.message || error.message || "Failed to fetch lecturers";
                console.warn("Lecturers fetch error:", errorMessage);
                // Don't set main error state for lecturers failure, just log it
            }
        }
    };

    // Initial data loading
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                await Promise.all([fetchIssues(), fetchLecturers()]);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [navigate]);

    // Filter and search
    const filteredComplaints = complaints.filter(issue => {
        const categoryMatch = filters.category === '' || issue.category === filters.category;
        const statusMatch = filters.status === '' || issue.status === filters.status;
        const searchMatch = search === '' || 
            issue.reported_by?.username?.toLowerCase().includes(search.toLowerCase()) ||
            issue.title?.toLowerCase().includes(search.toLowerCase()) ||
            issue.reported_by?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
            issue.reported_by?.last_name?.toLowerCase().includes(search.toLowerCase());

        return categoryMatch && statusMatch && searchMatch;
    });

    // Filter assigned complaints
    const filteredAssignedComplaints = assignedComplaints.filter(issue => {
        const categoryMatch = filters.category === '' || issue.category === filters.category;
        const searchMatch = search === '' || 
            issue.reported_by?.username?.toLowerCase().includes(search.toLowerCase()) ||
            issue.title?.toLowerCase().includes(search.toLowerCase()) ||
            issue.reported_by?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
            issue.reported_by?.last_name?.toLowerCase().includes(search.toLowerCase());

        return categoryMatch && searchMatch;
    });

    // Assign issue to lecturer
    const handleAssignComplaint = async (issueId, lecturerUsername) => {
        if (!lecturerUsername) return;

        // Prevent multiple assignments of the same issue
        if (assigningIssues.has(issueId)) return;

        setAssigningIssues(prev => new Set([...prev, issueId]));

        try {
            const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
            if (!token) {
                navigate("/login");
                return;
            }

            // Use your configured API instance with proper URL
            const response = await API.patch(
                `/api/issues/${issueId}/assign/`,
                { lecturer_username: lecturerUsername },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                alert("✅ Issue assigned successfully!");
                // Refresh all data to ensure consistency
                await fetchIssues();
            }
        } catch (error) {
            console.error("Error assigning complaint:", error);
            
            if (error.response?.status === 401) {
                localStorage.removeItem("authToken");
                sessionStorage.removeItem("authToken");
                navigate("/login");
            } else {
                const errorMessage = error.response?.data?.message || error.message || "Failed to assign issue";
                alert(`❌ Failed to assign issue: ${errorMessage}`);
            }
        } finally {
            setAssigningIssues(prev => {
                const newSet = new Set(prev);
                newSet.delete(issueId);
                return newSet;
            });
        }
    };

    const handleRetry = () => {
        window.location.reload();
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return 'status-open';
            case 'pending': return 'status-pending';
            case 'assigned': return 'status-assigned';
            case 'resolved': return 'status-resolved';
            case 'in_progress': return 'status-in-progress';
            default: return 'status-default';
        }
    };

    if (loading) {
        return (
            <div className="manage-issues-container">
                <div className="loading-container">
                    <h2>Loading Issues...</h2>
                    <p>Please wait while we fetch the latest data.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="manage-issues-container">
                <div className="error-container">
                    <h2>Error Loading Issues</h2>
                    <p className="error-message">{error}</p>
                    <button onClick={handleRetry} className="retry-btn">Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="manage-issues-container">
            <h1>Manage Issues</h1>

            {/* Search and filter controls */}
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search by Student Name, Username, or Title"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select 
                    name="category" 
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })} 
                    value={filters.category}
                >
                    <option value="">All Categories</option>
                    <option value="missing_marks">Missing Marks</option>
                    <option value="appeal">Appeal</option>
                    <option value="correction">Correction</option>
                    <option value="technical">Technical</option>
                    <option value="administrative">Administrative</option>
                </select>
                <select 
                    name="status" 
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })} 
                    value={filters.status}
                >
                    <option value="">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>

            {/* Summary Cards */}
            <div className="summary-cards">
                <div className="summary-card">
                    <h3>Unresolved Issues</h3>
                    <p className="count">{complaints.length}</p>
                </div>
                <div className="summary-card">
                    <h3>Assigned Issues</h3>
                    <p className="count">{assignedComplaints.length}</p>
                </div>
                <div className="summary-card">
                    <h3>Available Lecturers</h3>
                    <p className="count">{lecturers.length}</p>
                </div>
            </div>

            {/* Unassigned Complaints */}
            <div className="unassigned-complaints">
                <h3>Unresolved Complaints ({filteredComplaints.length})</h3>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Student</th>
                                <th>Category</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Date Received</th>
                                <th>Priority</th>
                                <th>Assign to Lecturer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComplaints.length > 0 ? (
                                filteredComplaints.map(issue => (
                                    <tr key={issue.id}>
                                        <td>{issue.id}</td>
                                        <td>
                                            <div className="student-info">
                                                <div className="student-name">
                                                    {issue.reported_by?.first_name} {issue.reported_by?.last_name}
                                                </div>
                                                <div className="student-username">
                                                    @{issue.reported_by?.username || 'Unknown'}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`category-badge category-${issue.category}`}>
                                                {issue.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="title-cell">{issue.title || 'No Title'}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusBadgeClass(issue.status)}`}>
                                                {issue.status || 'Unknown'}
                                            </span>
                                        </td>
                                        <td>
                                            {issue.created_at
                                                ? new Date(issue.created_at).toLocaleDateString()
                                                : "Not Available"}
                                        </td>
                                        <td>
                                            <span className={`priority-badge priority-${issue.priority?.toLowerCase() || 'normal'}`}>
                                                {issue.priority || 'Normal'}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                onChange={(e) => handleAssignComplaint(issue.id, e.target.value)}
                                                defaultValue=""
                                                disabled={assigningIssues.has(issue.id)}
                                                className="lecturer-select"
                                            >
                                                <option value="" disabled>
                                                    {assigningIssues.has(issue.id) ? 'Assigning...' : 'Select Lecturer'}
                                                </option>
                                                {lecturers.map(lect => (
                                                    <option key={lect.id} value={lect.username}>
                                                        {lect.first_name} {lect.last_name} ({lect.username})
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="no-data">
                                        {search || filters.category || filters.status ? 
                                            "No complaints match the current filters" : 
                                            "No unresolved complaints found"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assigned Complaints */}
            <div className="assigned-complaints">
                <h3>Assigned Complaints ({filteredAssignedComplaints.length})</h3>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Student</th>
                                <th>Category</th>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Date Received</th>
                                <th>Assigned To</th>
                                <th>Priority</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssignedComplaints.length > 0 ? (
                                filteredAssignedComplaints.map(issue => (
                                    <tr key={issue.id}>
                                        <td>{issue.id}</td>
                                        <td>
                                            <div className="student-info">
                                                <div className="student-name">
                                                    {issue.reported_by?.first_name} {issue.reported_by?.last_name}
                                                </div>
                                                <div className="student-username">
                                                    @{issue.reported_by?.username || 'Unknown'}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`category-badge category-${issue.category}`}>
                                                {issue.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="title-cell">{issue.title || 'No Title'}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusBadgeClass(issue.status)}`}>
                                                {issue.status || 'Unknown'}
                                            </span>
                                        </td>
                                        <td>
                                            {issue.created_at
                                                ? new Date(issue.created_at).toLocaleDateString()
                                                : "Not Available"}
                                        </td>
                                        <td>
                                            <span className="assigned-lecturer">
                                                {issue.assigned_to?.first_name} {issue.assigned_to?.last_name} 
                                                {issue.assigned_to?.username && ` (@${issue.assigned_to.username})`}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`priority-badge priority-${issue.priority?.toLowerCase() || 'normal'}`}>
                                                {issue.priority || 'Normal'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="no-data">
                                        {search || filters.category ? 
                                            "No assigned complaints match the current filters" : 
                                            "No assigned complaints found"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ManageIssues;