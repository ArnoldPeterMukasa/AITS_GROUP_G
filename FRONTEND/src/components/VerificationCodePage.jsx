import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiLock, FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import "./VerificationCodePage.css";

function VerificationCodePage() {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const inputRefs = useRef([]);

    // Get email from navigation state
    const email = location.state?.email || "";

    // Handle countdown timer for resend
    useEffect(() => {
        let timer;
        if (countdown > 0 && isResendDisabled) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (countdown === 0) {
            setIsResendDisabled(false);
        }
        return () => clearTimeout(timer);
    }, [countdown, isResendDisabled]);

    // Focus first input on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Only allow numbers
        
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        setError("");

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").trim();
        if (/^\d{6}$/.test(pasteData)) {
            const pasteArray = pasteData.split("");
            setCode(pasteArray);
            inputRefs.current[5].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Check if all digits are filled
        if (code.some(digit => digit === "")) {
            setError("Please enter the full 6-digit code");
            setIsLoading(false);
            return;
        }

        // const verificationCode = code.join(""); // Removed unused variable

        try {
            // Simulate API verification
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // In a real app:
            /*
            const response = await fetch("/api/verify-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, code: verificationCode }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Invalid verification code");
            }
            */

            setMessage("Code verified successfully!");
            setTimeout(() => navigate("/reset-password", { 
                state: { email, token: "sample-token" } 
            }), 1000);
        } catch {
            setError("Failed to verify code");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsResendDisabled(true);
        setCountdown(60);
        setError("");
        setMessage("");

        try {
            // Simulate resend API call
            await new Promise(resolve => setTimeout(resolve, 800));
            setMessage("A new code has been sent to your email");
        } catch {
            setError("Failed to resend code. Please try again.");
        }
    };

    return (
        <div className="verification-wrapper">
            <div className="verification-container">
                <button 
                    className="back-button"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                >
                    <FiArrowLeft size={20} />
                </button>
                
                <div className="form-header">
                    <div className="form-icon">
                        <FiLock size={32} />
                    </div>
                    <h1>Enter Verification Code</h1>
                    <p className="subtext">
                        We've sent a 6-digit code to <strong>{email}</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="verification-form">
                    <div className={`code-input-group ${error ? 'error' : ''}`}>
                        <label>Verification Code</label>
                        <div className="code-inputs">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                />
                            ))}
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        {message && (
                            <div className="success-message">
                                <svg viewBox="0 0 24 24">
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                                <span>{message}</span>
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="spinner"></span>
                        ) : (
                            "Verify Code"
                        )}
                    </button>

                    <div className="resend-code">
                        <p>
                            Didn't receive a code?{" "}
                            <button
                                type="button"
                                className={`text-button ${isResendDisabled ? 'disabled' : ''}`}
                                onClick={handleResendCode}
                                disabled={isResendDisabled}
                            >
                                {isResendDisabled ? (
                                    `Resend in ${countdown}s`
                                ) : (
                                    <>
                                        <FiRefreshCw size={14} /> Resend Code
                                    </>
                                )}
                            </button>
                        </p>
                    </div>
                </form>

                <div className="additional-options">
                    <p>
                        Wrong email?{" "}
                        <button 
                            className="text-button"
                            onClick={() => navigate("/forgot-password")}
                        >
                            Change email
                        </button>
                    </p>
                </div>
            </div>
            
            <div className="graphic-section">
                <div className="graphic-overlay"></div>
                <div className="graphic-content">
                    <h2>Academic Issue Tracker</h2>
                    <p>Secure account recovery process</p>
                </div>
            </div>
        </div>
    );
}

export default VerificationCodePage;