import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Make sure this file is correctly linked

function Home() {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login");
    };

    const goToRegister = () => {
        navigate("/register");
    };

    const submitNewIssue = () => {
        // Logic for submitting a new issue (e.g., navigate to issue submission page)
        console.log("Submitting new issue...");
        navigate("/submit-issue");
    };

    return (
        <div className="home-container">
        <header className="header">
            <div className="logo">
            <h1>Academic Issue Tracker</h1>
            </div>
            <div className="cta">
            <button className="cta-button" onClick={submitNewIssue}>Submit a New Issue</button>
            </div>
        </header>

        <section className="intro">
            <h2>Welcome to the Academic Issue Tracking System</h2>
            <p>This platform allows students, lecturers, and academic registrars to efficiently manage and resolve academic issues.</p>
            <p>Please log in or register to get started.</p>
        </section>

        <section className="user-role-section">
            <div className="user-role-card">
            <h3>For Students</h3>
            <p>Submit and track your academic concerns.</p>
            <button className="role-button" onClick={goToLogin}>Track Your Issues</button>
            </div>
            <div className="user-role-card">
            <h3>For Lecturers</h3>
            <p>Manage student issues, provide feedback, and offer solutions.</p>
            <button className="role-button" onClick={goToLogin}>Manage Issues</button>
            </div>
            <div className="user-role-card">
            <h3>For Registrars</h3>
            <p>Oversee and resolve academic matters efficiently.</p>
            <button className="role-button" onClick={goToLogin}>Resolve Issues</button>
            </div>
        </section>

        <section className="announcements">
            <h2>System Announcements</h2>
            <div className="announcement">
            <p>We are currently updating the issue submission form. Stay tuned for improvements!</p>
            </div>
        </section>

        <footer className="footer">
            <div className="footer-buttons">
            <button className="footer-button" onClick={goToLogin}>Login</button>
            <button className="footer-button" onClick={goToRegister}>Register</button>
            </div>
        </footer>
        </div>
    );
}

export default Home;
