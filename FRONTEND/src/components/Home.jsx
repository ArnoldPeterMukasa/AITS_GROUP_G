import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Array of images for the carousel
    const images = [
        'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80', 
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 
        'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80', 
        'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ];

    // Auto-rotate images every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);
        
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="home-container">
            <header className="header">
                <div className="logo">
                    <h1>Academic Issue Tracking System</h1>
                    <p className="university-name">Makerere University Group G</p>
                </div>
                <div className="cta-buttons">
                    <button className="cta-button" onClick={() => navigate("/login")}>Login</button>
                    <button className="cta-button" onClick={() => navigate("/register")}>Register</button>
                </div>
            </header>

            {/* Image Carousel Section */}
            <section className="image-carousel">
                <img 
                    src={images[currentImageIndex]} 
                    alt="Academic environment" 
                    className="carousel-image"
                />
                <div className="carousel-dots">
                    {images.map((_, index) => (
                        <span 
                            key={index}
                            className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                            onClick={() => setCurrentImageIndex(index)}
                        ></span>
                    ))}
                </div>
            </section>

            <section className="intro">
                <h2>Welcome to the Academic Issue Tracking System</h2>
                <p>Efficiently manage and resolve academic issues for students, lecturers, and registrars.</p>
            </section>

            <section className="user-role-section">
                <div className="user-role-card">
                    <h3>For Students</h3>
                    <p>Submit and track your academic concerns.</p>
                </div>
                <div className="user-role-card">
                    <h3>For Lecturers</h3>
                    <p>Manage student issues and provide feedback.</p>
                </div>
                <div className="user-role-card">
                    <h3>For Registrars</h3>
                    <p>Oversee and resolve academic matters efficiently.</p>
                </div>
            </section>

            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-info">
                        <p>© {new Date().getFullYear()} Academic Issue Tracking System Group G. All Rights Reserved.</p>
                        <p>Contact us: <a href="mailto:info.groupg.aits@gmail.com">info.groupg.aits@gmail.com</a></p>
                        <p>Follow us on social media for updates.</p>
                        <div className="social-icons">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> |
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a> |
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;        