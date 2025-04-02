import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API requests
import "./Register.css";

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

        // Prepare the data to send to the backend
        const userData = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            registration_number: formData.registrationNumber,
            college: formData.college,
            course: formData.course,
            lecturer_id: formData.lecturerId,
            academic_title: formData.academicTitle,
        };

        try {
            // Send the data to the backend
            const response = await axios.post("http://127.0.0.1:8000/api/register/", userData);
            console.log("User registered successfully:", response.data);

            // Store role in localStorage
            localStorage.setItem("role", formData.role);

            // Redirect based on role
            if (formData.role === "student") {
                navigate("/studentdashboard", {
                    state: {
                        user: {
                            name: `${formData.firstName} ${formData.lastName}`,
                            email: formData.email,
                            registrationNumber: formData.registrationNumber,
                            program: formData.course,
                            pendingIssues: [], // Default pending issues
                        },
                    },
                });
            } else if (formData.role === "lecturer") {
                navigate("/lecturerdashboard");
            } else if (formData.role === "registrar") {
                navigate("/academicregistrardashboard");
            }
        } catch (error) {
            console.error("Error registering user:", error.response?.data || error.message);
            alert("Failed to register user. Please try again.");
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