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

const LearningActivities = ({ theme }) => {
    const [dailyActivities, setDailyActivities] = useState({});
    const [currentDate] = useState(new Date());
    const [todayActivities, setTodayActivities] = useState({
        morning_session: '',
        midday_session: '',
        afternoon_session: '',
        special_event: ''
    });
    const [alertState, setAlertState] = useState({ message: '', type: 'info' });

    // --- Learning Tracker State ---
    const [selectedChild, setSelectedChild] = useState('Kavya M.');
    const [activeSubject, setActiveSubject] = useState('english');
    const [newActivity, setNewActivity] = useState({
        date: new Date().toISOString().split('T')[0],
        topic: '',
        notes: '',
        completed: true
    });
    // Replaced setAlertMessage with setAlertState to match AlertMessage component props
    const [learningAlert, setLearningAlert] = useState({ message: '', type: 'info' });


    // Sample learning data (will need to be replaced by persistent storage later)
    const [learningData, setLearningData] = useState({
        'Kavya M.': {
            english: [
                { date: '2024-05-01', topic: 'Alphabet A-D', notes: 'Recognizes letters A, B, C, D', completed: true },
                { date: '2024-05-08', topic: 'Alphabet E-H', notes: 'Learning to write E, F, G', completed: true },
                { date: '2024-05-15', topic: 'Simple Words', notes: 'Cat, Bat, Mat recognition', completed: false }
            ],
            tamil: [
                { date: '2024-05-02', topic: 'உயிர் எழுத்துக்கள்', notes: 'அ, ஆ, இ, ஈ recognition', completed: true },
                { date: '2024-05-09', topic: 'மெய் எழுத்துக்கள்', notes: 'க், ங், ச் practice', completed: true }
            ],
            maths: [
                { date: '2024-05-03', topic: 'Numbers 1-10', notes: 'Counting objects 1-10', completed: true },
                { date: '2024-05-10', topic: 'Shapes', notes: 'Circle, Square, Triangle identification', completed: true },
                { date: '2024-05-17', topic: 'Counting 11-20', notes: 'Number writing practice', completed: false }
            ]
        },
        'Arjun S.': {
            english: [
                { date: '2024-05-01', topic: 'Alphabet Recognition', notes: 'A-Z capital letters', completed: true }
            ],
            tamil: [
                { date: '2024-05-02', topic: 'Basic Tamil Letters', notes: 'அ to ஔ introduction', completed: true }
            ],
            maths: [
                { date: '2024-05-03', topic: 'Numbers 1-5', notes: 'Counting fingers', completed: true }
            ]
        }
    });

    // NOTE: This array should come from a shared student list in a real app.
    const children = ['Kavya M.', 'Arjun S.', 'Divya P.', 'Siddharth R.', 'Priya K.'];

    const isUnicornTheme = theme === 'unicorn';
    const bgColor = isUnicornTheme ? 'bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100' : 'bg-gradient-to-br from-gray-900 via-purple-950 to-blue-950 text-white';

    // Responsive Card Classes (Reduced mobile padding)
    const cardClasses = `p-4 sm:p-6 rounded-3xl shadow-lg transition-all duration-500 border-4 border-white border-opacity-60 backdrop-blur-sm`;
    const cardBgColor = isUnicornTheme ? 'bg-white/50' : 'bg-gray-800/50 text-white';
    const textColor = isUnicornTheme ? 'text-gray-700' : 'text-gray-300';
    const headerColor = isUnicornTheme ? 'text-purple-800' : 'text-yellow-200';
    const subHeadingColor = isUnicornTheme ? 'text-green-700' : 'text-green-300';

    // Responsive Button Classes
    const buttonBaseClasses = `px-4 py-2 rounded-full text-sm sm:text-lg font-bold transition-all duration-300 transform hover:scale-105`;

    // Responsive Input Classes
    const inputClasses = `w-full p-2 sm:p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${isUnicornTheme ? 'bg-white border border-gray-300 text-gray-700 focus:ring-pink-300' : 'bg-gray-700 border border-gray-600 text-white focus:ring-purple-500'}`;

    // --- Learning Tracker Logic ---

    const handleInputChange = (e) => {
        setNewActivity({
            ...newActivity,
            [e.target.name]: e.target.value
        });
    };

    const handleCheckboxChange = (e) => {
        setNewActivity({
            ...newActivity,
            [e.target.name]: e.target.checked
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLearningAlert({ message: '', type: 'info' }); // Clear previous alerts

        if (!newActivity.topic.trim()) {
            setLearningAlert({ message: 'Activity topic is required.', type: 'error' });
            return;
        }

        const updatedData = { ...learningData };
        if (!updatedData[selectedChild]) {
            updatedData[selectedChild] = { english: [], tamil: [], maths: [] };
        }
        if (!updatedData[selectedChild][activeSubject]) {
            updatedData[selectedChild][activeSubject] = [];
        }

        // Add the new activity to the start of the array
        updatedData[selectedChild][activeSubject].unshift({
            ...newActivity,
            id: Date.now()
        });

        setLearningData(updatedData);
        setNewActivity({
            date: new Date().toISOString().split('T')[0],
            topic: '',
            notes: '',
            completed: true
        });

        setLearningAlert({ message: `Activity added to ${activeSubject} for ${selectedChild}!`, type: 'info' });
    };

    const toggleActivityCompletion = (child, subject, index) => {
        const updatedData = { ...learningData };
        updatedData[child][subject][index].completed =
            !updatedData[child][subject][index].completed;
        setLearningData(updatedData);
    };

    const getProgressPercentage = (child, subject) => {
        const activities = learningData[child]?.[subject] || [];
        if (activities.length === 0) return 0;
        const completed = activities.filter(a => a.completed).length;
        return Math.round((completed / activities.length) * 100);
    };

    const currentActivities = learningData[selectedChild]?.[activeSubject] || [];

    // --- End Learning Tracker Logic ---

    return (
        <div className={`font-sans min-h-screen p-4 sm:p-8 transition-all duration-1000 ${bgColor} relative`}>
            {/* Animated Background */}
            <AnimatedBackground isUnicornTheme={isUnicornTheme} />

            <div className="relative z-10 container mx-auto px-0 sm:px-4 py-4 sm:py-8 max-w-6xl">
                {/* Main Heading (Responsive) */}
                <h1 className={`text-3xl sm:text-4xl font-extrabold text-center mb-6 drop-shadow-md transition-colors duration-500 ${headerColor}`}>
                    📚 Learning Activities Planner
                </h1>

                {/* Child Selection and Progress Summary */}
                <div className={`${cardClasses} ${cardBgColor} border-4 border-white border-opacity-60`}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                            <label className={`block text-sm font-medium mb-1 ${textColor}`}>Select Child:</label>
                            <select
                                value={selectedChild}
                                onChange={(e) => setSelectedChild(e.target.value)}
                                // Using responsive input classes defined above
                                className={`${inputClasses} ${isUnicornTheme ? 'bg-white/90 border-gray-300 text-gray-700 focus:ring-green-300' : 'bg-gray-700/90 border-gray-600 text-white focus:ring-purple-500'}`}
                            >
                                {children.map(child => (
                                    <option key={child} value={child} className={isUnicornTheme ? 'text-gray-700' : 'text-white'}>
                                        {child}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Progress Summary Grid (Scales down gracefully) */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className={`text-sm sm:text-lg font-bold transition-colors duration-500 ${isUnicornTheme ? 'text-blue-600' : 'text-blue-400'}`}>
                                    {getProgressPercentage(selectedChild, 'english')}%
                                </div>
                                <div className={`text-xs sm:text-sm transition-colors duration-500 ${textColor}`}>English</div>
                            </div>
                            <div>
                                <div className={`text-sm sm:text-lg font-bold transition-colors duration-500 ${isUnicornTheme ? 'text-red-600' : 'text-pink-400'}`}>
                                    {getProgressPercentage(selectedChild, 'tamil')}%
                                </div>
                                <div className={`text-xs sm:text-sm transition-colors duration-500 ${textColor}`}>Tamil</div>
                            </div>
                            <div>
                                <div className={`text-sm sm:text-lg font-bold transition-colors duration-500 ${isUnicornTheme ? 'text-green-600' : 'text-green-400'}`}>
                                    {getProgressPercentage(selectedChild, 'maths')}%
                                </div>
                                <div className={`text-xs sm:text-sm transition-colors duration-500 ${textColor}`}>Maths</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subject Navigation (Tabs) */}
                <div className={`${cardClasses} ${cardBgColor} p-3 sm:p-4 mt-6 border-4 border-white border-opacity-60`}>
                    {/* Ensures buttons wrap if screen is very small, using smaller padding */}
                    <div className="flex flex-wrap justify-center sm:space-x-1 space-x-0 gap-2">
                        {[
                            { id: 'english', label: 'English', color: 'blue' },
                            { id: 'tamil', label: 'Tamil', color: 'red' },
                            { id: 'maths', label: 'Mathematics', color: 'green' }
                        ].map(subject => {
                            // Dynamic color classes are not supported directly in Tailwind. Using fixed colors.
                            const activeBg = {
                                'blue': 'bg-blue-600 hover:bg-blue-700',
                                'red': 'bg-red-600 hover:bg-red-700',
                                'green': 'bg-green-600 hover:bg-green-700'
                            }[subject.color];

                            const inactiveBg = isUnicornTheme ? 'bg-white hover:bg-gray-100' : 'bg-gray-700 hover:bg-gray-600';
                            const inactiveText = {
                                'blue': isUnicornTheme ? 'text-blue-600' : 'text-blue-300',
                                'red': isUnicornTheme ? 'text-red-600' : 'text-pink-300',
                                'green': isUnicornTheme ? 'text-green-600' : 'text-green-300'
                            }[subject.color];

                            return (
                                <button
                                    key={subject.id}
                                    onClick={() => setActiveSubject(subject.id)}
                                    // Smaller responsive padding/text size for tabs
                                    className={`py-1 px-3 sm:py-2 sm:px-4 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 ${activeSubject === subject.id
                                        ? `${activeBg} text-white shadow-md`
                                        : `${inactiveBg} ${inactiveText}`
                                        }`}
                                >
                                    {subject.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Activity List */}
                    <div className={`${cardClasses} ${cardBgColor}`}>
                        <h3 className={`text-xl font-semibold mb-4 transition-colors duration-500 ${subHeadingColor}`}>
                            {activeSubject.toUpperCase()} Activities for {selectedChild}
                        </h3>

                        {currentActivities.length === 0 ? (
                            <div className={`text-center py-8 transition-colors duration-500 ${textColor}`}>
                                <div className="text-4xl mb-2">📝</div>
                                <p>No activities recorded yet.</p>
                                <p className="text-sm">Add the first activity using the form!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {currentActivities.map((activity, index) => (
                                    <div key={index}
                                        // Reduced padding on mobile, added border
                                        className={`p-2 sm:p-3 rounded-lg border transition-all duration-300 ${activity.completed
                                            ? isUnicornTheme ? 'border-green-300/60 bg-green-50/50 hover:bg-green-100/70' : 'border-green-900 bg-green-800/50 hover:bg-green-700/70'
                                            : isUnicornTheme ? 'border-yellow-300/60 bg-yellow-50/50 hover:bg-yellow-100/70' : 'border-yellow-900 bg-yellow-800/50 hover:bg-yellow-700/70'
                                            }`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <div className="flex items-center mb-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={activity.completed}
                                                        onChange={() => toggleActivityCompletion(selectedChild, activeSubject, index)}
                                                        className={`mr-2 h-4 w-4 rounded-sm transition-all duration-300 ${isUnicornTheme ? 'text-green-600 focus:ring-green-500' : 'text-green-400 focus:ring-green-400'}`}
                                                    />
                                                    <span className={`font-medium text-sm sm:text-base truncate transition-colors duration-500 ${activity.completed
                                                        ? isUnicornTheme ? 'line-through text-green-700' : 'line-through text-green-300'
                                                        : isUnicornTheme ? 'text-gray-700' : 'text-gray-200'
                                                        }`}>
                                                        {activity.topic}
                                                    </span>
                                                </div>
                                                <p className={`text-xs sm:text-sm mb-1 transition-colors duration-500 ${isUnicornTheme ? 'text-gray-600' : 'text-gray-400'}`}>{activity.notes}</p>
                                                <span className={`text-xs transition-colors duration-500 ${isUnicornTheme ? 'text-gray-500' : 'text-gray-500'}`}>{activity.date}</span>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-500 ${activity.completed
                                                ? isUnicornTheme ? 'bg-green-200 text-green-800' : 'bg-green-700 text-white'
                                                : isUnicornTheme ? 'bg-yellow-200 text-yellow-800' : 'bg-yellow-700 text-white'
                                                }`}>
                                                {activity.completed ? 'Completed' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Add New Activity Form */}
                    <div className={`${cardClasses} ${cardBgColor}`}>
                        <h3 className={`text-xl font-semibold mb-4 transition-colors duration-500 ${subHeadingColor}`}>Add New Activity</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${textColor}`}>Date:</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={newActivity.date}
                                    onChange={handleInputChange}
                                    className={`${inputClasses} ${isUnicornTheme ? 'bg-white/90 border-gray-300 text-gray-700 focus:ring-green-300' : 'bg-gray-700/90 border-gray-600 text-white focus:ring-purple-500'}`}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${textColor}`}>Topic/Activity:</label>
                                <input
                                    type="text"
                                    name="topic"
                                    value={newActivity.topic}
                                    onChange={handleInputChange}
                                    className={`${inputClasses} ${isUnicornTheme ? 'bg-white/90 border-gray-300 text-gray-700 focus:ring-green-300' : 'bg-gray-700/90 border-gray-600 text-white focus:ring-purple-500'}`}
                                    placeholder="e.g., Alphabet A-D, Numbers 1-10"
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1 ${textColor}`}>Notes/Observations:</label>
                                <textarea
                                    name="notes"
                                    value={newActivity.notes}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className={`${inputClasses} ${isUnicornTheme ? 'bg-white/90 border-gray-300 text-gray-700 focus:ring-green-300' : 'bg-gray-700/90 border-gray-600 text-white focus:ring-purple-500'}`}
                                    placeholder="How did the child perform? What needs improvement?"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="completed"
                                    checked={newActivity.completed}
                                    onChange={handleCheckboxChange}
                                    className={`h-4 w-4 rounded-sm transition-all duration-300 ${isUnicornTheme ? 'text-green-600 focus:ring-green-500' : 'text-green-400 focus:ring-green-400'}`}
                                />
                                <label className={`ml-2 text-sm ${textColor}`}>Mark as completed</label>
                            </div>

                            <button
                                type="submit"
                                className={`w-full ${buttonBaseClasses} bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 shadow-lg`}
                            >
                                Add Activity
                            </button>
                        </form>
                    </div>
                </div>

                {/* Learning Guidelines (Responsive Grid) */}
                <div className={`mt-8 p-4 sm:p-6 rounded-lg shadow-md border transition-all duration-500 ${isUnicornTheme ? 'bg-blue-50 border-blue-200' : 'bg-blue-900 border-blue-800'}`}>
                    <h4 className={`font-semibold text-lg sm:text-xl mb-3 transition-colors duration-500 ${isUnicornTheme ? 'text-blue-800' : 'text-blue-300'}`}>🎯 Early Learning Guidelines (3-6 years)</h4>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm transition-colors duration-500 ${isUnicornTheme ? 'text-blue-600' : 'text-blue-400'}`}>
                        <div>
                            <h5 className={`font-medium text-base mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-blue-700' : 'text-blue-300'}`}>English Foundation:</h5>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>Letter recognition (A-Z)</li>
                                <li>Phonics sounds</li>
                                <li>Simple word formation</li>
                                <li>Basic vocabulary building</li>
                                <li>Listening comprehension</li>
                            </ul>
                        </div>
                        <div>
                            <h5 className={`font-medium text-base mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-blue-700' : 'text-blue-300'}`}>Tamil Foundation:</h5>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>உயிர் எழுத்துக்கள்</li>
                                <li>மெய் எழுத்துக்கள்</li>
                                <li>உயிர்மெய் எழுத்துக்கள்</li>
                                <li>Basic word recognition</li>
                                <li>Cultural stories & rhymes</li>
                            </ul>
                        </div>
                        <div>
                            <h5 className={`font-medium text-base mb-2 transition-colors duration-500 ${isUnicornTheme ? 'text-blue-700' : 'text-blue-300'}`}>Mathematics Foundation:</h5>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                                <li>Number recognition 1-50</li>
                                <li>Counting objects</li>
                                <li>Basic shapes & patterns</li>
                                <li>Size comparison</li>
                                <li>Simple addition concepts</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Alert Message component call */}
                <AlertMessage
                    message={learningAlert.message}
                    type={learningAlert.type}
                    onClose={() => setLearningAlert({ message: '', type: 'info' })}
                    isUnicornTheme={isUnicornTheme}
                />
            </div>
        </div>
    );
};

export default LearningActivities;
