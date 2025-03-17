// This component is the home page of the site. It contains a brief description of the site and what it does.
// It also contains a welcome message to the user and a prompt to log in or register.
function Home() {
    return (
        <div className="home">
            <h1>Welcome to the Academic Issue Tracking System </h1>
            <p>
                This platform allows students, lecturers, and academic registrars to efficiently manage and track academic issues.
            </p>
            <p>
                Please log in or register to get started.
            </p>

        </div>
    );
}
export default Home;