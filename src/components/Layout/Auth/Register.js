import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Functions moved outside the component to prevent re-creation on re-render
const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const speakCaptcha = (text) => {
    const utterance = new SpeechSynthesisUtterance(text.split('').join(' '));
    window.speechSynthesis.speak(utterance);
};

// Component for a custom, state-driven alert message
const AlertMessage = ({ message, type = 'error', onClose, isUnicornTheme }) => {
    if (!message) return null;

    const colors = isUnicornTheme ? {
        error: 'bg-red-100 border-red-400 text-red-700',
        info: 'bg-blue-100 border-blue-400 text-blue-700',
    } : {
        error: 'bg-red-900 border-red-600 text-red-300',
        info: 'bg-blue-900 border-blue-600 text-blue-300',
    };

    return (
        <div className={`mt-4 p-4 rounded-lg border-l-4 ${colors[type]} transition-all duration-300 transform scale-100 animate-slide-in`}>
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium">{message}</p>
                <button onClick={onClose} className="text-xl leading-none font-bold ml-4">
                    x
                </button>
            </div>
        </div>
    );
};

// Sub-component for Admin Registration form
const AdminRegister = ({ isUnicornTheme }) => {
    const [fullName, setFullName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userCaptcha, setUserCaptcha] = useState('');
    const [captcha, setCaptcha] = useState(generateCaptcha());
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setPasswordsMatch(password === confirmPassword && password.length > 0);
    }, [password, confirmPassword]);

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength({
            length: newPassword.length >= 8,
            uppercase: /[A-Z]/.test(newPassword),
            lowercase: /[a-z]/.test(newPassword),
            number: /[0-9]/.test(newPassword),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
        });
    };

    const handleRefreshCaptcha = () => {
        setCaptcha(generateCaptcha());
        setUserCaptcha('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!/^\d{5}$/.test(employeeId)) {
            setErrorMessage("Employee ID must be a 5-digit number.");
            return;
        }

        if (!email.endsWith("@gmail.com")) {
            setErrorMessage("Email must be a @gmail.com address.");
            return;
        }

        if (userCaptcha.toLowerCase() !== captcha.toLowerCase()) {
            setErrorMessage("Incorrect Captcha. Please try again.");
            handleRefreshCaptcha();
            return;
        }

        if (!passwordsMatch || !Object.values(passwordStrength).every(Boolean)) {
            setErrorMessage("Please ensure passwords match and meet all complexity requirements.");
            return;
        }

        console.log('Admin Registration Data:', { fullName, employeeId, email, password });
        navigate('/login');
    };

    const passwordRequirementsList = [
        { name: "At least 8 characters", condition: passwordStrength.length },
        { name: "An uppercase letter", condition: passwordStrength.uppercase },
        { name: "A lowercase letter", condition: passwordStrength.lowercase },
        { name: "A number", condition: passwordStrength.number },
        { name: "A special character", condition: passwordStrength.specialChar },
    ];

    return (
        <div className={`max-w-xl w-full p-8 rounded-3xl shadow-2xl relative z-10 backdrop-blur-sm transform transition-all duration-500 hover:scale-105 ${isUnicornTheme ? 'bg-white/50' : 'bg-gray-800/50 text-white'}`}>
            <h2 className={`text-3xl font-extrabold text-center mb-2 drop-shadow-md transition-colors duration-500 ${isUnicornTheme ? 'text-purple-800' : 'text-yellow-200'}`}>Playschool Admin</h2>
            <p className={`text-center mb-8 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-300'}`}>Register as a new administrator</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-200'}`} htmlFor="fullName">Full Name</label>
                    <input
                        className={`shadow-inner appearance-none border-2 border-transparent rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-4 transition-all duration-300 ${isUnicornTheme ? 'text-gray-700 bg-white focus:ring-pink-300' : 'text-white bg-gray-700 focus:ring-purple-500'}`}
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-200'}`} htmlFor="employeeId">Employee ID</label>
                    <input
                        className={`shadow-inner appearance-none border-2 border-transparent rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-4 transition-all duration-300 ${isUnicornTheme ? 'text-gray-700 bg-white focus:ring-pink-300' : 'text-white bg-gray-700 focus:ring-purple-500'}`}
                        id="employeeId"
                        type="tel"
                        placeholder="Enter your 5-digit employee ID"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value.replace(/\D/g, '').slice(0, 5))}
                        required
                    />
                </div>
                <div>
                    <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-200'}`} htmlFor="email">Email Address</label>
                    <input
                        className={`shadow-inner appearance-none border-2 border-transparent rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-4 transition-all duration-300 ${isUnicornTheme ? 'text-gray-700 bg-white focus:ring-pink-300' : 'text-white bg-gray-700 focus:ring-purple-500'}`}
                        id="email"
                        type="email"
                        placeholder="Enter your @gmail.com address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-200'}`} htmlFor="password">Password</label>
                    <div className="relative">
                        <input
                            className={`shadow-inner appearance-none border-2 border-transparent rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-4 transition-all duration-300 ${isUnicornTheme ? 'text-gray-700 bg-white focus:ring-pink-300' : 'text-white bg-gray-700 focus:ring-purple-500'}`}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            value={password}
                            onChange={handlePasswordChange}
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
                    <div className="mt-2 text-sm transition-colors duration-500">
                        <p className={`font-bold ${isUnicornTheme ? 'text-gray-500' : 'text-gray-400'}`}>Password must contain:</p>
                        <ul className="list-disc list-inside mt-1">
                            {passwordRequirementsList.map((item, index) => (
                                <li key={index} className={item.condition ? "text-green-500" : (isUnicornTheme ? "text-red-500" : "text-red-400")}>
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div>
                    <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-200'}`} htmlFor="confirmPassword">Confirm Password</label>
                    <div className="relative">
                        <input
                            className={`shadow-inner appearance-none border-2 rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-4 transition-all duration-300 ${passwordsMatch ? 'border-green-500' : (isUnicornTheme ? 'border-gray-300' : 'border-gray-600')} ${isUnicornTheme ? 'text-gray-700 bg-white focus:ring-pink-300' : 'text-white bg-gray-700 focus:ring-purple-500'}`}
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-500 ${isUnicornTheme ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-gray-100'}`}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.577 3.01 9.964 7.822a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.577-3.01-9.964-7.822z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                    {confirmPassword.length > 0 && (
                        <p className={`mt-2 text-sm transition-colors duration-500 ${passwordsMatch ? 'text-green-500' : (isUnicornTheme ? 'text-red-500' : 'text-red-400')}`}>
                            {passwordsMatch ? "Passwords match!" : "Passwords do not match."}
                        </p>
                    )}
                </div>
                <div>
                    <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-200'}`} htmlFor="captcha">Captcha Code</label>
                    <div className="flex items-center space-x-4 mb-2">
                        <div className={`flex-1 font-extrabold text-lg text-center py-3 rounded-lg border-2 select-none tracking-widest drop-shadow-sm transition-colors duration-500 ${isUnicornTheme ? 'bg-white/50 text-purple-800 border-purple-200' : 'bg-gray-700/50 text-yellow-200 border-purple-800'}`}>
                            {captcha}
                        </div>
                        <button type="button" onClick={handleRefreshCaptcha} className={`p-3 rounded-lg transition-colors duration-500 ${isUnicornTheme ? 'bg-white/50 hover:bg-white/70 text-purple-700' : 'bg-gray-700/50 hover:bg-gray-700/70 text-yellow-300'}`} aria-label="Refresh Captcha">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356-2A8.001 8.001 0 004 15.54a8.001 8.001 0 0015.356-2m-1.879-6l-2.658 2.658A4 4 0 1114 13.5l1.658-1.658a2 2 0 002.828 0" />
                            </svg>
                        </button>
                        <button type="button" onClick={() => speakCaptcha(captcha)} className={`p-3 rounded-lg transition-colors duration-500 ${isUnicornTheme ? 'bg-white/50 hover:bg-white/70 text-purple-700' : 'bg-gray-700/50 hover:bg-gray-700/70 text-yellow-300'}`} aria-label="Speak Captcha">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0a2 2 0 002 2H5a2 2 0 00-2-2m0 0a2 2 0 012-2h12a2 2 0 012 2m0 0v2" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7" />
                            </svg>
                        </button>
                        <input
                            className={`flex-1 shadow-inner appearance-none border-2 border-transparent rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-4 transition-all duration-300 ${isUnicornTheme ? 'text-gray-700 bg-white focus:ring-pink-300' : 'text-white bg-gray-700 focus:ring-purple-500'}`}
                            id="captcha"
                            type="text"
                            placeholder="Enter Captcha"
                            value={userCaptcha}
                            onChange={(e) => setUserCaptcha(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className={`w-full font-bold py-3 px-4 rounded-full focus:outline-none focus:shadow-outline transform transition-all duration-300 hover:scale-105 shadow-lg ${isUnicornTheme ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white hover:from-pink-500 hover:via-purple-500 hover:to-blue-500' : 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white hover:from-blue-600 hover:via-purple-700 hover:to-pink-600'}`}
                        type="submit"
                    >
                        Register
                    </button>
                </div>
            </form>
            <AlertMessage message={errorMessage} onClose={() => setErrorMessage('')} isUnicornTheme={isUnicornTheme} />
        </div>
    );
};

// Sub-component for Parent Registration form
const ParentRegister = ({ isUnicornTheme }) => {
    const [studentName, setStudentName] = useState('');
    const [parentName, setParentName] = useState('');
    const [dob, setDob] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userCaptcha, setUserCaptcha] = useState('');
    const [captcha, setCaptcha] = useState(generateCaptcha());
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setPasswordsMatch(password === confirmPassword && password.length > 0);
    }, [password, confirmPassword]);

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength({
            length: newPassword.length >= 8,
            uppercase: /[A-Z]/.test(newPassword),
            lowercase: /[a-z]/.test(newPassword),
            number: /[0-9]/.test(newPassword),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
        });
    };

    const handleRefreshCaptcha = () => {
        setCaptcha(generateCaptcha());
        setUserCaptcha('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!email.endsWith("@gmail.com")) {
            setErrorMessage("Email must be a @gmail.com address.");
            return;
        }

        if (userCaptcha.toLowerCase() !== captcha.toLowerCase()) {
            setErrorMessage("Incorrect Captcha. Please try again.");
            handleRefreshCaptcha();
            return;
        }

        if (!passwordsMatch || !Object.values(passwordStrength).every(Boolean)) {
            setErrorMessage("Please ensure passwords match and meet all complexity requirements.");
            return;
        }

        console.log('Parent Registration Data:', { studentName, parentName, dob, mobileNumber, email, password });
        navigate('/login');
    };

    const passwordRequirementsList = [
        { name: "At least 8 characters", condition: passwordStrength.length },
        { name: "An uppercase letter", condition: passwordStrength.uppercase },
        { name: "A lowercase letter", condition: passwordStrength.lowercase },
        { name: "A number", condition: passwordStrength.number },
        { name: "A special character", condition: passwordStrength.specialChar },
    ];

    return (
        <div className={`max-w-xl w-full mx-auto p-8 rounded-3xl shadow-2xl relative z-10 backdrop-blur-sm transform transition-all duration-500 hover:scale-105 ${isUnicornTheme ? 'bg-white/50' : 'bg-gray-800/50 text-white'}`}>
            <h2 className={`text-3xl font-extrabold text-center mb-2 drop-shadow-md transition-colors duration-500 ${isUnicornTheme ? 'text-purple-800' : 'text-yellow-200'}`}>Parent</h2>
            <p className={`text-center mb-8 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-300'}`}>Register as a new parent</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-200'}`} htmlFor="studentName">Student Name</label>
                    <input
                        className={`shadow-inner appearance-none border-2 border-transparent rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-4 transition-all duration-300 ${isUnicornTheme ? 'text-gray-700 bg-white focus:ring-pink-300' : 'text-white bg-gray-700 focus:ring-purple-500'}`}
                        id="studentName"
                        type="text"
                        placeholder="Enter your child's name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-200'}`} htmlFor="parentName">Parent Name</label>
                    <input
                        className={`shadow-inner appearance-none border-2 border-transparent rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-4 transition-all duration-300 ${isUnicornTheme ? 'text-gray-700 bg-white focus:ring-pink-300' : 'text-white bg-gray-700 focus:ring-purple-500'}`}
                        id="parentName"
                        type="text"
                        placeholder="Enter your full name"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-200'}`} htmlFor="dob">Date of Birth (Student)</label>
                    <input
                        className={`shadow-inner appearance-none border-2 border-transparent rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-4 transition-all duration-300 ${isUnicornTheme ? 'text-gray-700 bg-white focus:ring-pink-300' : 'text-white bg-gray-700 focus:ring-purple-500'}`}
                        id="dob"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-200'}`} htmlFor="mobileNumber">Mobile Number</label>
                    <input
                        className={`shadow-inner appearance-none border-2 border-transparent rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-4 transition-all duration-300 ${isUnicornTheme ? 'text-gray-700 bg-white focus:ring-pink-300' : 'text-white bg-gray-700 focus:ring-purple-500'}`}
                        id="mobileNumber"
                        type="tel"
                        placeholder="Enter your mobile number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-200'}`} htmlFor="email">Email Address</label>
                    <input
                        className={`shadow-inner appearance-none border-2 border-transparent rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-4 transition-all duration-300 ${isUnicornTheme ? 'text-gray-700 bg-white focus:ring-pink-300' : 'text-white bg-gray-700 focus:ring-purple-500'}`}
                        id="email"
                        type="email"
                        placeholder="Enter your @gmail.com address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-200'}`} htmlFor="password">Password</label>
                    <div className="relative">
                        <input
                            className={`shadow-inner appearance-none border-2 border-transparent rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-4 transition-all duration-300 ${isUnicornTheme ? 'text-gray-700 bg-white focus:ring-pink-300' : 'text-white bg-gray-700 focus:ring-purple-500'}`}
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            value={password}
                            onChange={handlePasswordChange}
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
                    <div className="mt-2 text-sm transition-colors duration-500">
                        <p className={`font-bold ${isUnicornTheme ? 'text-gray-500' : 'text-gray-400'}`}>Password must contain:</p>
                        <ul className="list-disc list-inside mt-1">
                            {passwordRequirementsList.map((item, index) => (
                                <li key={index} className={item.condition ? "text-green-500" : (isUnicornTheme ? "text-red-500" : "text-red-400")}>
                                    {item.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div>
                    <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-200'}`} htmlFor="confirmPassword">Confirm Password</label>
                    <div className="relative">
                        <input
                            className={`shadow-inner appearance-none border-2 rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-4 transition-all duration-300 ${passwordsMatch ? 'border-green-500' : (isUnicornTheme ? 'border-gray-300' : 'border-gray-600')} ${isUnicornTheme ? 'text-gray-700 bg-white focus:ring-pink-300' : 'text-white bg-gray-700 focus:ring-purple-500'}`}
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-500 ${isUnicornTheme ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-gray-100'}`}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.577 3.01 9.964 7.822a1.012 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.577-3.01-9.964-7.822z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                    {confirmPassword.length > 0 && (
                        <p className={`mt-2 text-sm transition-colors duration-500 ${passwordsMatch ? 'text-green-500' : (isUnicornTheme ? 'text-red-500' : 'text-red-400')}`}>
                            {passwordsMatch ? "Passwords match!" : "Passwords do not match."}
                        </p>
                    )}
                </div>
                <div>
                    <label className={`block text-sm font-bold mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-700' : 'text-gray-200'}`} htmlFor="captcha">Captcha Code</label>
                    <div className="flex items-center space-x-4 mb-2">
                        <div className={`flex-1 font-extrabold text-lg text-center py-3 rounded-lg border-2 select-none tracking-widest drop-shadow-sm transition-colors duration-500 ${isUnicornTheme ? 'bg-white/50 text-purple-800 border-purple-200' : 'bg-gray-700/50 text-yellow-200 border-purple-800'}`}>
                            {captcha}
                        </div>
                        <button type="button" onClick={handleRefreshCaptcha} className={`p-3 rounded-lg transition-colors duration-500 ${isUnicornTheme ? 'bg-white/50 hover:bg-white/70 text-purple-700' : 'bg-gray-700/50 hover:bg-gray-700/70 text-yellow-300'}`} aria-label="Refresh Captcha">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356-2A8.001 8.001 0 004 15.54a8.001 8.001 0 0015.356-2m-1.879-6l-2.658 2.658A4 4 0 1114 13.5l1.658-1.658a2 2 0 002.828 0" />
                            </svg>
                        </button>
                        <button type="button" onClick={() => speakCaptcha(captcha)} className={`p-3 rounded-lg transition-colors duration-500 ${isUnicornTheme ? 'bg-white/50 hover:bg-white/70 text-purple-700' : 'bg-gray-700/50 hover:bg-gray-700/70 text-yellow-300'}`} aria-label="Speak Captcha">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0a2 2 0 002 2H5a2 2 0 00-2-2m0 0a2 2 0 012-2h12a2 2 0 012 2m0 0v2" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7" />
                            </svg>
                        </button>
                        <input
                            className={`flex-1 shadow-inner appearance-none border-2 border-transparent rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-4 transition-all duration-300 ${isUnicornTheme ? 'text-gray-700 bg-white focus:ring-pink-300' : 'text-white bg-gray-700 focus:ring-purple-500'}`}
                            id="captcha"
                            type="text"
                            placeholder="Enter Captcha"
                            value={userCaptcha}
                            onChange={(e) => setUserCaptcha(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className={`w-full font-bold py-3 px-4 rounded-full focus:outline-none focus:shadow-outline transform transition-all duration-300 hover:scale-105 shadow-lg ${isUnicornTheme ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white hover:from-pink-500 hover:via-purple-500 hover:to-blue-500' : 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white hover:from-blue-600 hover:via-purple-700 hover:to-pink-600'}`}
                        type="submit"
                    >
                        Register
                    </button>
                </div>
            </form>
            <AlertMessage message={errorMessage} onClose={() => setErrorMessage('')} isUnicornTheme={isUnicornTheme} />
        </div>
    );
};

const AnimatedBackground = ({ isUnicornTheme }) => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {isUnicornTheme ? (
                <>
                    {/* Floating Emojis and Graphics for Unicorn Theme */}
                    <span className="absolute text-4xl opacity-80 animate-float-slow" style={{ top: '10%', left: '15%' }}>🦄</span>
                    <span className="absolute text-3xl opacity-70 animate-float-medium" style={{ top: '25%', left: '80%' }}>🌈</span>
                    <span className="absolute text-2xl opacity-60 animate-float-fast" style={{ top: '60%', left: '40%' }}>✨</span>
                    <span className="absolute text-5xl opacity-80 animate-float-slow" style={{ top: '80%', left: '10%' }}>💖</span>
                    <span className="absolute text-3xl opacity-70 animate-float-medium" style={{ top: '45%', left: '60%' }}>🍬</span>
                    <span className="absolute text-4xl opacity-90 animate-float-fast" style={{ top: '5%', left: '50%' }}>🌟</span>
                    <span className="absolute text-3xl opacity-80 animate-float-slow" style={{ top: '70%', left: '75%' }}>🎈</span>
                    <span className="absolute text-xl opacity-60 animate-float-medium" style={{ top: '15%', left: '65%' }}>💖</span>
                    <span className="absolute text-2xl opacity-70 animate-float-fast" style={{ top: '35%', left: '25%' }}>🌈</span>
                    <span className="absolute text-3xl opacity-80 animate-float-slow" style={{ top: '55%', left: '85%' }}>✨</span>
                    <span className="absolute text-4xl opacity-70 animate-float-medium" style={{ top: '88%', left: '45%' }}>🦄</span>
                    {/* New emojis and animations added here */}
                    <span className="absolute text-3xl opacity-75 animate-float-fast animation-delay-1000" style={{ top: '10%', right: '10%' }}>🍭</span>
                    <span className="absolute text-2xl opacity-65 animate-float-slow animation-delay-2000" style={{ top: '30%', right: '25%' }}>🍬</span>
                    <span className="absolute text-4xl opacity-85 animate-float-medium animation-delay-3000" style={{ top: '50%', left: '10%' }}>🍨</span>
                    <span className="absolute text-xl opacity-70 animate-float-slow animation-delay-4000" style={{ top: '70%', right: '5%' }}>🍧</span>
                    <span className="absolute text-5xl opacity-90 animate-float-fast animation-delay-5000" style={{ top: '90%', left: '20%' }}>🍡</span>
                    <span className="absolute text-3xl opacity-80 animate-float-medium animation-delay-6000" style={{ top: '20%', left: '5%' }}>🎂</span>
                    <span className="absolute text-4xl opacity-75 animate-float-slow animation-delay-7000" style={{ top: '40%', right: '15%' }}>🍰</span>
                    <span className="absolute text-2xl opacity-65 animate-float-fast animation-delay-8000" style={{ top: '5%', left: '85%' }}>🧁</span>
                    <span className="absolute text-5xl opacity-85 animate-float-medium animation-delay-9000" style={{ top: '65%', left: '70%' }}>🍫</span>
                    <span className="absolute text-3xl opacity-90 animate-float-slow animation-delay-10000" style={{ top: '80%', right: '35%' }}>💗</span>
                    <span className="absolute text-2xl opacity-85 animate-float-fast animation-delay-11000" style={{ top: '5%', left: '5%' }}>💓</span>
                    <span className="absolute text-3xl opacity-70 animate-float-medium animation-delay-12000" style={{ top: '90%', left: '90%' }}>💖</span>
                    <span className="absolute text-xl opacity-60 animate-float-slow animation-delay-13000" style={{ top: '75%', right: '80%' }}>🌈</span>
                    <span className="absolute text-4xl opacity-80 animate-float-fast animation-delay-14000" style={{ top: '40%', left: '50%' }}>🌟</span>
                    <span className="absolute text-xl opacity-90 animate-float-medium animation-delay-15000" style={{ top: '20%', right: '50%' }}>❄</span>
                </>
            ) : (
                <>
                    {/* Floating Emojis and Graphics for Moon Theme */}
                    <span className="absolute text-3xl opacity-80 animate-float-slow" style={{ top: '15%', left: '30%' }}>🌌</span>
                    <span className="absolute text-4xl opacity-70 animate-float-medium" style={{ top: '40%', left: '10%' }}>🚀</span>
                    <span className="absolute text-2xl opacity-60 animate-float-fast" style={{ top: '50%', left: '80%' }}>🪐</span>
                    <span className="absolute text-5xl opacity-80 animate-float-slow" style={{ top: '85%', left: '60%' }}>⭐</span>
                    <span className="absolute text-3xl opacity-70 animate-float-medium" style={{ top: '20%', left: '70%' }}>🌠</span>
                    <span className="absolute text-4xl opacity-90 animate-float-fast" style={{ top: '75%', left: '30%' }}>🔭</span>
                    <span className="absolute text-3xl opacity-80 animate-float-medium" style={{ top: '60%', left: '5%' }}>👾</span>
                    <span className="absolute text-xl opacity-60 animate-float-slow" style={{ top: '30%', left: '55%' }}>🚀</span>
                    <span className="absolute text-2xl opacity-70 animate-float-medium" style={{ top: '70%', left: '20%' }}>🪐</span>
                    <span className="absolute text-3xl opacity-80 animate-float-fast" style={{ top: '95%', left: '75%' }}>⭐</span>
                    <span className="absolute text-4xl opacity-70 animate-float-slow" style={{ top: '5%', left: '5%' }}>🌌</span>
                    {/* New emojis and animations added here */}
                    <span className="absolute text-5xl opacity-90 animate-float-medium animation-delay-1000" style={{ top: '10%', right: '10%' }}>☄</span>
                    <span className="absolute text-4xl opacity-85 animate-float-slow animation-delay-2000" style={{ top: '30%', right: '25%' }}>🌠</span>
                    <span className="absolute text-3xl opacity-80 animate-float-fast animation-delay-3000" style={{ top: '50%', left: '15%' }}>🌜</span>
                    <span className="absolute text-2xl opacity-70 animate-float-medium animation-delay-4000" style={{ top: '70%', right: '5%' }}>✨</span>
                    <span className="absolute text-xl opacity-60 animate-float-slow animation-delay-5000" style={{ top: '90%', left: '20%' }}>🌟</span>
                    <span className="absolute text-5xl opacity-90 animate-float-fast animation-delay-6000" style={{ top: '20%', left: '5%' }}>💖</span>
                    <span className="absolute text-3xl opacity-85 animate-float-medium animation-delay-7000" style={{ top: '40%', right: '15%' }}>💗</span>
                    <span className="absolute text-4xl opacity-80 animate-float-slow animation-delay-8000" style={{ top: '5%', left: '85%' }}>💓</span>
                    <span className="absolute text-2xl opacity-75 animate-float-fast animation-delay-9000" style={{ top: '65%', left: '70%' }}>🌌</span>
                    <span className="absolute text-xl opacity-65 animate-float-medium animation-delay-10000" style={{ top: '80%', right: '35%' }}>🚀</span>
                    <span className="absolute text-3xl opacity-90 animate-float-slow animation-delay-11000" style={{ top: '5%', left: '5%' }}>🪐</span>
                    <span className="absolute text-4xl opacity-80 animate-float-fast animation-delay-12000" style={{ top: '90%', left: '90%' }}>☄</span>
                    <span className="absolute text-5xl opacity-70 animate-float-medium animation-delay-13000" style={{ top: '75%', right: '80%' }}>🌠</span>
                    <span className="absolute text-3xl opacity-95 animate-float-slow animation-delay-14000" style={{ top: '40%', left: '50%' }}>🌜</span>
                    <span className="absolute text-2xl opacity-85 animate-float-fast animation-delay-15000" style={{ top: '20%', right: '50%' }}>✨</span>
                </>
            )}
            {/* Themed background blobs for both light and dark modes */}
            {isUnicornTheme ? (
                <>
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </>
            ) : (
                <>
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-xl opacity-50 animate-blob"></div>
                    <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-500 rounded-full mix-blend-screen filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
                </>
            )}
        </div>
    );
};

// Main Register Component
const Register = ({ theme }) => {
    const [selectedRole, setSelectedRole] = useState('admin');
    const isUnicornTheme = theme === 'unicorn';
    const bgColor = isUnicornTheme ? 'bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100' : 'bg-gradient-to-br from-gray-900 via-purple-950 to-blue-950 text-white';

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-1000 ${bgColor}`}>
            <AnimatedBackground isUnicornTheme={isUnicornTheme} />

            <div className="relative z-10 w-full flex flex-col items-center">
                {/* Role Selection Tabs */}
                <div className={`max-w-xl w-full flex justify-center mb-6 backdrop-blur-sm rounded-3xl p-2 shadow-inner transition-all duration-300 ${isUnicornTheme ? 'bg-white/50' : 'bg-gray-800/50'}`}>
                    <button
                        className={`flex-1 py-3 px-4 rounded-2xl text-lg font-bold transition-all duration-300 transform drop-shadow-sm ${selectedRole === 'admin' ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg scale-105' : `hover:bg-white/50 ${isUnicornTheme ? 'text-gray-600 hover:text-purple-700' : 'text-gray-200 hover:text-purple-300'}`}`}
                        onClick={() => setSelectedRole('admin')}
                        type="button"
                    >
                        Playschool Admin
                    </button>
                    <button
                        className={`flex-1 py-3 px-4 rounded-2xl text-lg font-bold transition-all duration-300 transform drop-shadow-sm ${selectedRole === 'parent' ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-lg scale-105' : `hover:bg-white/50 ${isUnicornTheme ? 'text-gray-600 hover:text-purple-700' : 'text-gray-200 hover:text-purple-300'}`}`}
                        onClick={() => setSelectedRole('parent')}
                        type="button"
                    >
                        Parent
                    </button>
                </div>

                {selectedRole === 'admin' ? <AdminRegister isUnicornTheme={isUnicornTheme} /> : <ParentRegister isUnicornTheme={isUnicornTheme} />}

                {/* Login Link */}
                <div className="mt-6 text-center text-sm">
                    <p className={`transition-colors duration-500 ${isUnicornTheme ? 'text-gray-600' : 'text-gray-300'}`}>
                        Already have an account?{' '}
                        <Link to="/login" className={`font-bold transition-colors duration-500 ${isUnicornTheme ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-200'}`}>
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;