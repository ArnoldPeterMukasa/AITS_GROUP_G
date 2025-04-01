import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiKey, FiEye, FiEyeOff, FiArrowLeft, FiCheck } from "react-icons/fi";
import "./ResetPasswordPage.css";

function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Get email and token from navigation state
    const { email, token } = location.state || {};

    useEffect(() => {
        if (!email || !token) {
            navigate("/forgot-password");
        }
    }, [email, token, navigate]);

    const validatePassword = (pass) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(pass);
        const hasLowerCase = /[a-z]/.test(pass);
        const hasNumber = /\d/.test(pass);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
        
        return {
            isValid: pass.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
            requirements: {
                minLength: pass.length >= minLength,
                hasUpperCase,
                hasLowerCase,
                hasNumber,
                hasSpecialChar
            }
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Validate passwords
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        const { isValid } = validatePassword(password);
        if (!isValid) {
            setError("Password does not meet requirements");
            setIsLoading(false);
            return;
        }

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // In a real app:
            /*
            const response = await fetch("/api/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, token, newPassword: password }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Failed to reset password");
            }
            */

            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.message || "An error occurred while resetting your password");
        } finally {
            setIsLoading(false);
        }
    };

    const passwordRequirements = validatePassword(password).requirements;

    if (success) {
        return (
            <div className="reset-success-wrapper">
                <div className="reset-success-container">
                    <div className="success-icon">
                        <FiCheck size={48} />
                    </div>
                    <h1>Password Reset Successful!</h1>
                    <p>Your password has been updated successfully. You can now login with your new password.</p>
                    <button 
                        className="login-button"
                        onClick={() => navigate("/login")}
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-wrapper">
            <div className="reset-container">
                <button 
                    className="back-button"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                >
                    <FiArrowLeft size={20} />
                </button>
                
                <div className="form-header">
                    <div className="form-icon">
                        <FiKey size={32} />
                    </div>
                    <h1>Reset Your Password</h1>
                    <p className="subtext">
                        Create a new password for your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="reset-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <div className="password-input">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                                placeholder="Enter new password"
                                autoFocus
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        <PasswordStrengthIndicator requirements={passwordRequirements} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <div className="password-input">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setError("");
                                }}
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="spinner"></span>
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>
            </div>
            
            <div className="graphic-section">
                <div className="graphic-overlay"></div>
                <div className="graphic-content">
                    <h2>Academic Issue Tracker</h2>
                    <p>Secure your academic journey</p>
                </div>
            </div>
        </div>
    );
}

const PasswordStrengthIndicator = ({ requirements }) => (
    <div className="password-requirements">
        <p>Password must contain:</p>
        <ul>
            <li className={requirements.minLength ? 'met' : ''}>
                <FiCheck size={12} /> At least 8 characters
            </li>
            <li className={requirements.hasUpperCase ? 'met' : ''}>
                <FiCheck size={12} /> One uppercase letter
            </li>
            <li className={requirements.hasLowerCase ? 'met' : ''}>
                <FiCheck size={12} /> One lowercase letter
            </li>
            <li className={requirements.hasNumber ? 'met' : ''}>
                <FiCheck size={12} /> One number
            </li>
            <li className={requirements.hasSpecialChar ? 'met' : ''}>
                <FiCheck size={12} /> One special character
            </li>
        </ul>
    </div>
);

export default ResetPasswordPage;