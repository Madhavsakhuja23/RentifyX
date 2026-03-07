import { useState, useEffect } from "react";
import { X, Home, MapPin, Shield } from "lucide-react";
import welcomeImage from "@/assets/hero-houses.webp";
import "./WelcomeModal.css";

const WelcomeModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has already seen the welcome modal
        const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeModal");
        if (!hasSeenWelcome) {
            setIsOpen(true);
            // Mark that user has seen the modal
            localStorage.setItem("hasSeenWelcomeModal", "true");
        }
    }, []);

    // For debugging - remove this localStorage key to see modal again
    useEffect(() => {
        const resetModal = () => {
            localStorage.removeItem("hasSeenWelcomeModal");
            setIsOpen(true);
        };
        window.resetWelcomeModal = resetModal;
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleClose}>
                    <X size={24} />
                </button>

                <div className="modal-container">
                    {/* Left Side - Image and Welcome Text */}
                    <div className="modal-left">
                        <div className="modal-image-section">
                            <div className="modal-image-placeholder" style={{ backgroundImage: `url(${welcomeImage})` }}>
                                <div className="image-gradient"></div>
                                <div className="image-content">
                                    <h1 className="welcome-title">Welcome to RentifyX</h1>
                                    <p className="welcome-subtitle">Your perfect stay awaits</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Features and CTA */}
                    <div className="modal-right">
                        <div className="features-list">
                            <div className="feature-block">
                                <div className="feature-icon">
                                    <Home size={24} />
                                </div>
                                <div className="feature-content">
                                    <h3 className="feature-title">Find Your Dream Home</h3>
                                    <p className="feature-description">Explore thousands of verified properties including houses, flats, PGs, and travel stays.</p>
                                </div>
                            </div>

                            <div className="feature-block">
                                <div className="feature-icon">
                                    <MapPin size={24} />
                                </div>
                                <div className="feature-content">
                                    <h3 className="feature-title">Easy Filtering</h3>
                                    <p className="feature-description">Filter by property type, location, dates, and more to find exactly what you need.</p>
                                </div>
                            </div>

                            <div className="feature-block">
                                <div className="feature-icon">
                                    <Shield size={24} />
                                </div>
                                <div className="feature-content">
                                    <h3 className="feature-title">Secure & Verified</h3>
                                    <p className="feature-description">All properties are verified and Aadhar card verification is mandatory for bookings.</p>
                                </div>
                            </div>
                        </div>

                        <button className="modal-button primary" onClick={handleClose}>
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;
