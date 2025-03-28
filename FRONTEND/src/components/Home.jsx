// This component is the home page of the site. It contains a brief description of the site and what it does.
// It also contains a welcome message to the user and a prompt to log in or register.
import { useNavigate } from 'react-router-dom';
import './Home.css';
function Home() {
    const navigate = useNavigate();
    function gotologin() {
        navigate("/login");
    }
    function gotoregister() {
        navigate("/register");
    }
    return (
        <div className="home">
            <h1>Welcome to the Academic Issue Tracking System </h1>
            <p>
                This platform allows students, lecturers, and academic registrars to efficiently manage and track academic issues.
            </p>
            <p>
                Please log in or register to get started.
            </p>
            <div className='buttons'>
            <button onClick={gotologin}>Login</button>
            <button onClick={gotoregister}>Register</button>
            </div>

        </div>
    )
}
export default Home;