import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';

const Landing = ({ theme }) => {
    const isUnicornTheme = theme === 'unicorn';
    const bgColor = isUnicornTheme
        ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200'
        : 'bg-gradient-to-br from-gray-900 via-purple-950 to-blue-950 text-white';

    const [mounted, setMounted] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showPopUp, setShowPopUp] = useState(false);

    useEffect(() => {
        setMounted(true);

        const popUpTimer = setTimeout(() => {
            setShowPopUp(true);
        }, 3000); // Show pop-up after 3 seconds

        return () => {
            setMounted(false);
            clearTimeout(popUpTimer);
        };
    }, []);

    const floatingEmojis = isUnicornTheme
        ? ['🦄', '🌈', '🌟', '☁️', '🎈', '🍭', '🎀', '💖', '✨', '🌸']
        : ['🌙', '✨', '🪐', '💫', '🚀', '⭐', '☄️', '🔮', '👽', '🌌'];

    const handleButtonClick = () => {
        setShowConfetti(true);
        // Note: I'm commenting out the audio logic for simplicity, as I can't guarantee the path will work outside of your local environment.
        // const audio = new Audio(`${process.env.PUBLIC_URL}/sounds/magic-chime.mp3`);
        // audio.play().catch(e => console.error("Audio playback failed:", e));
        setTimeout(() => setShowConfetti(false), 5000); // Confetti lasts for 5 seconds
    };

    return (
        <div className={`font-sans overflow-hidden transition-all duration-1000 ${bgColor} min-h-screen relative`}>
            {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

            {/* Static Corner Sparkle Effect (Size adjusted for small screens) */}
            <div className={`fixed bottom-4 left-4 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-yellow-300 bg-opacity-70 z-50 animate-pulse-sparkle transition-all duration-500`}>
                <span className="text-3xl md:text-4xl">🌟</span>
            </div>

            {/* Animated Background Emojis (Size adjusted for responsiveness) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 40 }).map((_, index) => (
                    <div
                        key={index}
                        // Added 'text-xl' as base size, scaling up to 'text-4xl' on larger screens
                        className={`absolute text-xl sm:text-2xl md:text-4xl opacity-70 animate-float-spin`}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${Math.random() * 5 + 5}s`
                        }}
                    >
                        {floatingEmojis[Math.floor(Math.random() * floatingEmojis.length)]}
                    </div>
                ))}
            </div>

            {/* Pop-up message */}
            {showPopUp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-500 p-4"> {/* Added p-4 for padding on small screens */}
                    <div className={`relative p-6 sm:p-8 rounded-3xl shadow-2xl text-center max-w-sm w-full transform transition-all duration-700 ${isUnicornTheme ? 'bg-white text-purple-800' : 'bg-gray-800 text-yellow-200'}`}
                        style={{ animation: 'pop-in 0.5s ease-out' }}>
                        <button onClick={() => setShowPopUp(false)} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 transition-colors">❌</button>
                        <h3 className="text-3xl sm:text-4xl font-extrabold mb-4">Hey there, Sparkle! ✨</h3> {/* Adjusted text size */}
                        <p className="text-base sm:text-lg mb-6">Are you ready to play and learn with new friends? Join our magical adventure!</p> {/* Adjusted text size */}
                        <button onClick={() => setShowPopUp(false)} className={`inline-block px-6 py-3 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 ${isUnicornTheme ? 'bg-pink-400 text-white' : 'bg-blue-400 text-white'}`}>Let's Go!</button>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col items-center justify-center text-center z-20 p-4"> {/* Added p-4 for full-screen padding */}
                <div className={`relative z-20 p-6 md:p-10 rounded-3xl backdrop-blur-sm shadow-xl border-4 border-white border-opacity-60 mx-4 transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${isUnicornTheme ? 'bg-white bg-opacity-30' : 'bg-gray-800 bg-opacity-50'} hover:shadow-glow-pink hover:scale-105 transition-all duration-700`}>
                    {/* Adjusted text sizes: text-4xl as base, scaling up */}
                    <h1 className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4 drop-shadow-lg transition-colors duration-1000 ${isUnicornTheme ? 'text-purple-800 animate-text-gradient-unicorn' : 'text-yellow-200 animate-text-gradient-dark'}`}>
                        Welcome to Rainbow Land 🌈
                    </h1>
                    {/* Adjusted text sizes: text-lg as base, scaling up */}
                    <p className={`text-lg sm:text-xl mb-10 md:text-2xl lg:text-3xl font-semibold italic transition-colors duration-1000 ${isUnicornTheme ? 'text-purple-700' : 'text-blue-300'}`}>
                        Where every day is a magical journey of discovery!
                    </p>
                    <Link
                        to="/login"
                        onClick={handleButtonClick}
                        // Button size adjusted: text-lg as base, scaling up
                        className={`inline-flex items-center justify-center text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-lg sm:text-xl font-bold transition-all duration-300 transform hover:scale-110 shadow-lg relative overflow-hidden group ${isUnicornTheme ? 'bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse' : 'bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse'}`}
                    >
                        <span className="relative z-10 flex items-center">
                            Join the Fun!
                            <span className="ml-2 animate-bounce-horizontal">🚀</span>
                        </span>
                    </Link>
                </div>
            </section>

            {/* --- */}

            {/* Curriculum Section */}
            <section className="py-24 container mx-auto px-6 relative z-20 -mt-24">
                {/* Adjusted text size: text-3xl as base, scaling up */}
                <h2 className={`text-3xl sm:text-4xl font-extrabold text-center mb-16 drop-shadow-md transition-colors duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${isUnicornTheme ? 'text-purple-700' : 'text-yellow-300'}`}>
                    Our Magical Play-Based Curriculum 🌟
                </h2>
                {/* Grid is already responsive with grid-cols-1 md:grid-cols-3. Added sm:gap-8 for better tablet spacing. */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                    {/* Card 1 */}
                    <div className={`p-6 sm:p-8 rounded-[40px] shadow-2xl text-center transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 border-4 border-white border-opacity-60 relative overflow-hidden group animate-fade-in ${isUnicornTheme ? 'bg-gradient-to-br from-pink-300 to-purple-300' : 'bg-gradient-to-br from-gray-800 to-purple-800'}`}>
                        <div className="relative">
                            <span className="text-4xl sm:text-5xl mb-4 sm:mb-6 inline-block transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">🎨</span>
                            <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 transition-colors duration-1000 ${isUnicornTheme ? 'text-purple-800' : 'text-pink-300'}`}>
                                Enchanted Arts
                            </h3>
                            <p className={`text-base sm:text-lg transition-colors duration-1000 ${isUnicornTheme ? 'text-gray-800' : 'text-gray-200'}`}>
                                Wiggle, paint, and sing! Our creative kingdom sparks imagination and helps little stars shine bright.
                            </p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className={`p-6 sm:p-8 rounded-[40px] shadow-2xl text-center transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 border-4 border-white border-opacity-60 relative overflow-hidden group animate-fade-in delay-1 ${isUnicornTheme ? 'bg-gradient-to-br from-blue-300 to-green-300' : 'bg-gradient-to-br from-purple-800 to-blue-800'}`}>
                        <div className="relative">
                            <span className="text-4xl sm:text-5xl mb-4 sm:mb-6 inline-block transform group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-500">🧠</span>
                            <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 transition-colors duration-1000 ${isUnicornTheme ? 'text-purple-800' : 'text-yellow-300'}`}>
                                Rainbow Growth
                            </h3>
                            <p className={`text-base sm:text-lg transition-colors duration-1000 ${isUnicornTheme ? 'text-gray-800' : 'text-gray-200'}`}>
                                Tiny minds blossom! We nurture curious minds and sparkling personalities with joyful learning.
                            </p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className={`p-6 sm:p-8 rounded-[40px] shadow-2xl text-center transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 border-4 border-white border-opacity-60 relative overflow-hidden group animate-fade-in delay-2 ${isUnicornTheme ? 'bg-gradient-to-br from-yellow-300 to-pink-300' : 'bg-gradient-to-br from-blue-800 to-pink-800'}`}>
                        <div className="relative">
                            <span className="text-4xl sm:text-5xl mb-4 sm:mb-6 inline-block transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">🤸‍♂️</span>
                            <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 transition-colors duration-1000 ${isUnicornTheme ? 'text-purple-800' : 'text-blue-300'}`}>
                                Magical Play
                            </h3>
                            <p className={`text-base sm:text-lg transition-colors duration-1000 ${isUnicornTheme ? 'text-gray-800' : 'text-gray-200'}`}>
                                Adventure awaits! Our safe enchanted gardens are perfect for jumping, running, and making new friends.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- */}

            {/* Call to Action Section with playful graphics */}
            <section className={`py-16 sm:py-20 mt-16 relative overflow-hidden transition-all duration-1000 ${isUnicornTheme ? 'bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400' : 'bg-gradient-to-br from-gray-950 via-purple-950 to-blue-950'}`}>
                <div className="container mx-auto text-center relative z-10 p-6 transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}">
                    {/* Adjusted text size: text-3xl as base, scaling up */}
                    <h2 className={`text-3xl sm:text-4xl font-extrabold mb-6 drop-shadow-md transition-colors duration-1000 ${isUnicornTheme ? 'text-white' : 'text-yellow-200'}`}>
                        Ready for a Magical Journey? 🚀
                    </h2>
                    {/* Adjusted text size: text-base as base, scaling up */}
                    <p className={`text-base sm:text-xl mb-10 max-w-2xl mx-auto transition-colors duration-1000 ${isUnicornTheme ? 'text-white' : 'text-gray-300'}`}>
                        Join our playschool family where every child discovers their inner sparkle and grows with joy!
                    </p>
                    <Link
                        to="/contact"
                        // Button size adjusted: text-lg as base, scaling up
                        className={`inline-flex items-center justify-center text-purple-700 px-6 py-3 sm:px-8 sm:py-4 rounded-full text-lg sm:text-xl font-bold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg group ${isUnicornTheme ? 'bg-white hover:bg-gray-100' : 'bg-white hover:bg-gray-200'}`}
                    >
                        <span className="mr-2 group-hover:rotate-45 transition-transform">🌈</span> Contact Us Today!
                    </Link>
                </div>
            </section>

            {/* --- */}

            {/* Footer with playful design */}
            <footer className={`py-8 sm:py-12 relative overflow-hidden transition-colors duration-1000 ${isUnicornTheme ? 'bg-purple-900 text-white' : 'bg-black text-white'}`}>
                <div className="container mx-auto text-center relative z-10 p-4"> {/* Added p-4 for padding */}
                    <p className="text-sm sm:text-lg mb-4">&copy; {new Date().getFullYear()} Rainbow Land Playschool. All rights reserved.</p> {/* Adjusted text size */}
                    <div className="flex justify-center space-x-6 text-xl sm:text-2xl"> {/* Adjusted emoji size */}
                        <a href="#" className="hover:text-pink-400 transition-colors duration-200 transform hover:scale-125">💖</a>
                        <a href="#" className="hover:text-blue-400 transition-colors duration-200 transform hover:scale-125">✨</a>
                        <a href="#" className="hover:text-yellow-400 transition-colors duration-200 transform hover:scale-125">🌟</a>
                    </div>
                </div>
            </footer>

            {/* Add custom animation styles */}
            <style>
                {/* No changes needed to the CSS keyframes, as they control movement/effects, not base sizing */}
                {`
                @keyframes float-spin {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(360deg); }
                    100% { transform: translateY(0px) rotate(720deg); }
                }
                .animate-float-spin {
                    animation: float-spin var(--animation-duration, 8s) ease-in-out infinite;
                }
                .animate-pulse-sparkle {
                    animation: pulse-sparkle 2s ease-in-out infinite alternate;
                }
                @keyframes pulse-sparkle {
                    from { transform: scale(1); opacity: 0.7; }
                    to { transform: scale(1.1); opacity: 1; }
                }
                @keyframes text-gradient-unicorn {
                    0% { color: #f472b6; }
                    50% { color: #8b5cf6; }
                    100% { color: #3b82f6; }
                }
                @keyframes text-gradient-dark {
                    0% { color: #fde047; }
                    50% { color: #a78bfa; }
                    100% { color: #60a5fa; }
                }
                .animate-text-gradient-unicorn {
                    animation: text-gradient-unicorn 4s ease-in-out infinite alternate;
                }
                .animate-text-gradient-dark {
                    animation: text-gradient-dark 4s ease-in-out infinite alternate;
                }
                @keyframes pop-in {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                    opacity: 0;
                }
                @keyframes fade-in {
                    to { opacity: 1; }
                }
                .delay-1 {
                    animation-delay: 0.5s;
                }
                .delay-2 {
                    animation-delay: 1s;
                }
                `}
            </style>
        </div>
    );
};

export default Landing;