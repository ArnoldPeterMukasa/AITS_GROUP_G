import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageIssues.css';

function ManageIssues() {
    const [complaints, setComplaints] = useState([]);
    const [assignedComplaints, setAssignedComplaints] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [filters, setFilters] = useState({ category: '', status: '' });
    const [search, setSearch] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const token = localStorage.getItem("authToken");

    const fetchIssues = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/RegistrarIssues/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.status === 'success') {
                const all = response.data.issues;
                setComplaints(all.filter(issue => issue.status !== 'assigned'));
                setAssignedComplaints(all.filter(issue => issue.status === 'assigned'));
            }
        } catch (error) {
            console.error("Error fetching issues:", error);
        }
    };

    useEffect(() => {
        fetchIssues();
        fetchLecturers();
    }, []);

    const fetchLecturers = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/users/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const lecturersOnly = res.data.filter(user => user.user_type === 'lecturer');
            setLecturers(lecturersOnly);
        } catch (error) {
            console.error("Error fetching lecturers:", error);
        }
    };

    const handleSearchChange = (e) => setSearch(e.target.value);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleAssignComplaint = async (issueId, lecturerUsername) => {
        try {
            const response = await axios.patch(
                `http://127.0.0.1:8000/api/issues/${issueId}/assign/`,
                { lecturer_username: lecturerUsername },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setSuccessMessage("Issue assigned successfully!");
                setTimeout(() => setSuccessMessage(''), 3000);
                fetchIssues();
            }
        } catch (error) {
            console.error("Error assigning complaint:", error);
            alert("Failed to assign issue. Please try again.");
        }
    };

    const filteredComplaints = complaints.filter(issue =>
        (filters.category === '' || issue.category === filters.category) &&
        (filters.status === '' || issue.status === filters.status) &&
        (issue.reported_by?.username.toLowerCase().includes(search.toLowerCase()) ||
         issue.title.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="manage-issues-container">
            <h1>Manage Issues</h1>

            {successMessage && <div className="success-popup">{successMessage}</div>}

            <div className="controls">
                <input type="text" placeholder="Search by Student or Title" value={search} onChange={handleSearchChange} />
                <select name="category" onChange={handleFilterChange} value={filters.category}>
                    <option value="">All Categories</option>
                    <option value="missing_marks">Missing Marks</option>
                    <option value="appeal">Appeal</option>
                    <option value="correction">Correction</option>
                </select>
                <select name="status" onChange={handleFilterChange} value={filters.status}>
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="assigned">Assigned</option>
                </select>
            </div>

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
                            <th>Assign To</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredComplaints.map(issue => (
                            <tr key={issue.id}>
                                <td>{issue.reported_by?.username}</td>
                                <td>{issue.category}</td>
                                <td>{issue.title}</td>
                                <td>{issue.status}</td>
                                <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                                <td>
                                    <select
                                        defaultValue=""
                                        onChange={(e) => handleAssignComplaint(issue.id, e.target.value)}
                                    >
                                        <option value="" disabled>Select Lecturer</option>
                                        {lecturers.map(l => (
                                            <option key={l.id} value={l.username}>
                                                {l.first_name} {l.last_name} ({l.username})
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="assigned-complaints">
                <h3>Assigned Complaints</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Category</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Lecturer</th>
                            <th>Date Received</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignedComplaints.map(issue => (
                            <tr key={issue.id}>
                                <td>{issue.reported_by?.username}</td>
                                <td>{issue.category}</td>
                                <td>{issue.title}</td>
                                <td>{issue.status}</td>
                                <td>{issue.assigned_to?.username || 'N/A'}</td>
                                <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManageIssues;
