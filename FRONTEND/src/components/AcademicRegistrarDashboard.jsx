import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AcademicRegistrarDashboard.css'; // Include CSS file for styling

function AcademicRegistrarDashboard() {
    const [issues, setIssues] = useState([]);
    // Removed unused categories state
    const [analytics, setAnalytics] = useState({
        avgResolutionTime: 0,
        unresolvedIssues: 0,
        totalIssues: 0
    });
    const [filters, setFilters] = useState({
        department: '',
        course: '',
        status: 'all',
    });


    // Sample data (could come from an API)
    useEffect(() => {
        // Simulate fetching issues and analytics
        setIssues([
            { id: 1, title: "Issue with course materials", status: "open", category: "student", department: "Math", course: "Calculus 101" },
            { id: 2, title: "Lecturer request for more hours", status: "resolved", category: "lecturer", department: "Computer Science", course: "Data Structures" },
            { id: 3, title: "Urgent technical issue", status: "open", category: "student", department: "Engineering", course: "Mechanical Engineering" }
        ]);

        // Removed unused categories initialization

        setAnalytics({
            avgResolutionTime: 5,  // average resolution time in days
            unresolvedIssues: 2,
            totalIssues: 3
        });
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const filteredIssues = issues.filter(issue => {
        const statusMatch = filters.status === 'all' || issue.status === filters.status;
        const departmentMatch = !filters.department || issue.department === filters.department;
        const courseMatch = !filters.course || issue.course === filters.course;
        return statusMatch && departmentMatch && courseMatch;
    });

    const resolveIssue = (id) => {
        // Logic to resolve the issue (this would update the database/API in a real scenario)
        setIssues(prevIssues => prevIssues.map(issue => issue.id === id ? { ...issue, status: 'resolved' } : issue));
    };

    const escalateIssue = (id) => {
        // Logic to escalate an issue
        alert(`Issue ${id} escalated.`);
    };

    const reassignIssue = (id) => {
        // Logic to reassign an issue
        alert(`Issue ${id} reassigned.`);
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h2>Dashboard</h2>
                <ul>
                    <li><Link to="/AcademicRegistrarDashboard">Home</Link></li>
                    <li><Link to="/manage-users">Manage Users</Link></li>
                    <li><Link to="/reports">Reports</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                </ul>
            </div>

            <div className="content">
                <h1>Academic Registrar Dashboard</h1>
                
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
                        <p>{analytics.avgResolutionTime} days</p>
                    </div>
                </div>

                <div className="filters">
                    <h3>Filters</h3>
                    <form>
                        <select name="department" value={filters.department} onChange={handleFilterChange}>
                            <option value="">Select Department</option>
                            <option value="Math">Math</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Computer Science">Computer Science</option>
                        </select>

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
                        </select>
                    </form>
                </div>

                <div className="issues-list">
                    <h3>Issues</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredIssues.map(issue => (
                                <tr key={issue.id}>
                                    <td>{issue.title}</td>
                                    <td>{issue.status}</td>
                                    <td>{issue.category}</td>
                                    <td>
                                        <button onClick={() => resolveIssue(issue.id)}>Resolve</button>
                                        <button onClick={() => escalateIssue(issue.id)}>Escalate</button>
                                        <button onClick={() => reassignIssue(issue.id)}>Reassign</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AcademicRegistrarDashboard;
