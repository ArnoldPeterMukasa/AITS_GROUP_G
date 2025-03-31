import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        // Basic validation
        if (!username || !password) {
            setError("Username and password are required.");
            return;
        }

        // Clear any previous error
        setError(null);

        // This is where you would normally call an API to get the user's data and role
        // For example, fetching from the backend:
        // const user = await api.login(username, password);

        // Here, assume that you get the user data, including the role
        const userRole = localStorage.getItem("role"); // Or fetched dynamically from backend

        // Check role and navigate to the respective dashboard
        if (userRole === 'student') {
            navigate("/StudentDashboard");
        } else if (userRole === 'lecturer') {
            navigate("/LecturerDashboard");
        } else if (userRole === 'registrar') {
            navigate("/AcademicRegistrarDashboard");
        } else {
            setError("Invalid role or credentials");
        }
    };

    return (
        <div className="login-container">
            <h2>Academic Issue Tracking System</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        placeholder="Must be at least 8 characters"
                    />
                    <small>Password must be at least 8 characters long.</small>
                </div>
                <div className="form-group remember-me">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                    />
                    <label htmlFor="rememberMe">Remember Me</label>
                </div>

                {error && <p className="error">{error}</p>}

                <button type="submit" className="submit-button">Login</button>

                <p className="forgot-password">
                    <Link to="/forgot-password">Forgot Password?</Link>
                </p>

                <p>
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </form>
        </div>
    );
}

export default LoginPage;
