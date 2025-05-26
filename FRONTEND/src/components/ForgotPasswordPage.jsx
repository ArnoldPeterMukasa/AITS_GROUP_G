import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import "./ForgotPasswordPage.css";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        // Enhanced validation
        if (!email) {
            setError("Email is required");
            setIsLoading(false);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        try {
            // Simulate API call with timeout
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // In a real app, you would use:
            /*
            const response = await fetch("/api/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Failed to send reset code");
            }
            */

            setMessage("A 6-digit verification code has been sent to your email");
            setTimeout(() => navigate("/verify-code", { state: { email } }), 2000);
        } catch (err) {
            setError(err.message || "An error occurred while processing your request");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-wrapper">
            <div className="forgot-password-container">
                <button 
                    className="back-button"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                >
                    <FiArrowLeft size={20} />
                </button>
                
                <div className="form-header">
                    <div className="form-icon">
                        <FiMail size={32} />      
                    </div>
                    <h1>Forgot Password?</h1>
                    <p className="subtext">
                        Enter your email and we'll send you a code to reset your password
                    </p>
                </div>  

                <form onSubmit={handleSubmit} className="forgot-password-form">
                    <div className={`form-group ${error ? 'error' : ''}`}>
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                placeholder="Enter your registered email"
                                autoFocus
                            />
                            <FiMail className="input-icon" />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                    </div>

                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="spinner"></span>
                        ) : (
                            "Send Verification Code"
                        )}
                    </button>

                    {message && (
                        <div className="success-message">
                            <svg viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                            <span>{message}</span>
                        </div>
                    )}
                </form>

                <div className="additional-options">
                    <p>
                        Remember your password?{" "}
                        <button 
                            className="text-button"
                            onClick={() => navigate("/login")}
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>
            
            <div className="graphic-section">
                <div className="graphic-overlay"></div>
                <div className="graphic-content">
                    <h2>Academic Issue Tracker</h2>
                    <p>Your gateway to seamless academic support</p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;