import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Register.css';

function RegisterPage() {
    const navigate = useNavigate(); // Hook to navigate to another page
    
    const [role, setRole] = useState('student'); // Default role is 'student'
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [college, setCollege] = useState('');
    const [course, setCourse] = useState('');
    const [department, setDepartment] = useState('');
    const [roleSpecificInfo, setRoleSpecificInfo] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        // Password Validation
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Handle registration logic here (e.g., API call)
        console.log("Form Submitted", {
            firstName,
            lastName,
            username,
            email,
            password,
            registrationNumber,
            college,
            course,
            department,
            role,
        });

        // Clear error message if no issues
        setError('');

        // Navigate to the student dashboard (or any other page based on role)
        if (role === 'student') {
            navigate('/student-dashboard');
        } else {
            // Redirect based on other roles (lecturer, registrar)
            // navigate('/dashboard'); // Example for lecturers/registrars
        }
    };

    return (
        <div className="register-container">
            <h2>Register for AITS</h2>
            <p>Already have an account? <Link to="/login">Login</Link></p>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="student">Student</option>
                        <option value="lecturer">Lecturer</option>
                        <option value="registrar">Registrar</option>
                    </select>
                </div>

                {/* Role-Specific Information */}
                {role === 'student' && (
                    <div className="student-info">
                        <div className="form-group">
                            <label htmlFor="registrationNumber">Student ID:</label>
                            <input
                                type="text"
                                id="registrationNumber"
                                value={registrationNumber}
                                onChange={(e) => setRegistrationNumber(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="college">College:</label>
                            <input
                                type="text"
                                id="college"
                                value={college}
                                onChange={(e) => setCollege(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="course">Course:</label>
                            <input
                                type="text"
                                id="course"
                                value={course}
                                onChange={(e) => setCourse(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                )}

                {(role === 'lecturer' || role === 'registrar') && (
                    <div className="work-info">
                        <div className="form-group">
                            <label htmlFor="department">Department:</label>
                            <input
                                type="text"
                                id="department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                            />
                        </div>

                        {role === 'lecturer' && (
                            <div className="form-group">
                                <label htmlFor="roleSpecific">Role (e.g., Professor):</label>
                                <input
                                    type="text"
                                    id="roleSpecific"
                                    value={roleSpecificInfo}
                                    onChange={(e) => setRoleSpecificInfo(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                )}

                {error && <p className="error">{error}</p>}

                <button type="submit">Register</button>

                <p>Already have an account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    );
}

export default RegisterPage;
