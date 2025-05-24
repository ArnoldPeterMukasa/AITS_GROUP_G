"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./LoginPage.css"
import { loginUser } from "../config.js"  // ✅ use the loginUser function


function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!username || !password) {
      setError("Username and password are required.")
      return
    }

    setError(null)

    try {
      // ✅ Call loginUser from config.js instead of fetch
      const data = await loginUser({ username, password })

      // ✅ Store token and role
      localStorage.setItem("authToken", data.token)
      localStorage.setItem("role", data.role)

      if (data.role === "student") {
        const studentData = {
          id: data.id,
          name: data.name,
          email: data.email,
          registrationNumber: data.registrationNumber,
          program: data.program,
        }

        navigate("/StudentDashboard", {
          state: { studentData },
        })
      } else if (data.role === "lecturer") {
        navigate("/LecturerDashboard")
      } else if (data.role === "registrar") {
        navigate("/AcademicRegistrarDashboard")
      } else {
        setError("Invalid role or credentials.")
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError("Login failed. Please try again.")
      }
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
