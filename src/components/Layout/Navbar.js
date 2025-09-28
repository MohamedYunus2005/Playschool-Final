import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    // For demonstration, these states are hardcoded.
    // In a real application, they would be managed by your authentication context or state management system.
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // This is a placeholder for your actual logout logic
        setIsLoggedIn(false);
        navigate('/');
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Inline SVG for Hamburger icon
    const HamburgerIcon = () => (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
    );

    // Inline SVG for Close icon
    const CloseIcon = () => (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
    );

    return (
        <nav className="relative z-50 overflow-hidden">
            {/* The main gradient for the navbar that extends to the content */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-90"></div>

            {/* Decorative floating emojis */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <span className="absolute top-1/4 left-1/4 text-2xl animate-float-spin-slow">🌟</span>
                <span className="absolute top-2/3 right-1/3 text-2xl animate-float-spin-medium">💖</span>
                <span className="absolute top-1/3 right-1/4 text-2xl animate-float-spin-fast">🌈</span>
                <span className="absolute bottom-1/4 left-1/2 text-2xl animate-float-spin-slow">✨</span>
            </div>

            <div className="container mx-auto flex justify-between items-center py-6 px-4 relative z-10">
                {/* Brand/Logo */}
                <Link to="/" className="text-4xl font-extrabold tracking-wide text-white drop-shadow-md transition-all duration-300 transform hover:scale-105">
                    <span className="text-pink-100">✨</span> Rainbow Land <span className="text-yellow-100">🦄</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6 text-xl">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/about" className="nav-link">About</Link>
                    {isLoggedIn ? (
                        <>
                            <Link to="/attendance" className="nav-link">Attendance</Link>
                            <Link to="/gallery" className="nav-link">Gallery</Link>
                            <Link to="/events" className="nav-link">Events</Link>
                            <Link to="/curriculum" className="nav-link">Curriculum</Link>
                            <Link to="/admissions" className="nav-link">Admissions</Link>
                            <Link to="/contact" className="nav-link">Contact</Link>
                            <button onClick={handleLogout} className="nav-button">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="nav-button">Register</Link>
                            <Link to="/login" className="nav-button">Login</Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center relative z-20">
                    <button onClick={handleMenuToggle} className="text-white focus:outline-none">
                        {isMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu - conditionally rendered and animated */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-gradient-to-b from-purple-400 to-pink-400 transition-all duration-500 ease-in-out transform shadow-xl ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
                <div className="flex flex-col items-center space-y-4 py-8">
                    <Link to="/" className="mobile-nav-link" onClick={handleMenuToggle}>Home</Link>
                    <Link to="/about" className="mobile-nav-link" onClick={handleMenuToggle}>About</Link>
                    {isLoggedIn ? (
                        <>
                            <Link to="/attendance" className="mobile-nav-link" onClick={handleMenuToggle}>Attendance</Link>
                            <Link to="/gallery" className="mobile-nav-link" onClick={handleMenuToggle}>Gallery</Link>
                            <Link to="/events" className="mobile-nav-link" onClick={handleMenuToggle}>Events</Link>
                            <Link to="/curriculum" className="mobile-nav-link" onClick={handleMenuToggle}>Curriculum</Link>
                            <Link to="/admissions" className="mobile-nav-link" onClick={handleMenuToggle}>Admissions</Link>
                            <Link to="/contact" className="mobile-nav-link" onClick={handleMenuToggle}>Contact</Link>
                            <button onClick={() => { handleLogout(); handleMenuToggle(); }} className="mobile-nav-button">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="mobile-nav-button">Register</Link>
                            <Link to="/login" className="mobile-nav-button">Login</Link>
                        </>
                    )}
                </div>
            </div>

            {/* Custom Tailwind Styles for Links and Buttons */}
            <style jsx>
                {`
                .nav-link {
                    @apply text-white font-semibold relative transition-all duration-300;
                }
                .nav-link::after {
                    content: '';
                    @apply absolute left-0 bottom-0 w-full h-0.5 bg-yellow-200 transform scale-x-0 transition-transform duration-300;
                }
                .nav-link:hover::after,
                .nav-link:focus::after {
                    @apply scale-x-100;
                }
                .nav-button {
                    @apply px-4 py-2 rounded-full font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-white text-purple-600;
                }
                .mobile-nav-link {
                    @apply text-white text-2xl font-semibold transition-all duration-300 hover:text-yellow-200 hover:scale-105;
                }
                .mobile-nav-button {
                    @apply px-6 py-3 rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-105 bg-white text-purple-600;
                }
                @keyframes float-spin-slow {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(180deg); }
                    100% { transform: translateY(0px) rotate(360deg); }
                }
                @keyframes float-spin-medium {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(180deg); }
                    100% { transform: translateY(0px) rotate(360deg); }
                }
                @keyframes float-spin-fast {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                    100% { transform: translateY(0px) rotate(360deg); }
                }
                .animate-float-spin-slow {
                    animation: float-spin-slow 10s linear infinite;
                }
                .animate-float-spin-medium {
                    animation: float-spin-medium 8s linear infinite;
                }
                .animate-float-spin-fast {
                    animation: float-spin-fast 6s linear infinite;
                }
                `}
            </style>
        </nav>
    );
};

export default Navbar;