import React from "react";
import { useState } from "react";
import "./LoginPage.css";
import { Link } from "react-router-dom";
function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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
                    <input type="text" id="username" value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required  />
                        </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required/>
                
                
                </div>
                <button type="submit">Login</button>
                <p>Don't have an account? <Link to="/register">Signup</Link></p>
            </form>
        </div>
        );
        }
        
        export default LoginPage;


