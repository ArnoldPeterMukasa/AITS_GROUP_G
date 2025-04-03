import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AcademicRegistrarDashboard.css'; // Include CSS file for styling

function AcademicRegistrarDashboard() {
    const [issues, setIssues] = useState([]);
    const [analytics, setAnalytics] = useState({
        avgResolutionTime: 0,
        unresolvedIssues: 0,
        totalIssues: 0,
        overdueIssuesCount: 0,
    });
    const [filters, setFilters] = useState({
        course: '',
        status: 'all',
    });
    const [notifications] = useState(["New issue reported!", "Lecturer request pending"]);
    const navigate = useNavigate();

    // Fetch data from the backend API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/RegistrarDashboard/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token if required
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setIssues(data.issues || []);
                    setAnalytics({
                        avgResolutionTime: data.avg_resolution_time,
                        unresolvedIssues: data.unresolved_issues,
                        totalIssues: data.total_issues,
                        overdueIssuesCount: data.overdue_issues_count,
                    });
                } else {
                    console.error('Failed to fetch data from the backend.');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const filteredIssues = issues.filter(issue => {
        const statusMatch = filters.status === 'all' || issue.status === filters.status;
        const courseMatch = !filters.course || issue.course === filters.course;
        return statusMatch && courseMatch;
    });

    const handleLogout = () => {
        localStorage.removeItem("authToken"); // Clear token
        navigate("/login"); // Navigate to the login page
    };

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
                            </tr>
                        </thead>
                        <tbody>
                            {filteredIssues.map(issue => (
                                <tr key={issue.id}>
                                    <td>{issue.title}</td>
                                    <td>{issue.status}</td>
                                    <td>{issue.category}</td>
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
