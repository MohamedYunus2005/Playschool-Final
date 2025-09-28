import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Utility functions moved outside the component to prevent re-creation on re-render
const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// Note: Speech synthesis might be blocked or unavailable in some sandbox environments.
const speakCaptcha = (text) => {
    if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text.split('').join(' '));
        window.speechSynthesis.speak(utterance);
    } else {
        console.warn("Speech Synthesis API not supported.");
    }
};

// Component for a custom, state-driven alert message (Replaces alert())
const AlertMessage = ({ message, type = 'error', onClose, isUnicornTheme }) => {
    if (!message) return null;

    // Adjusted info colors to green for success messages
    const colors = isUnicornTheme ? {
        error: 'bg-red-100 border-red-400 text-red-700',
        info: 'bg-green-100 border-green-400 text-green-700',
    } : {
        error: 'bg-red-900 border-red-600 text-red-300',
        info: 'bg-green-900 border-green-600 text-green-300',
    };

    return (
        <div className={`mt-4 p-4 rounded-lg border-l-4 ${colors[type]} transition-all duration-300 transform scale-100`}>
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium">{message}</p>
                <button onClick={onClose} className="text-xl leading-none font-bold ml-4">
                    &times;
                </button>
            </div>
        </div>
    );
};

// Shared component for the Captcha input block
const CaptchaBlock = ({ captcha, setCaptcha, staticCaptcha, handleCaptchaRefresh, isUnicornTheme }) => (
    <div>
        <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-200'}`} htmlFor="captcha">
            Captcha Code
        </label>

        {/* Captcha Display and Buttons: Responsive layout for small screens */}
        <div className="flex items-center space-x-3 mb-3">
            <div className={`flex-1 min-w-[100px] font-extrabold text-lg text-center py-3 rounded-lg border-2 select-none tracking-widest drop-shadow-sm transition-colors duration-500 ${isUnicornTheme ? 'bg-white/50 text-purple-800 border-purple-200' : 'bg-gray-700/50 text-yellow-200 border-purple-800'}`}>
                {staticCaptcha}
            </div>

            {/* Buttons: Fixed small size for better mobile touch targets */}
            <button
                type="button"
                onClick={handleCaptchaRefresh}
                className={`w-10 h-10 p-2 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${isUnicornTheme ? 'bg-white/50 hover:bg-white/70 text-purple-700' : 'bg-gray-700/50 hover:bg-gray-700/70 text-yellow-300'}`}
                aria-label="Refresh Captcha"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356-2A8.001 8.001 0 004 15.54a8.001 8.001 0 0015.356-2m-1.879-6l-2.658 2.658A4 4 0 1114 13.5l1.658-1.658a2 2 0 002.828 0" />
                </svg>
            </button>
            <button
                type="button"
                onClick={() => speakCaptcha(staticCaptcha)}
                className={`w-10 h-10 p-2 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${isUnicornTheme ? 'bg-white/50 hover:bg-white/70 text-purple-700' : 'bg-gray-700/50 hover:bg-gray-700/70 text-yellow-300'}`}
                aria-label="Speak Captcha"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0a2 2 0 002 2H5a2 2 0 00-2-2m0 0a2 2 0 012-2h12a2 2 0 012 2m0 0v2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7" />
                </svg>
            </button>
        </div>

        {/* Captcha Input: Always full width for easy typing on mobile */}
        <input
            className={`shadow-inner appearance-none border-2 border-transparent rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-4 transition-all duration-300 ${isUnicornTheme ? 'text-gray-700 bg-white focus:ring-pink-300' : 'text-white bg-gray-700 bg-opacity-70 focus:ring-purple-500'}`}
            id="captcha"
            type="text"
            placeholder="Enter Captcha"
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
            required
        />
    </div>
);


// Sub-component for Admin Login form
const AdminLogin = ({ setIsLoggedIn, isUnicornTheme }) => {
    const [username, setUsername] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [staticCaptcha, setStaticCaptcha] = useState(generateCaptcha());
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleCaptchaRefresh = () => {
        setStaticCaptcha(generateCaptcha());
        setCaptcha('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!/^\d{5}$/.test(employeeId)) {
            setErrorMessage("Employee ID must be a 5-digit number.");
            return;
        }

        if (captcha.toLowerCase() !== staticCaptcha.toLowerCase()) {
            setErrorMessage("Incorrect Captcha. Please try again.");
            handleCaptchaRefresh();
            return;
        }

        // --- MOCK AUTHENTICATION (Enabled for Navigation) ---
        try {
            // Simulate API latency for better UX
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mock successful login check: just check if required fields are non-empty
            if (username && employeeId && password) {
                setIsLoggedIn(true);
                // *** NAVIGATION ENABLED ***
                navigate('/admin-dashboard');
            } else {
                setErrorMessage('Authentication Failed. Check username, ID, and password.');
            }
        } catch (error) {
            setErrorMessage("An unexpected error occurred during login simulation.");
            console.error('Login error:', error);
        }
        // --- END MOCK AUTHENTICATION ---
    };

    // Responsive form container classes
    const formClass = `max-w-xs sm:max-w-md w-full p-6 sm:p-8 rounded-3xl shadow-2xl relative z-10 backdrop-blur-sm transform transition-all duration-500 hover:scale-[1.02] ${isUnicornTheme ? 'bg-white/70' : 'bg-gray-800/70 text-white'}`;
    const inputClass = `shadow-inner appearance-none border-2 border-transparent rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-4 transition-all duration-300 ${isUnicornTheme ? 'text-gray-700 bg-white focus:ring-pink-300' : 'text-white bg-gray-700 focus:ring-purple-500'}`;
    const labelClass = `block text-sm font-bold mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-200'}`;
    const buttonClass = `w-full font-bold py-3 px-4 rounded-full focus:outline-none focus:shadow-outline transform transition-all duration-300 hover:scale-[1.03] shadow-lg ${isUnicornTheme ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white hover:from-pink-500 hover:via-purple-500 hover:to-blue-500' : 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white hover:from-blue-600 hover:via-purple-700 hover:to-pink-600'}`;


    return (
        <div className={formClass}>
            <h2 className={`text-3xl font-extrabold text-center mb-2 drop-shadow-md transition-colors duration-500 ${isUnicornTheme ? 'text-purple-800' : 'text-yellow-200'}`}>Playschool Admin</h2>
            <p className={`text-center mb-8 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-300'}`}>Sign in to your account</p>
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Username */}
                <div>
                    <label className={labelClass} htmlFor="username">Username</label>
                    <input
                        className={inputClass}
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                {/* Employee ID */}
                <div>
                    <label className={labelClass} htmlFor="employeeId">Employee ID</label>
                    <input
                        className={inputClass}
                        id="employeeId"
                        type="tel"
                        placeholder="Enter your 5-digit employee ID"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value.replace(/\D/g, '').slice(0, 5))}
                        required
                    />
                </div>

                {/* Password */}
                <div>
                    <label className={labelClass} htmlFor="password">Password</label>
                    <div className="relative">
                        <input
                            className={inputClass}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-500 ${isUnicornTheme ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-gray-100'}`}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.577 3.01 9.964 7.822a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.577-3.01-9.964-7.822z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Captcha Block (Responsive Layout) */}
                <CaptchaBlock
                    captcha={captcha}
                    setCaptcha={setCaptcha}
                    staticCaptcha={staticCaptcha}
                    handleCaptchaRefresh={handleCaptchaRefresh}
                    isUnicornTheme={isUnicornTheme}
                />

                <div className="pt-2">
                    <button
                        className={buttonClass}
                        type="submit"
                    >
                        Sign In as Admin
                    </button>
                </div>
            </form>
            <AlertMessage message={errorMessage} onClose={() => setErrorMessage('')} isUnicornTheme={isUnicornTheme} />
        </div>
    );
};

// Sub-component for Parent Login form
const ParentLogin = ({ setIsLoggedIn, isUnicornTheme }) => {
    const [studentName, setStudentName] = useState('');
    const [dob, setDob] = useState('');
    const [password, setPassword] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [staticCaptcha, setStaticCaptcha] = useState(generateCaptcha());
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleCaptchaRefresh = () => {
        setStaticCaptcha(generateCaptcha());
        setCaptcha('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (captcha.toLowerCase() !== staticCaptcha.toLowerCase()) {
            setErrorMessage("Incorrect Captcha. Please try again.");
            handleCaptchaRefresh();
            return;
        }

        // --- MOCK AUTHENTICATION (Enabled for Navigation) ---
        try {
            // Simulate API latency for better UX
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mock successful login check: just check if required fields are non-empty
            if (studentName && dob && password) {
                setIsLoggedIn(true);
                // *** NAVIGATION ENABLED ***
                navigate('/parent-dashboard');
            } else {
                setErrorMessage('Authentication Failed. Check student name, DOB, and password.');
            }
        } catch (error) {
            setErrorMessage("An unexpected error occurred during login simulation.");
            console.error('Login error:', error);
        }
        // --- END MOCK AUTHENTICATION ---
    };

    // Reusing responsive classes
    const formClass = `max-w-xs sm:max-w-md w-full p-6 sm:p-8 rounded-3xl shadow-2xl relative z-10 backdrop-blur-sm transform transition-all duration-500 hover:scale-[1.02] ${isUnicornTheme ? 'bg-white/70' : 'bg-gray-800/70 text-white'}`;
    const inputClass = `shadow-inner appearance-none border-2 border-transparent rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-4 transition-all duration-300 ${isUnicornTheme ? 'text-gray-700 bg-white focus:ring-pink-300' : 'text-white bg-gray-700 focus:ring-purple-500'}`;
    const labelClass = `block text-sm font-bold mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-200'}`;
    const buttonClass = `w-full font-bold py-3 px-4 rounded-full focus:outline-none focus:shadow-outline transform transition-all duration-300 hover:scale-[1.03] shadow-lg ${isUnicornTheme ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white hover:from-pink-500 hover:via-purple-500 hover:to-blue-500' : 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white hover:from-blue-600 hover:via-purple-700 hover:to-pink-600'}`;

    return (
        <div className={formClass}>
            <h2 className={`text-3xl font-extrabold text-center mb-2 drop-shadow-md transition-colors duration-500 ${isUnicornTheme ? 'text-purple-800' : 'text-yellow-200'}`}>Parent</h2>
            <p className={`text-center mb-8 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-300'}`}>Sign in to your account</p>
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Student Name */}
                <div>
                    <label className={labelClass} htmlFor="studentName">Student Name</label>
                    <input
                        className={inputClass}
                        id="studentName"
                        type="text"
                        placeholder="Enter your child's name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                    />
                </div>

                {/* Date of Birth */}
                <div>
                    <label className={labelClass} htmlFor="dob">Date of Birth (Student)</label>
                    <input
                        className={`${inputClass} ${isUnicornTheme ? 'text-gray-700' : 'text-gray-300'}`}
                        id="dob"
                        type="date"
                        placeholder="Enter child's DOB"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                    />
                </div>

                {/* Password */}
                <div>
                    <label className={labelClass} htmlFor="password">Password</label>
                    <div className="relative">
                        <input
                            className={inputClass}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-500 ${isUnicornTheme ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-gray-100'}`}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.577 3.01 9.964 7.822a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.577-3.01-9.964-7.822z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Captcha Block (Responsive Layout) */}
                <CaptchaBlock
                    captcha={captcha}
                    setCaptcha={setCaptcha}
                    staticCaptcha={staticCaptcha}
                    handleCaptchaRefresh={handleCaptchaRefresh}
                    isUnicornTheme={isUnicornTheme}
                />

                <div className="pt-2">
                    <button
                        className={buttonClass}
                        type="submit"
                    >
                        Sign In as Parent
                    </button>
                </div>
            </form>
            <AlertMessage message={errorMessage} onClose={() => setErrorMessage('')} isUnicornTheme={isUnicornTheme} />
        </div>
    );
};


const AnimatedBackground = ({ isUnicornTheme }) => {
    // Responsive base classes for size
    const baseEmojiClass = "absolute opacity-70 transition-all duration-1000 text-lg sm:text-2xl md:text-3xl lg:text-4xl";
    const baseBlobClass = "absolute rounded-full mix-blend-multiply filter blur-xl opacity-60 transition-all duration-1000 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80";

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {isUnicornTheme ? (
                <>
                    {/* Floating Emojis and Graphics for Unicorn Theme (Responsive sizes added) */}
                    <span className={`${baseEmojiClass} animate-float-slow`} style={{ top: '10%', left: '15%' }}>🦄</span>
                    <span className={`${baseEmojiClass} animate-float-medium`} style={{ top: '25%', left: '80%' }}>🌈</span>
                    <span className={`${baseEmojiClass} animate-float-fast`} style={{ top: '60%', left: '40%' }}>✨</span>
                    <span className={`${baseEmojiClass} animate-float-slow`} style={{ top: '80%', left: '10%' }}>💖</span>
                    <span className={`${baseEmojiClass} animate-float-medium`} style={{ top: '45%', left: '60%' }}>🍬</span>
                    <span className={`${baseEmojiClass} animate-float-fast`} style={{ top: '5%', left: '50%' }}>🌟</span>
                    <span className={`${baseEmojiClass} animate-float-slow`} style={{ top: '70%', left: '75%' }}>🎈</span>
                    <span className={`${baseEmojiClass} animate-float-medium`} style={{ top: '15%', left: '65%' }}>💖</span>
                    <span className={`${baseEmojiClass} animate-float-fast`} style={{ top: '35%', left: '25%' }}>🌈</span>
                    <span className={`${baseEmojiClass} animate-float-slow`} style={{ top: '55%', left: '85%' }}>✨</span>
                    <span className={`${baseEmojiClass} animate-float-medium`} style={{ top: '88%', left: '45%' }}>🦄</span>
                    <span className={`${baseEmojiClass} animate-float-fast animation-delay-1000`} style={{ top: '10%', right: '10%' }}>🍭</span>
                    <span className={`${baseEmojiClass} animate-float-slow animation-delay-2000`} style={{ top: '30%', right: '25%' }}>🍬</span>
                    <span className={`${baseEmojiClass} animate-float-medium animation-delay-3000`} style={{ top: '50%', left: '10%' }}>🍨</span>
                    <span className={`${baseEmojiClass} animate-float-slow animation-delay-4000`} style={{ top: '70%', right: '5%' }}>🍧</span>
                    <span className={`${baseEmojiClass} animate-float-fast animation-delay-5000`} style={{ top: '90%', left: '20%' }}>🍡</span>

                    {/* Background Blobs (Responsive sizes added) */}
                    <div className={`${baseBlobClass} bg-blue-200 animate-blob`} style={{ top: '15%', left: '10%', transform: 'scale(0.8)' }}></div>
                    <div className={`${baseBlobClass} bg-purple-200 animate-blob animation-delay-2000`} style={{ top: '40%', right: '5%', transform: 'scale(0.9)' }}></div>
                    <div className={`${baseBlobClass} bg-pink-200 animate-blob animation-delay-4000`} style={{ bottom: '10%', left: '25%', transform: 'scale(1.1)' }}></div>
                </>
            ) : (
                <>
                    {/* Floating Emojis and Graphics for Dark Theme (Responsive sizes added) */}
                    <span className={`${baseEmojiClass} animate-float-slow`} style={{ top: '15%', left: '30%' }}>🌌</span>
                    <span className={`${baseEmojiClass} animate-float-medium`} style={{ top: '40%', left: '10%' }}>🚀</span>
                    <span className={`${baseEmojiClass} animate-float-fast`} style={{ top: '50%', left: '80%' }}>🪐</span>
                    <span className={`${baseEmojiClass} animate-float-slow`} style={{ top: '85%', left: '60%' }}>⭐</span>
                    <span className={`${baseEmojiClass} animate-float-medium`} style={{ top: '20%', left: '70%' }}>🌠</span>
                    <span className={`${baseEmojiClass} animate-float-fast`} style={{ top: '75%', left: '30%' }}>🔭</span>
                    <span className={`${baseEmojiClass} animate-float-medium`} style={{ top: '60%', left: '5%' }}>👾</span>
                    <span className={`${baseEmojiClass} animate-float-slow`} style={{ top: '30%', left: '55%' }}>🚀</span>
                    <span className={`${baseEmojiClass} animate-float-fast`} style={{ top: '95%', left: '75%' }}>⭐</span>
                    <span className={`${baseEmojiClass} animate-float-slow`} style={{ top: '5%', left: '5%' }}>🌌</span>

                    {/* Background Blobs (Responsive sizes added, blend-screen for dark theme) */}
                    <div className={`${baseBlobClass} bg-blue-500 mix-blend-screen opacity-40 animate-blob`} style={{ top: '15%', left: '10%', transform: 'scale(0.8)' }}></div>
                    <div className={`${baseBlobClass} bg-purple-500 mix-blend-screen opacity-40 animate-blob animation-delay-2000`} style={{ top: '40%', right: '5%', transform: 'scale(0.9)' }}></div>
                    <div className={`${baseBlobClass} bg-pink-500 mix-blend-screen opacity-40 animate-blob animation-delay-4000`} style={{ bottom: '10%', left: '25%', transform: 'scale(1.1)' }}></div>
                </>
            )}
        </div>
    );
};

// Main Login Component
const Login = ({ setIsLoggedIn, theme }) => {
    const [selectedRole, setSelectedRole] = useState('admin');
    const isUnicornTheme = theme === 'unicorn';
    const bgColor = isUnicornTheme
        ? 'bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100'
        : 'bg-gradient-to-br from-gray-900 via-purple-950 to-blue-950 text-white';

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-1000 ${bgColor}`}>
            <AnimatedBackground isUnicornTheme={isUnicornTheme} />

            <div className="relative z-10 w-full flex flex-col items-center">
                {/* Role Switcher (Max width tied to form width) */}
                <div className={`max-w-xs sm:max-w-md w-full flex justify-center mb-6 backdrop-blur-sm rounded-3xl p-2 shadow-inner transition-all duration-300 ${isUnicornTheme ? 'bg-white/50' : 'bg-gray-800/50'}`}>
                    <button
                        className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-2xl text-base sm:text-lg font-bold transition-all duration-300 transform drop-shadow-sm ${selectedRole === 'admin' ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg scale-[1.05]' : `hover:bg-white/50 ${isUnicornTheme ? 'text-gray-600 hover:text-purple-700' : 'text-gray-200 hover:text-purple-300'}`}`}
                        onClick={() => setSelectedRole('admin')}
                        type="button"
                    >
                        Admin
                    </button>
                    <button
                        className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-2xl text-base sm:text-lg font-bold transition-all duration-300 transform drop-shadow-sm ${selectedRole === 'parent' ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg scale-[1.05]' : `hover:bg-white/50 ${isUnicornTheme ? 'text-gray-600 hover:text-purple-700' : 'text-gray-200 hover:text-purple-300'}`}`}
                        onClick={() => setSelectedRole('parent')}
                        type="button"
                    >
                        Parent
                    </button>
                </div>

                {selectedRole === 'admin'
                    ? <AdminLogin setIsLoggedIn={setIsLoggedIn} isUnicornTheme={isUnicornTheme} />
                    : <ParentLogin setIsLoggedIn={setIsLoggedIn} isUnicornTheme={isUnicornTheme} />
                }

                <div className="mt-6 text-center text-sm">
                    <p className={`transition-colors duration-500 text-xs sm:text-sm ${isUnicornTheme ? 'text-gray-600' : 'text-gray-300'}`}>
                        New User?{' '}
                        <Link to="/register" className={`font-bold transition-colors duration-500 ${isUnicornTheme ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-200'}`}>
                            Register here
                        </Link>
                    </p>
                </div>

            </div>

            <style>
                {/* Global animation styles remain the same */}
                {`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                .animate-float-slow {
                    animation: float 8s ease-in-out infinite;
                }
                .animate-float-medium {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-fast {
                    animation: float 4s ease-in-out infinite;
                }
                @keyframes blob {
                    0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
                }
                .animate-blob {
                    animation: blob 10s ease-in-out infinite;
                }
                .animation-delay-1000 { animation-delay: 1s; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
                .animation-delay-5000 { animation-delay: 5s; }
                `}
            </style>
        </div>
    );
};

export default Login;
