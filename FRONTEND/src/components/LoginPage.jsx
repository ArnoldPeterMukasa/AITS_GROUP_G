
import React from "react";
import { useState } from "react";


import { Link, useNavigate } from "react-router-dom";

import "./LoginPage.css";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate(); // Hook to navigate after successful login

    // Handle login form submission

    const handleSubmit = (event) => {
        event.preventDefault();

        // Basic validation
        if (!username || !password) {
            setError("Username and password are required.");
            return;
        }

        // Clear any previous error
        setError(null);

        // Handle the actual login logic here (e.g., API call)
        console.log("Form Submitted", { username, password, rememberMe });

        // For now, let's assume we get the role from the login process (could come from an API)
        const userRole = "registrar"; // Example hardcoded role for registrar

        // Redirect to the correct dashboard based on role
        if (userRole === 'Registrar') {
            navigate("/AcademicRegistrarDashboard");
        } else if (userRole === 'Student') {
            navigate("/StudentDashboard");
        } else if (userRole === 'Lecturer') {
            navigate("/LecturerDashboard");
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
                    <input type="text" id="username" value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required  />
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
