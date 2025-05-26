import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Inbox.css";

function Inbox() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = location.state || {};

    return (
        <div className="inbox-container">
            <h1>Inbox</h1>
           
            <div className="content">
                <div className="section">
                    <h2>Pending Issues</h2>
                    <ul>
                        {user?.pendingIssues?.length > 0 ? (
                            user.pendingIssues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                            ))
                        ) : (
                            <p>No pending issues.</p>
                        )}
                    </ul>
                </div>

                <div className="section">
                    <h2>Worked Upon Issues</h2>
                    <ul>
                        {user?.workedUponIssues?.length > 0 ? (
                            user.workedUponIssues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                            ))
                        ) : (
                            <p>No worked upon issues.</p>   
                        )}
                    </ul>
                    
                </div>
            </div>
            <nav className="inbox-navbar">
                
                <button className="navbar-button" onClick={() => navigate(-1)}>Back</button>
            </nav>

        </div>
    );
}

export default Inbox;