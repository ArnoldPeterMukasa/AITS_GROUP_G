import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'animate.css/animate.min.css'; // ✅ corrected import (no trailing slash)
import './AcademicRegistrarDashboard.css';
import API from '../config.js'; // Import your axios configuration

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
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const navigate = useNavigate();

    // ✅ Fetch registrar dashboard data using axios
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Use your configured axios instance
                const response = await API.get('/api/RegistrarDashboard/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = response.data;
                setIssues(data.issues || []);
                setAnalytics({
                    avgResolutionTime: data.avg_resolution_time || 0,
                    unresolvedIssues: data.unresolved_issues || 0,
                    totalIssues: data.total_issues || 0,
                    overdueIssuesCount: data.overdue_issues_count || 0,
                });

            } catch (error) {
                console.error('Error fetching data:', error);
                
                if (error.response?.status === 401) {
                    // Handle unauthorized access
                    localStorage.removeItem("authToken");
                    sessionStorage.removeItem("authToken");
                    navigate("/login");
                } else {
                    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch dashboard data";
                    setError(errorMessage);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        navigate("/login");
    };

    const handleRetry = () => {
        // Trigger a re-fetch by updating a dependency
        window.location.reload();
    };

    const filteredIssues = issues.filter(issue => {
        const statusMatch = filters.status === 'all' || issue.status === filters.status;
        const courseMatch = !filters.course || issue.course === filters.course;
        return statusMatch && courseMatch;      
    });

    // Get unique courses from issues for the dropdown
    const uniqueCourses = [...new Set(issues.map(issue => issue.course).filter(Boolean))];

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h2>Dashboard</h2>
                <ul>
                    <li><Link to="/AcademicRegistrarDashboard">Home</Link></li>
                    <li><Link to="/manageUsersPage">Manage Users</Link></li>
                    <li><Link to="/ManageIssues">Manage Issues</Link></li>
                    {/* <li><Link to="/Notifications">Notifications ({notifications.length})</Link></li> */}
                    <li><Link to="/Settings">Settings</Link></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
            </div>

            <div className="content">
                <h1 className="animate__animated animate__fadeInDown">Academic Registrar Dashboard</h1>

                {loading ? (
                    <div className="loading-container">
                        <p>Loading dashboard data...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p className="error-message">Error: {error}</p>
                        <button onClick={handleRetry} className="retry-btn">Try Again</button>
                    </div>
                ) : (
                    <>
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
                            <div className="card">
                                <h3>Overdue Issues</h3>
                                <p>{analytics.overdueIssuesCount}</p>
                            </div>
                        </div>

                        <div className="filters">
                            <h3>Filters</h3>
                            <form>
                                <select name="course" value={filters.course} onChange={handleFilterChange}>
                                    <option value="">All Courses</option>
                                    {uniqueCourses.map(course => (
                                        <option key={course} value={course}>{course}</option>
                                    ))}
                                    {/* Fallback static options if no courses are loaded */}
                                    {uniqueCourses.length === 0 && (
                                        <>
                                            <option value="Calculus 101">Calculus 101</option>
                                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                                            <option value="Data Structures">Data Structures</option>
                                        </>
                                    )}
                                </select>

                                <select name="status" value={filters.status} onChange={handleFilterChange}>
                                    <option value="all">All Statuses</option>
                                    <option value="open">Open</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="pending">Pending</option>
                                    <option value="assigned">Assigned</option>
                                    <option value="in_progress">In Progress</option>
                                </select>
                            </form>
                        </div>

                        <div className="issues-list">
                            <h3>Issues ({filteredIssues.length})</h3>
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Title</th>
                                            <th>Status</th>
                                            <th>Category</th>
                                            <th>Course</th>
                                            <th>Created Date</th>
                                            <th>Priority</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredIssues.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                                    {filters.status !== 'all' || filters.course ? 
                                                        'No issues match the selected filters' : 
                                                        'No issues found'
                                                    }
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredIssues.map(issue => (
                                                <tr key={issue.id || `issue-${Math.random()}`}>
                                                    <td>{issue.id}</td>
                                                    <td className="title-cell">{issue.title}</td>
                                                    <td>
                                                        <span className={`status-badge status-${issue.status}`}>
                                                            {issue.status}
                                                        </span>
                                                    </td>
                                                    <td>{issue.category}</td>
                                                    <td>{issue.course || 'N/A'}</td>
                                                    <td>{issue.created_at ? new Date(issue.created_at).toLocaleDateString() : 'N/A'}</td>
                                                    <td>
                                                        <span className={`priority-badge priority-${issue.priority?.toLowerCase()}`}>
                                                            {issue.priority || 'Normal'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AcademicRegistrarDashboard;