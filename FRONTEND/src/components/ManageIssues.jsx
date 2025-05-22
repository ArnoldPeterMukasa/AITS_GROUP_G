import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageIssues.css';

function ManageIssues() {
    const [complaints, setComplaints] = useState([]);
    const [assignedComplaints, setAssignedComplaints] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        status: '',
    });
    const [search, setSearch] = useState('');

    // Fetch issues function (moved outside useEffect so it can be reused)
    const fetchIssues = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get("http://127.0.0.1:8000/api/RegistrarIssues/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data && response.data.status === 'success') {
                // Separate issues based on status
                const assigned = response.data.issues.filter(issue => issue.status === 'assigned');
                const unassigned = response.data.issues.filter(issue => issue.status !== 'assigned');
                
                setAssignedComplaints(assigned);
                setComplaints(unassigned);
            }
        } catch (error) {
            console.error("Error fetching issues:", error);
        }
    };

    // Fetch lecturers function
    const fetchLecturers = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get("http://127.0.0.1:8000/api/lecturers/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const lecturersOnly = response.data.filter(user => user.user_type === 'lecturer');
            setLecturers(lecturersOnly);
        } catch (error) {
            console.error("Error fetching lecturers:", error);
        }
    };

    // Initial data loading
    useEffect(() => {
        fetchIssues();
        fetchLecturers();
    }, []);

    // Filter and search
    const filteredComplaints = complaints.filter(issue => {
        return (
            (filters.category === '' || issue.category === filters.category) &&
            (filters.status === '' || issue.status === filters.status) &&
            (
                issue.reported_by?.username?.toLowerCase().includes(search.toLowerCase()) ||
                issue.title?.toLowerCase().includes(search.toLowerCase()) || 
                ''
            )
        );
    });

    // Filter assigned complaints
    const filteredAssignedComplaints = assignedComplaints.filter(issue => {
        return (
            (filters.category === '' || issue.category === filters.category) &&
            (
                issue.reported_by?.username?.toLowerCase().includes(search.toLowerCase()) ||
                issue.title?.toLowerCase().includes(search.toLowerCase()) || 
                ''
            )
        );
    });

    // Assign issue to lecturer
    const handleAssignComplaint = async (issueId, lecturerUsername) => {
        if (!lecturerUsername) return;

        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.patch(
                `http://127.0.0.1:8000/api/issues/${issueId}/assign/`,
                { lecturer_username: lecturerUsername },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                alert("✅ Issue assigned successfully!");
                // Refresh all data to ensure consistency
                fetchIssues();
            }
        } catch (error) {
            console.error("Error assigning complaint:", error);
            alert("❌ Failed to assign issue.");
        }
    };

    return (
        <div className="manage-issues-container">
            <h1>Manage Issues</h1>

            {/* Search and filter controls */}
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search by Student or Title"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select name="category" onChange={(e) => setFilters({ ...filters, category: e.target.value })} value={filters.category}>
                    <option value="">All Categories</option>
                    <option value="missing_marks">Missing Marks</option>
                    <option value="appeal">Appeal</option>
                    <option value="correction">Correction</option>
                </select>
                <select name="status" onChange={(e) => setFilters({ ...filters, status: e.target.value })} value={filters.status}>
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="assigned">Assigned</option>
                    <option value="open">Open</option>
                </select>
            </div>

            {/* Unassigned Complaints */}
            <div className="unassigned-complaints">
                <h3>Unresolved Complaints</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Category</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Date Received</th>
                            <th>Assign to Lecturer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredComplaints.length > 0 ? (
                            filteredComplaints.map(issue => (
                                <tr key={issue.id}>
                                    <td>{issue.reported_by?.username || 'Unknown'}</td>
                                    <td>{issue.category || 'Uncategorized'}</td>
                                    <td>{issue.title || 'No Title'}</td>
                                    <td>{issue.status || 'Unknown'}</td>
                                    <td>
                                        {issue.created_at
                                            ? new Date(issue.created_at).toLocaleDateString()
                                            : "Not Available"}
                                    </td>
                                    <td>
                                        <select
                                            onChange={(e) => handleAssignComplaint(issue.id, e.target.value)}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select Lecturer</option>
                                            {lecturers.map(lect => (
                                                <option key={lect.id} value={lect.username}>
                                                    {lect.first_name} {lect.last_name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-data">No unresolved complaints found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Assigned Complaints */}
            <div className="assigned-complaints">
                <h3>Assigned Complaints</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Category</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Date Received</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAssignedComplaints.length > 0 ? (
                            filteredAssignedComplaints.map(issue => (
                                <tr key={issue.id}>
                                    <td>{issue.reported_by?.username || 'Unknown'}</td>
                                    <td>{issue.category || 'Uncategorized'}</td>
                                    <td>{issue.title || 'No Title'}</td>
                                    <td>{issue.status || 'Unknown'}</td>
                                    <td>
                                        {issue.created_at
                                            ? new Date(issue.created_at).toLocaleDateString()
                                            : "Not Available"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="no-data">No assigned complaints found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManageIssues;