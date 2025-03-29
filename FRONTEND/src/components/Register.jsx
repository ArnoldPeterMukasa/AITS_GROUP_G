import React, { useState,useNavigate } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        registrationNumber: '',
        college: '',
        course: '',
    });

    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };



function Register() {
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

        // Validate form data
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Check if the role is "student"
        if (formData.role === 'student') {
            // Navigate to the StudentDashboard and pass user data
            navigate('/studentdashboard', {
                state: {
                    user: {
                        name: `${formData.firstName} ${formData.lastName}`,
                        program: formData.course,
                        pendingIssues: [], // You can add default pending issues here
                    },
                },
            });
        } else {
            alert('Only students can access the Student Dashboard.');

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

        // Redirect based on role
        if (role === 'student') {
            navigate('/studentDashboard');
        } else if (role === 'lecturer') {
            navigate('/LecturerDashboard');
        } else if (role === 'registrar') {
            navigate('/AcademicRegistrarDashboard'); // Redirect registrar to their dashboard
        }
    };

    return (
        <div className="register-container">

            <h2>Register</h2>
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>

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

                            value={formData.confirmPassword}
                            

                            
                            onChange={(e) => setConfirmPassword(e.target.value)}

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

                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    

                        <option value="student">Student</option>
                        <option value="lecturer">Lecturer</option>
                        <option value="registrar">Registrar</option>
                    </select>
                </div>

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
                <button type="submit">Register</button>
                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
          );
            }
        }}
        
        export default RegisterPage;


