function Login() {
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle login logic here
    };

    return (
        <div className="login-container">
            <h2>AITS</h2>
            <form onSubmit={handleSubmit}>
