import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import API from "../config.js";

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        registrationNumber: "",
        college: "",
        course: "",
        lecturerId: "", // Added for lecturer
        academicTitle: "", // Added for registrar
    });

    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Validate form data
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
    
        // Prepare the request body based on the selected role
        const requestBody = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            user_type: formData.role,
            department: formData.college, // Assuming "college" maps to "department"
            first_name: formData.firstName,
            last_name: formData.lastName,
            registration_number: formData.registrationNumber,
            course: formData.course,
        };
    
        if (formData.role === "lecturer") {
            requestBody.lecturer_id = formData.lecturerId;
        }
    
        if (formData.role === "registrar") {
            requestBody.academic_title = formData.academicTitle;
        }
    
        try {
            const response = await fetch(`${API}/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                   
                },
                body: JSON.stringify(requestBody),
            });
    
            if (response.ok) {
                const data = await response.json();
                alert("Registration successful!");
                navigate("/login"); // Redirect to login page after successful registration
            } else {
                const errorData = await response.json();
                console.error("Error:", errorData);
                alert(`Registration failed: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("An error occurred. Please try again.");
        }
    };
    
    return (
        <div className="register-container">
            <h2>Register</h2>
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="8"
                            placeholder="Must be at least 8 characters"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select
                        id="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="student">Student</option>
                        <option value="lecturer">Lecturer</option>
                        <option value="registrar">Registrar</option>
                    </select>
                </div>

                {/* Role-Specific Inputs */}
                {formData.role === "student" && (
                    <>
                        <div className="form-group">
                            <label htmlFor="registrationNumber">Student/Registration Number:</label>
                            <input
                                type="text"
                                id="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="college">College:</label>
                            <input
                                type="text"
                                id="college"
                                value={formData.college}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="course">Course:</label>
                            <input
                                type="text"
                                id="course"
                                value={formData.course}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </>
                )}

                {formData.role === "lecturer" && (
                    <div className="form-group">
                        <label htmlFor="lecturerId">Lecturer ID:</label>
                        <input
                            type="text"
                            id="lecturerId"
                            value={formData.lecturerId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                {formData.role === "registrar" && (
                    <div className="form-group">
                        <label htmlFor="academicTitle">Academic Title:</label>
                        <input
                            type="text"
                            id="academicTitle"
                            value={formData.academicTitle}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                <button type="submit">Register</button>
                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;