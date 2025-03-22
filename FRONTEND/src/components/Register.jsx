import React from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

function RegisterPage() {
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle registration logic here
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <p>Already have an account? <a href="">Login</a></p>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input type="text" id="firstName" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input type="text" id="lastName" required />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" required />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input type="password" id="confirmPassword" required />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select id="role" required>
                        <option value="">Select Role</option>
                        <option value="student">Student</option>
                        <option value="lecturer">Lecturer</option>
                        <option value="registrar">Registrar</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="registrationNumber">Student/Registration Number:</label>
                    <input type="text" id="registrationNumber" required />
                </div>
                <div className="form-group">
                    <label htmlFor="college">College:</label>
                    <input type="text" id="college" required />
                </div>
                <div className="form-group">
                    <label htmlFor="course">Course:</label>
                    <input type="text" id="course" required />
                </div>
                <button type="submit">Register</button>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    );
}

export default RegisterPage;
