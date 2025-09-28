import React, { useState, useEffect, useMemo } from 'react';

// Component for a custom, state-driven alert message (Fixed position, responsive width)
// Added here for the NutritionTracker to use
const AlertMessage = ({ message, type = 'info', onClose, isUnicornTheme }) => {
    if (!message) return null;

    // Adjusted info color to green for success messages
    const colors = isUnicornTheme ? {
        error: 'bg-red-100 border-red-400 text-red-700',
        info: 'bg-green-100 border-green-400 text-green-700', // Success color for light theme
    } : {
        error: 'bg-red-900 border-red-600 text-red-300',
        info: 'bg-green-900 border-green-600 text-green-300', // Success color for dark theme
    };

    return (
        // Fixed position at bottom right with responsive max width
        <div className={`mt-4 p-3 sm:p-4 rounded-lg border-l-4 ${colors[type]} transition-all duration-300 transform animate-slide-in fixed bottom-4 right-4 max-w-xs sm:max-w-md w-full z-50 shadow-xl`}>
            <div className="flex justify-between items-center">
                <p className="text-sm sm:text-base font-medium">{message}</p>
                <button onClick={onClose} className="text-xl leading-none font-bold ml-4">
                    &times;
                </button>
            </div>
            {/* Added style for slide-in animation */}
            <style jsx="true">{`
                @keyframes slide-in {
                    0% { transform: translateX(100%); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in {
                    animation: slide-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

// Floating Emoji Component (Responsive text size)
const FloatingEmoji = ({ emoji, index }) => {
    // Generate stable positions that don't change on re-renders
    const position = useMemo(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${Math.random() * 5 + 5}s`
    }), []);

    return (
        // Text size reduced for mobile, scales up for larger screens
        <div
            className="absolute text-xl sm:text-2xl md:text-4xl opacity-70 animate-float-spin"
            style={position}
        >
            {emoji}
        </div>
    );
};

// Animated Background Component with stable emoji positions
const AnimatedBackground = ({ isUnicornTheme }) => {
    const floatingEmojis = isUnicornTheme
        ? ['🦄', '🌈', '🌟', '☁️', '🎈', '🍭', '🎀', '💖', '✨', '🌸']
        : ['🌙', '✨', '🪐', '💫', '🚀', '⭐', '☄️', '🔮', '👽', '🌌'];

    const emojis = useMemo(() =>
        Array.from({ length: 40 }).map(() =>
            floatingEmojis[Math.floor(Math.random() * floatingEmojis.length)]
        ), [isUnicornTheme]
    );

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {emojis.map((emoji, index) => (
                <FloatingEmoji
                    key={index}
                    emoji={emoji}
                    index={index}
                />
            ))}
        </div>
    );
};

const NutritionTracker = ({ theme }) => {
    // NOTE: Using localStorage as placeholder. In a real app, replace with Firestore.

    // Using a safe fallback for students, though in a dashboard context they should come from AttendanceTracker's localStorage.
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [mealRecords, setMealRecords] = useState({});
    const [mealType, setMealType] = useState('Breakfast');
    const [mealDetails, setMealDetails] = useState('');

    // Updated alert state to handle message and type for AlertMessage component
    const [alertState, setAlertState] = useState({ message: '', type: 'info' });

    const isUnicornTheme = theme === 'unicorn';
    const bgColor = isUnicornTheme ? 'bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100' : 'bg-gradient-to-br from-gray-900 via-purple-950 to-blue-950 text-white';

    // Responsive Card Classes (Reduced mobile padding)
    const cardClasses = `p-4 sm:p-6 rounded-3xl shadow-lg transition-all duration-500 transform hover:scale-[1.01] border-4 border-white border-opacity-60`;
    const cardBgColor = isUnicornTheme ? 'bg-white/50 backdrop-blur-sm' : 'bg-gray-800/50 backdrop-blur-sm text-white';
    const textColor = isUnicornTheme ? 'text-gray-700' : 'text-gray-300';
    const headerColor = isUnicornTheme ? 'text-purple-800' : 'text-yellow-200';
    const subHeadingColor = isUnicornTheme ? 'text-blue-700' : 'text-purple-300';

    // Responsive Button Classes (Reduced mobile size)
    const buttonBaseClasses = `px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg font-bold transition-all duration-300 transform hover:scale-105`;

    // Responsive Input Classes
    const inputClasses = `w-full p-2 sm:p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300`;

    // Load students (from shared store) and nutrition data from localStorage
    useEffect(() => {
        // Fetches students from the same storage key used by AttendanceTracker
        const savedStudents = JSON.parse(localStorage.getItem('anganwadiStudents')) || [];
        const savedMeals = JSON.parse(localStorage.getItem('playschoolNutritionRecords')) || {};

        if (savedStudents.length > 0) {
            setStudents(savedStudents);
        }

        setMealRecords(savedMeals);
    }, []);

    // Save meal records to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('playschoolNutritionRecords', JSON.stringify(mealRecords));
    }, [mealRecords]);

    // Record a meal for the selected student
    const recordMeal = (e) => {
        e.preventDefault();
        setAlertState({ message: '', type: 'info' }); // Clear previous alerts

        if (!selectedStudent || !mealDetails) {
            setAlertState({ message: 'Please select a child and enter meal details.', type: 'error' });
            return;
        }

        const record = {
            mealType,
            mealDetails,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        };

        setMealRecords(prev => {
            const newRecords = { ...prev };
            if (!newRecords[selectedStudent]) {
                newRecords[selectedStudent] = [];
            }
            newRecords[selectedStudent].push(record);
            return newRecords;
        });

        // Reset form fields
        setMealDetails('');
        setMealType('Breakfast');
        setAlertState({ message: 'Meal recorded successfully!', type: 'info' });
    };

    // Helper function to get the student name from their ID
    const getStudentName = (studentId) => {
        // Note: student IDs are stored as numbers, selectedStudent is a string.
        const student = students.find(s => s.id.toString() === studentId);
        return student ? student.name : 'Selected Child';
    };

    const studentRecords = selectedStudent ? mealRecords[selectedStudent] || [] : [];

    // Reverse records for display (newest first)
    const reversedStudentRecords = [...studentRecords].reverse();

    return (
        <div className={`font-sans min-h-screen transition-all duration-1000 ${bgColor} relative`}>
            <AnimatedBackground isUnicornTheme={isUnicornTheme} />
            <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
                {/* Main Heading (Responsive) */}
                <h1 className={`text-3xl sm:text-4xl font-extrabold text-center mb-6 drop-shadow-md transition-colors duration-500 ${headerColor}`}>
                    🍎 Nutrition Tracker
                </h1>

                {/* Student Selection (Card) */}
                <div className={`${cardClasses} ${cardBgColor}`}>
                    <h2 className={`text-xl font-semibold mb-4 ${subHeadingColor}`}>Select Child</h2>
                    <select
                        value={selectedStudent}
                        onChange={(e) => {
                            setSelectedStudent(e.target.value);
                            setAlertState({ message: '', type: 'info' });
                        }}
                        className={`${inputClasses} ${isUnicornTheme ? 'bg-white border border-gray-300 text-gray-700 focus:ring-pink-300' : 'bg-gray-700 border border-gray-600 text-white focus:ring-purple-500'}`}
                    >
                        <option value="" className={isUnicornTheme ? 'text-gray-400' : 'text-gray-400'}>
                            {students.length === 0 ? 'No students available' : 'Choose a child'}
                        </option>
                        {students.map(student => (
                            <option key={student.id} value={student.id.toString()} className={textColor}>
                                {student.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedStudent && (
                    <>
                        {/* Log New Meal Form (Responsive) */}
                        <div className={`${cardClasses} ${cardBgColor} mt-6`}>
                            <h2 className={`text-xl font-semibold mb-4 ${subHeadingColor}`}>Log a New Meal for {getStudentName(selectedStudent)}</h2>
                            <form onSubmit={recordMeal} className="space-y-4">
                                <div>
                                    <label htmlFor="mealType" className={`block font-medium mb-1 text-sm ${textColor}`}>Meal Type</label>
                                    <select
                                        id="mealType"
                                        value={mealType}
                                        onChange={(e) => setMealType(e.target.value)}
                                        className={`${inputClasses} ${isUnicornTheme ? 'bg-white border border-gray-300 text-gray-700 focus:ring-pink-300' : 'bg-gray-700 border border-gray-600 text-white focus:ring-purple-500'}`}
                                    >
                                        {/* Class applied to select/input only */}
                                        <option>Breakfast</option>
                                        <option>Lunch</option>
                                        <option>Snack</option>
                                        <option>Dinner</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="mealDetails" className={`block font-medium mb-1 text-sm ${textColor}`}>Meal Details</label>
                                    <textarea
                                        id="mealDetails"
                                        value={mealDetails}
                                        onChange={(e) => setMealDetails(e.target.value)}
                                        placeholder="e.g., Apple slices, milk, and a cheese sandwich."
                                        rows="3"
                                        className={`${inputClasses} ${isUnicornTheme ? 'bg-white border border-gray-300 text-gray-700 focus:ring-pink-300' : 'bg-gray-700 border border-gray-600 text-white focus:ring-purple-500'}`}
                                        required
                                    />
                                </div>
                                <button type="submit" className={`w-full ${buttonBaseClasses} bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 shadow-lg`}>
                                    Record Meal
                                </button>
                            </form>
                        </div>
                    </>
                )}

                {/* Meal History */}
                <div className={`${cardClasses} ${cardBgColor} mt-6`}>
                    <h2 className={`text-xl font-semibold mb-4 ${subHeadingColor}`}>Meal History for {getStudentName(selectedStudent)}</h2>

                    {!selectedStudent ? (
                        <p className={textColor}>Please select a child to view their nutrition history.</p>
                    ) : studentRecords.length === 0 ? (
                        <p className={textColor}>No meal records found for this child.</p>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-white/50">
                            <table className="w-full table-auto text-left">
                                <thead>
                                    <tr className={`border-b-2 transition-colors duration-500 ${isUnicornTheme ? 'border-gray-300' : 'border-gray-700'} text-xs sm:text-sm`}>
                                        <th className={`px-3 py-2 sm:px-4 sm:py-2 font-bold ${subHeadingColor} w-20`}>Date/Time</th>
                                        <th className={`px-3 py-2 sm:px-4 sm:py-2 font-bold ${subHeadingColor} w-24`}>Type</th>
                                        <th className={`px-3 py-2 sm:px-4 sm:py-2 font-bold ${subHeadingColor}`}>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reversedStudentRecords.map((record, index) => (
                                        <tr key={index} className={`border-b transition-colors duration-500 ${isUnicornTheme ? 'border-gray-200 hover:bg-gray-50/50' : 'border-gray-800 hover:bg-gray-700/50'}`}>
                                            <td className={`px-3 py-2 text-xs sm:text-sm ${textColor}`}>
                                                {new Date(record.date).toLocaleDateString('en-IN')}<br />
                                                <span className="font-semibold">{record.time}</span>
                                            </td>
                                            <td className={`px-3 py-2 text-xs sm:text-sm ${textColor}`}>{record.mealType}</td>
                                            <td className={`px-3 py-2 text-xs sm:text-sm ${textColor} max-w-xs`}>{record.mealDetails}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Alert Message component call */}
            <AlertMessage
                message={alertState.message}
                type={alertState.type}
                onClose={() => setAlertState({ message: '', type: 'info' })}
                isUnicornTheme={isUnicornTheme}
            />

            {/* Custom CSS for animations */}
            <style>
                {`
                @keyframes float-spin {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(360deg); }
                    100% { transform: translateY(0px) rotate(720deg); }
                }
                .animate-float-spin {
                    animation: float-spin var(--animation-duration, 8s) ease-in-out infinite;
                }
                @keyframes pop-in {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                `}
            </style>
        </div>
    );
};

export default NutritionTracker;
