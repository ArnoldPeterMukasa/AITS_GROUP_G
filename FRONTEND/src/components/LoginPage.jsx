import React from "react";
import "./LoginPage.css";
import { Link } from "react-router-dom";
function LoginPage() {
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle login logic here
    };

    return (
        <div className="login-container">
            <h2>AITS</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" required />
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" required />
                </div>
                
                </div>
                <button type="submit">Login</button>
                <p>Don't have an account? <Link to="/register">Signup</Link></p>
            </form>
        </div>
        );
        }
        
        export default LoginPage;


