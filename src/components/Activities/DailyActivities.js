import React, { useState, useEffect, useMemo } from 'react';

// Component for a custom, state-driven alert message (Fixed position, responsive width)
const AlertMessage = ({ message, type = 'info', onClose, isUnicornTheme }) => {
    if (!message) return null;

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
const FloatingEmoji = ({ emoji }) => {
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
                />
            ))}
        </div>
    );
};

const DailyActivities = ({ theme }) => {
    const [dailyActivities, setDailyActivities] = useState({});
    const [currentDate] = useState(new Date()); // Use useState for stability
    const [todayActivities, setTodayActivities] = useState({
        morning_session: '',
        midday_session: '',
        afternoon_session: '',
        special_event: ''
    });
    // Use an object for alert messages, similar to the other components for consistency
    const [alertState, setAlertState] = useState({ message: '', type: 'info' });

    const isUnicornTheme = theme === 'unicorn';
    const bgColor = isUnicornTheme ? 'bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100' : 'bg-gradient-to-br from-gray-900 via-purple-950 to-blue-950 text-white';

    // Responsive Card Classes (Reduced mobile padding)
    const cardClasses = `p-4 sm:p-6 rounded-3xl shadow-lg transition-all duration-500 border-4 border-white border-opacity-60 backdrop-blur-sm`;
    const cardBgColor = isUnicornTheme ? 'bg-white/50' : 'bg-gray-800/50 text-white';
    const textColor = isUnicornTheme ? 'text-gray-700' : 'text-gray-300';
    const headerColor = isUnicornTheme ? 'text-purple-800' : 'text-yellow-200';
    const subHeadingColor = isUnicornTheme ? 'text-blue-700' : 'text-purple-300';

    // Responsive Button Classes
    const buttonBaseClasses = `px-4 py-2 rounded-full text-sm sm:text-lg font-bold transition-all duration-300 transform hover:scale-105`;

    // Responsive Input Classes
    const inputClasses = `w-full p-2 sm:p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${isUnicornTheme ? 'bg-white border border-gray-300 text-gray-700 focus:ring-pink-300' : 'bg-gray-700 border border-gray-600 text-white focus:ring-purple-500'}`;


    // List of recommended activities for different areas of development
    const activityList = {
        'Creative Play': [
            'Painting with watercolors',
            'Play-Doh sculpting',
            'Finger painting',
            'Storytelling with puppets'
        ],
        'Physical Activities': [
            'Outdoor free play',
            'Musical chairs',
            'Jump rope',
            'Follow the leader'
        ],
        'Cognitive & Learning': [
            'Shape and color sorting',
            'Alphabet flashcards',
            'Number puzzles',
            'Reading circle'
        ],
        'Social & Emotional': [
            'Sharing toys exercise',
            'Group singing',
            'Show and tell'
        ]
    };

    // Load data from localStorage
    useEffect(() => {
        const savedActivities = JSON.parse(localStorage.getItem('playschoolDailyActivities')) || {};
        setDailyActivities(savedActivities);

        // Populate form if activity for today already exists
        const todayString = getDateString(currentDate);
        if (savedActivities[todayString]) {
            setTodayActivities(savedActivities[todayString]);
        }
    }, [currentDate]); // Dependency on currentDate ensures reload if the day changes

    // Save daily activities to localStorage
    useEffect(() => {
        localStorage.setItem('playschoolDailyActivities', JSON.stringify(dailyActivities));
    }, [dailyActivities]);

    // Get formatted date string
    const getDateString = (date) => {
        return date.toISOString().split('T')[0];
    };

    const todayString = getDateString(currentDate);

    // Handle activity input changes
    const handleActivityChange = (sessionType, value) => {
        setTodayActivities(prev => ({
            ...prev,
            [sessionType]: value
        }));
    };

    // Save today's activities
    const saveTodayActivities = () => {
        setAlertState({ message: '', type: 'info' }); // Clear previous alerts

        if (todayActivities.morning_session.trim() || todayActivities.midday_session.trim() || todayActivities.afternoon_session.trim() || todayActivities.special_event.trim()) {
            setDailyActivities(prev => ({
                ...prev,
                [todayString]: todayActivities
            }));

            // Set alert after saving
            setAlertState({ message: '✅ Today\'s activities saved successfully!', type: 'info' });
        } else {
            setAlertState({ message: 'Please enter at least one activity to save.', type: 'error' });
        }
    };

    const isTodayRecorded = dailyActivities[todayString] && Object.values(dailyActivities[todayString]).some(val => val.trim() !== '');

    return (
        <div className={`font-sans min-h-screen p-4 sm:p-8 transition-all duration-1000 ${bgColor} relative`}>
            {/* Animated Background */}
            <AnimatedBackground isUnicornTheme={isUnicornTheme} />

            <div className="relative z-10 container mx-auto px-0 sm:px-4 py-4 sm:py-8 max-w-6xl">
                {/* Main Heading (Responsive) */}
                <h1 className={`text-3xl sm:text-4xl font-extrabold text-center mb-6 drop-shadow-md transition-colors duration-500 ${headerColor}`}>
                    🎨 Daily Activities Planner
                </h1>

                {/* Daily Activity Log */}
                <div className={`${cardClasses} ${cardBgColor} border-4 border-white border-opacity-60`}>
                    <h2 className={`text-xl font-semibold mb-4 ${subHeadingColor}`}>
                        Today's Plan - {currentDate.toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </h2>

                    {isTodayRecorded && (
                        <div className={`p-3 rounded-lg mb-4 border-l-4 transition-all duration-500 ${isUnicornTheme ? 'bg-blue-50 border-blue-400' : 'bg-blue-900 border-blue-700'}`}>
                            <p className={`font-semibold text-base ${isUnicornTheme ? 'text-blue-700' : 'text-blue-300'}`}>
                                ✅ Activities currently planned for today. You can edit and save again.
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Session Inputs - Made fields use responsive classes */}
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${textColor}`}>Morning Session</label>
                            <input
                                type="text"
                                value={todayActivities.morning_session}
                                onChange={(e) => handleActivityChange('morning_session', e.target.value)}
                                placeholder="e.g., Reading time, free play"
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${textColor}`}>Midday Session</label>
                            <input
                                type="text"
                                value={todayActivities.midday_session}
                                onChange={(e) => handleActivityChange('midday_session', e.target.value)}
                                placeholder="e.g., Creative arts, music circle"
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${textColor}`}>Afternoon Session</label>
                            <input
                                type="text"
                                value={todayActivities.afternoon_session}
                                onChange={(e) => handleActivityChange('afternoon_session', e.target.value)}
                                placeholder="e.g., Outdoor play, group games"
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${textColor}`}>Special Event (Optional)</label>
                            <input
                                type="text"
                                value={todayActivities.special_event}
                                onChange={(e) => handleActivityChange('special_event', e.target.value)}
                                placeholder="e.g., Storyteller visit, birthday celebration"
                                className={inputClasses}
                            />
                        </div>
                        <button
                            onClick={saveTodayActivities}
                            className={`w-full ${buttonBaseClasses} bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 shadow-lg`}
                        >
                            Save Today's Activities
                        </button>
                    </div>
                </div>

                {/* Activities Reference (Responsive Grid) */}
                <div className={`${cardClasses} ${cardBgColor} mt-6 border-4 border-white border-opacity-60`}>
                    <h2 className={`text-xl font-semibold mb-4 ${subHeadingColor}`}>Activity Ideas for Children</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {Object.entries(activityList).map(([category, activities]) => (
                            <div key={category} className={`p-4 rounded-lg border transition-all duration-500 ${isUnicornTheme ? 'border-blue-200 bg-white/50 hover:bg-white/70' : 'border-blue-700 bg-gray-800/80 hover:bg-gray-700'}`}>
                                <h3 className={`font-semibold mb-2 text-base ${isUnicornTheme ? 'text-blue-800' : 'text-blue-300'}`}>{category}</h3>
                                <ul className={`list-disc list-inside text-xs sm:text-sm space-y-1 ${isUnicornTheme ? 'text-gray-600' : 'text-gray-400'}`}>
                                    {activities.map((activity, i) => (
                                        <li key={i}>{activity}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activities History (Responsive Table) */}
                {Object.keys(dailyActivities).length > 0 && (
                    <div className={`${cardClasses} ${cardBgColor} mt-6 border-4 border-white border-opacity-60`}>
                        <h2 className={`text-xl font-semibold mb-4 ${subHeadingColor}`}>Recent Activities History</h2>
                        <div className="overflow-x-auto rounded-lg border border-white/50">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className={`transition-colors duration-500 text-xs sm:text-sm ${isUnicornTheme ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-300'}`}>
                                        <th className={`px-2 py-2 sm:px-4 sm:py-2 text-left font-bold w-20`}>Date</th>
                                        {/* Shortened headers for better fit on small screens */}
                                        <th className={`px-2 py-2 sm:px-4 sm:py-2 text-left font-bold`}>Morning</th>
                                        <th className={`px-2 py-2 sm:px-4 sm:py-2 text-left font-bold`}>Midday</th>
                                        <th className={`px-2 py-2 sm:px-4 sm:py-2 text-left font-bold`}>Afternoon</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(dailyActivities)
                                        .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                                        .slice(0, 5) // Show last 5 records
                                        .map(([date, activities]) => (
                                            <tr key={date} className={`border-b transition-colors duration-500 ${isUnicornTheme ? 'border-gray-200 hover:bg-gray-50/50' : 'border-gray-700 hover:bg-gray-700/50'}`}>
                                                {/* Reduced text size and padding for mobile */}
                                                <td className={`px-2 py-2 text-xs sm:text-sm ${textColor}`}>{new Date(date).toLocaleDateString('en-IN')}</td>
                                                <td className={`px-2 py-2 text-xs sm:text-sm ${textColor}`}>{activities.morning_session || '-'}</td>
                                                <td className={`px-2 py-2 text-xs sm:text-sm ${textColor}`}>{activities.midday_session || '-'}</td>
                                                <td className={`px-2 py-2 text-xs sm:text-sm ${textColor}`}>{activities.afternoon_session || '-'}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Alert Message component call */}
                <AlertMessage
                    message={alertState.message}
                    type={alertState.type}
                    onClose={() => setAlertState({ message: '', type: 'info' })}
                    isUnicornTheme={isUnicornTheme}
                />
            </div>

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
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
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

export default DailyActivities;
