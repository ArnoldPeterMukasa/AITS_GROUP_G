function LoginPage() {
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle login logic here
    };

    return (
        <div className="login-container">
            <h2>AITS</h2>
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" required />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select id="role" required>
                        <option value="">Select Role</option>
                        <option value="student">Student</option>
                        <option value="lecturer">Lecturer</option>
                        <option value="registrar">Registrar</option>
                    </select>
                </div>
                <button type="submit">Login</button>
                <p>Don't have an account? <a href="">Signup</a></p>
            </form>
        </div>
        );
        }
        
        export default LoginPage;


