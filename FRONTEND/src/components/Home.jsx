import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 

function Home() {
    const navigate = useNavigate();

    // Navigation functions
    const goToLogin = () => {
        navigate("/login");
    };

    const goToRegister = () => {
        navigate("/register");
    };

    // Submit issue function with login check
    const submitNewIssue = () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn'); // Check if user is logged in

        if (isLoggedIn === 'true') {
            console.log("Submitting new issue...");
            navigate("/submit-issue"); // Navigate to the issue submission page
        } else {
            console.log("User not logged in. Redirecting to login...");
            navigate("/login"); // Redirect to login page if not logged in
        }
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

            {/* Updated Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-buttons">
                        <button className="footer-button" onClick={goToLogin}>Login</button>
                        <button className="footer-button" onClick={goToRegister}>Register</button>
                    </div>
                    <div className="footer-info">
                        <p>© {new Date().getFullYear()} Academic Issue Tracker. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
