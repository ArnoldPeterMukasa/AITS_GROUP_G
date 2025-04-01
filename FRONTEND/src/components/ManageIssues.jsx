import React, { useState, useEffect } from 'react';
import './ManageIssues.css'; // Import the CSS file for styling

function ManageIssues() {
    const [complaints, setComplaints] = useState([]);
    const [assignedComplaints, setAssignedComplaints] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        status: '',
    });
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Sample complaints data, this could come from an API or database
        setComplaints([
            { id: 1, student: 'John Doe', category: 'Missing Marks', complaint: 'Missing marks for Assignment 1', status: 'Pending', dateReceived: '2025-03-25' },
            { id: 2, student: 'Jane Smith', category: 'Wrong Marks', complaint: 'Wrong marks given for Assignment 2', status: 'Resolved', dateReceived: '2025-03-26' },
            { id: 3, student: 'Mike Johnson', category: 'Remarking', complaint: 'Request for remarking of Assignment 3', status: 'Pending', dateReceived: '2025-03-28' },
            { id: 4, student: 'Emily Davis', category: 'No Marks', complaint: 'No marks assigned for Assignment 4', status: 'Pending', dateReceived: '2025-03-29' },
        ]);
    }, []);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleAssignComplaint = (id) => {
        const complaintToAssign = complaints.find(issue => issue.id === id);
        setAssignedComplaints([...assignedComplaints, { ...complaintToAssign, status: 'Assigned to Registrar' }]);
        setComplaints(complaints.filter(issue => issue.id !== id)); // Remove from unassigned list
    };

    const filteredComplaints = complaints.filter(issue => {
        return (
            (filters.category === '' || issue.category === filters.category) &&
            (filters.status === '' || issue.status === filters.status) &&
            (issue.student.toLowerCase().includes(search.toLowerCase()) || issue.complaint.toLowerCase().includes(search.toLowerCase()))
        );
    });

    return (
        <div className="manage-issues-container">
            <h1>Manage Issues</h1>
            
            {/* Search and Filter Controls */}
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search by Student Name or Complaint"
                    value={search}
                    onChange={handleSearchChange}
                />
                <select name="category" onChange={handleFilterChange} value={filters.category}>
                    <option value="">All Categories</option>
                    <option value="Missing Marks">Missing Marks</option>
                    <option value="Wrong Marks">Wrong Marks</option>
                    <option value="Remarking">Remarking</option>
                    <option value="No Marks">No Marks</option>
                </select>
                <select name="status" onChange={handleFilterChange} value={filters.status}>
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Assigned to Registrar">Assigned to Registrar</option>
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
                            <th>Complaint</th>
                            <th>Status</th>
                            <th>Date Received</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredComplaints.map(issue => (
                            <tr key={issue.id}>
                                <td>{issue.student}</td>
                                <td>{issue.category}</td>
                                <td>{issue.complaint}</td>
                                <td>{issue.status}</td>
                                <td>{issue.dateReceived}</td>
                                <td>
                                    <button onClick={() => handleAssignComplaint(issue.id)}>Assign to Registrar</button>
                                </td>
                            </tr>
                        ))}
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
                            <th>Complaint</th>
                            <th>Status</th>
                            <th>Date Received</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignedComplaints.map(issue => (
                            <tr key={issue.id}>
                                <td>{issue.student}</td>
                                <td>{issue.category}</td>
                                <td>{issue.complaint}</td>
                                <td>{issue.status}</td>
                                <td>{issue.dateReceived}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManageIssues;
