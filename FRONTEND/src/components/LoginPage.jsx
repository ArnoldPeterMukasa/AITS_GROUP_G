"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./LoginPage.css"
import { BASE_API_URL } from "../../config";


function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Basic validation
    if (!username || !password) {
      setError("Username and password are required.")
      return
    }

    // Clear any previous error
    setError(null)

    try {
      // Send login data to the backend
      const response = await fetch(`${BASE_API_URL}/login/`, {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      })

      if (response.ok) {
        const data = await response.json()

        // Debugging: Log the backend response
        console.log("Login Response:", data)

        // Save user data (e.g., token, role) to localStorage or state
        localStorage.setItem("authToken", data.token) // Changed from "token" to "authToken"
        localStorage.setItem("role", data.role) // Assuming the backend returns the user's role

        // Navigate to the respective dashboard based on the user's role
        if (data.role === "student") {
          // Prepare student data to pass to dashboard
          const studentData = {
            name: data.name,
            email: data.email,
            registrationNumber: data.registrationNumber,
            program: data.program,
          }

          navigate("/StudentDashboard", {
            state: {
              studentData: studentData,
            },
          })
        } else if (data.role === "lecturer") {
          navigate("/LecturerDashboard")
        } else if (data.role === "registrar") {
          navigate("/AcademicRegistrarDashboard")
        } else {
          setError("Invalid role or credentials.")
        }
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Invalid username or password.")
      }
    } catch (error) {
      console.error("Error during login:", error)
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <div className="login-container">
      <h2>Academic Issue Tracking System</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="Must be at least 8 characters"
          />
          <small>Password must be at least 8 characters long.</small>
        </div>
        <div className="form-group remember-me">
          <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
          <label htmlFor="rememberMe">Remember Me</label>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="submit-button">
          Login
        </button>

        <p className="forgot-password">
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>

        <p>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage;
