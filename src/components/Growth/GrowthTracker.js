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

// --- Custom SVG Line Chart Component (Pure React/SVG) ---
const SimpleSvgLineChart = ({ records, isUnicornTheme }) => {
    if (records.length < 2) return (
        <p className="text-center py-8 text-base text-gray-500">
            Need at least two records to display the visual trend.
        </p>
    );

    const dataPoints = records.map(r => ({ height: r.height, weight: r.weight, date: r.date }));

    // Normalize data (0 to 100)
    const allHeight = dataPoints.map(d => d.height);
    const minHeight = Math.min(...allHeight);
    const maxHeight = Math.max(...allHeight);
    const heightRange = maxHeight - minHeight > 0 ? maxHeight - minHeight : 10;

    const allWeight = dataPoints.map(d => d.weight);
    const minWeight = Math.min(...allWeight);
    const maxWeight = Math.max(...allWeight);
    const weightRange = maxWeight - minWeight > 0 ? maxWeight - minWeight : 5;

    const normalize = (value, min, range) => 100 - ((value - min) / range) * 100;

    const CHART_WIDTH = 500;
    const CHART_HEIGHT = 200;

    // Create SVG paths for height and weight
    const heightPath = dataPoints.map((d, i) => {
        const x = (i / (dataPoints.length - 1)) * CHART_WIDTH;
        const y = normalize(d.height, minHeight, heightRange);
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');

    const weightPath = dataPoints.map((d, i) => {
        const x = (i / (dataPoints.length - 1)) * CHART_WIDTH;
        const y = normalize(d.weight, minWeight, weightRange);
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');

    const heightColor = isUnicornTheme ? '#f472b6' : '#a855f7'; // Pink/Purple
    const weightColor = isUnicornTheme ? '#8b5cf6' : '#ec4899'; // Purple/Pink

    return (
        <div className="relative w-full h-[250px] sm:h-[350px] overflow-x-auto p-4">
            <svg viewBox={`-20 0 ${CHART_WIDTH + 40} ${CHART_HEIGHT + 20}`} className="w-full h-full">
                {/* Horizontal Grid Lines */}
                {[0, 25, 50, 75, 100].map(y => (
                    <line key={y} x1="0" y1={y * 2} x2={CHART_WIDTH} y2={y * 2} stroke={isUnicornTheme ? '#ccc' : '#444'} strokeWidth="1" strokeDasharray="5, 5" />
                ))}

                {/* Draw Paths */}
                <path d={heightPath} fill="none" stroke={heightColor} strokeWidth="2" strokeLinecap="round" />
                <path d={weightPath} fill="none" stroke={weightColor} strokeWidth="2" strokeLinecap="round" />

                {/* Draw Points and Tooltips (simplified representation) */}
                {dataPoints.map((d, i) => {
                    const x = (i / (dataPoints.length - 1)) * CHART_WIDTH;

                    return (
                        <g key={d.date + i}>
                            <circle cx={x} cy={normalize(d.height, minHeight, heightRange)} r="4" fill={heightColor} />
                            <circle cx={x} cy={normalize(d.weight, minWeight, weightRange)} r="4" fill={weightColor} />

                            {/* X-Axis Labels (Dates) - Display only the month/day for mobile space */}
                            <text
                                x={x}
                                y={CHART_HEIGHT + 15}
                                textAnchor="middle"
                                fontSize="12"
                                fill={isUnicornTheme ? '#333' : '#eee'}
                            >
                                {new Date(d.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                            </text>
                        </g>
                    );
                })}
                {/* Y-Axis Labeling (Simplified: Min/Max for context) */}
                <text x="-15" y="10" textAnchor="end" fontSize="12" fill={heightColor}>H: {maxHeight.toFixed(1)} cm</text>
                <text x="-15" y={CHART_HEIGHT + 5} textAnchor="end" fontSize="12" fill={heightColor}>H: {minHeight.toFixed(1)} cm</text>

                <text x={CHART_WIDTH + 15} y="10" textAnchor="start" fontSize="12" fill={weightColor}>W: {maxWeight.toFixed(1)} kg</text>
                <text x={CHART_WIDTH + 15} y={CHART_HEIGHT + 5} textAnchor="start" fontSize="12" fill={weightColor}>W: {minWeight.toFixed(1)} kg</text>
            </svg>
        </div>
    );
};
// -------------------------------------------------------------------------

// --- Custom Component to visualize the last few measurements (Replaces Chart) ---
const RecentGrowthSummary = ({ records, isUnicornTheme, subHeadingColor }) => {
    if (!records || records.length < 1) return null;

    // Get the last 3 records
    const recentRecords = records.slice(-3).reverse();

    // Function to determine growth status
    const getGrowthStatus = (current, previous) => {
        if (!previous) return 'neutral';
        if (current > previous) return 'up';
        if (current < previous) return 'down';
        return 'stable';
    };

    const StatusIcon = ({ status }) => {
        if (status === 'up') return <span className="text-green-500 font-bold ml-1 text-sm sm:text-base">▲</span>;
        if (status === 'down') return <span className="text-red-500 font-bold ml-1 text-sm sm:text-base">▼</span>;
        return <span className="text-gray-500 font-bold ml-1 text-sm sm:text-base">●</span>;
    };

    const cardClasses = isUnicornTheme ? 'bg-white/50 border-pink-300' : 'bg-gray-700/50 border-purple-600';

    return (
        <div className="mt-6">
            <h3 className={`text-lg sm:text-xl font-bold mb-4 ${subHeadingColor}`}>Recent Progress Summary</h3>
            {/* Responsive grid for summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recentRecords.map((record, index) => {
                    const previousRecord = index < recentRecords.length - 1 ? recentRecords[index + 1] : null;

                    const heightStatus = getGrowthStatus(record.height, previousRecord?.height);
                    const weightStatus = getGrowthStatus(record.weight, previousRecord?.weight);

                    return (
                        <div key={record.date} className={`p-4 rounded-xl shadow-lg border ${cardClasses} transition-all duration-300 text-sm`}>
                            <p className="text-sm sm:text-base font-semibold mb-2">
                                {new Date(record.date).toLocaleDateString('en-IN')}
                            </p>
                            <div className="text-xs sm:text-sm">
                                <p className="flex items-center">
                                    <span className="font-medium w-14">Height:</span>
                                    <span className="font-bold">{record.height} cm</span>
                                    <StatusIcon status={heightStatus} />
                                </p>
                                <p className="flex items-center">
                                    <span className="font-medium w-14">Weight:</span>
                                    <span className="font-bold">{record.weight} kg</span>
                                    <StatusIcon status={weightStatus} />
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
// -----------------------------------------------------------------------------------

const GrowthTracker = ({ theme }) => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [growthRecords, setGrowthRecords] = useState({});
    const [newRecord, setNewRecord] = useState({
        date: new Date().toISOString().split('T')[0],
        height: '',
        weight: ''
    });

    const isUnicornTheme = theme === 'unicorn';
    const bgColor = isUnicornTheme
        ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200'
        : 'bg-gradient-to-br from-gray-900 via-purple-950 to-blue-950 text-white';

    // Responsive Card Classes - Reduced mobile padding
    const cardClasses = `p-4 sm:p-6 rounded-[40px] shadow-2xl transition-all duration-500 transform hover:scale-[1.01] border-4 border-white border-opacity-60 backdrop-blur-sm`;
    const cardBgColor = isUnicornTheme
        ? 'bg-white/30'
        : 'bg-gray-800/50 text-white';
    const headerColor = isUnicornTheme ? 'text-purple-800' : 'text-yellow-200';
    const subHeadingColor = isUnicornTheme ? 'text-pink-600' : 'text-blue-300';

    // Responsive Input Classes - Reduced mobile padding/text size
    const inputClasses = `w-full p-2 sm:p-3 rounded-xl text-sm sm:text-base transition-all duration-300 focus:outline-none focus:ring-4`;
    const buttonClasses = `w-full font-bold px-4 py-3 sm:px-6 sm:py-3 rounded-full text-sm sm:text-lg text-white transition-all duration-300 transform hover:scale-105 shadow-xl`;

    // Alert state placeholder (used by other components, included for completeness)
    const [alertState, setAlertState] = useState({ message: '', type: 'info' });


    // Load data from localStorage
    useEffect(() => {
        const savedStudents = JSON.parse(localStorage.getItem('anganwadiStudents')) || [];
        const savedGrowth = JSON.parse(localStorage.getItem('anganwadiGrowth')) || {};
        setStudents(savedStudents);
        setGrowthRecords(savedGrowth);
        // Automatically select the first student if available
        if (savedStudents.length > 0) {
            setSelectedStudent(savedStudents[0].id.toString());
        }
    }, []);

    // Save growth records to localStorage
    useEffect(() => {
        localStorage.setItem('anganwadiGrowth', JSON.stringify(growthRecords));
    }, [growthRecords]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRecord(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Submit new growth record
    const handleSubmitRecord = (e) => {
        e.preventDefault();
        if (!selectedStudent || !newRecord.height || !newRecord.weight) return;

        const studentId = selectedStudent;
        const record = {
            date: newRecord.date,
            height: parseFloat(newRecord.height),
            weight: parseFloat(newRecord.weight)
        };

        setGrowthRecords(prev => {
            const newRecords = { ...prev };
            if (!newRecords[studentId]) {
                newRecords[studentId] = [];
            }
            // Check for duplicate date (prevents accidental double entry)
            const existingIndex = newRecords[studentId].findIndex(r => r.date === record.date);
            if (existingIndex > -1) {
                // Update existing record for the same date
                newRecords[studentId][existingIndex] = record;
            } else {
                newRecords[studentId].push(record);
            }

            // Sort records by date
            newRecords[studentId].sort((a, b) => new Date(a.date) - new Date(b.date));
            return newRecords;
        });

        // Reset form to default date and clear inputs
        setNewRecord({
            date: new Date().toISOString().split('T')[0],
            height: '',
            weight: ''
        });
        setAlertState({ message: `Measurement recorded for ${currentStudent?.name}!`, type: 'info' });
    };

    const currentStudentRecords = growthRecords[selectedStudent] || [];
    const currentStudent = students.find(s => s.id === parseInt(selectedStudent));
    const isStudentSelected = !!currentStudent;

    return (
        <div className={`font-sans overflow-hidden transition-all duration-1000 ${bgColor} min-h-screen relative`}>
            {/* Animated Background */}
            <AnimatedBackground isUnicornTheme={isUnicornTheme} />

            <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
                {/* Main Heading made responsive */}
                <h1 className={`text-3xl sm:text-4xl font-extrabold text-center mb-8 drop-shadow-lg transition-colors duration-500 ${headerColor}`}>
                    Child Growth Tracker 🚀
                </h1>

                <div className="flex flex-col space-y-6 sm:space-y-8">
                    {/* Student Selection (Card) */}
                    <div className={`${cardClasses} ${cardBgColor}`}>
                        <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${subHeadingColor}`}>Select a Child</h2>
                        <select
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            className={`${inputClasses} ${isUnicornTheme ? 'bg-white/50 border-pink-300 text-purple-800 focus:ring-pink-300' : 'bg-gray-700/50 border-purple-500 text-white focus:ring-purple-500'}`}
                        >
                            <option value="" className={isUnicornTheme ? 'text-gray-400' : 'text-gray-400'}>
                                {students.length === 0 ? 'No students enrolled' : 'Choose a child...'}
                            </option>
                            {students.map(student => (
                                <option key={student.id} value={student.id} className={isUnicornTheme ? 'text-gray-800' : 'text-white'}>
                                    {student.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Add New Record Form (Card) */}
                    {isStudentSelected && (
                        <div className={`${cardClasses} ${cardBgColor}`}>
                            <h2 className={`text-xl sm:text-2xl font-bold mb-6 ${subHeadingColor}`}>Add New Measurement for {currentStudent?.name}</h2>
                            <form onSubmit={handleSubmitRecord}
                                // Responsive grid: 1 col on mobile, 2 cols on tablet, 4 cols on larger screens
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">

                                <div>
                                    <label className={`block text-sm sm:text-base font-medium mb-1 ${subHeadingColor}`}>Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={newRecord.date}
                                        onChange={handleInputChange}
                                        className={`${inputClasses} ${isUnicornTheme ? 'bg-white/50 border-pink-300 text-purple-800 focus:ring-pink-300' : 'bg-gray-700/50 border-purple-500 text-white focus:ring-purple-500'}`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm sm:text-base font-medium mb-1 ${subHeadingColor}`}>Height (cm)</label>
                                    <input
                                        type="number"
                                        name="height"
                                        value={newRecord.height}
                                        onChange={handleInputChange}
                                        step="0.1"
                                        min="0"
                                        className={`${inputClasses} ${isUnicornTheme ? 'bg-white/50 border-pink-300 text-purple-800 focus:ring-pink-300' : 'bg-gray-700/50 border-purple-500 text-white focus:ring-purple-500'}`}
                                        placeholder="e.g., 85.5"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm sm:text-base font-medium mb-1 ${subHeadingColor}`}>Weight (kg)</label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={newRecord.weight}
                                        onChange={handleInputChange}
                                        step="0.1"
                                        min="0"
                                        className={`${inputClasses} ${isUnicornTheme ? 'bg-white/50 border-pink-300 text-purple-800 focus:ring-pink-300' : 'bg-gray-700/50 border-purple-500 text-white focus:ring-purple-500'}`}
                                        placeholder="e.g., 12.3"
                                        required
                                    />
                                </div>
                                {/* Button column now spans 1 on desktop, 2 on tablet, and stays full width on mobile for better touch target */}
                                <div className="md:col-span-1 sm:col-span-2 col-span-1">
                                    <button
                                        type="submit"
                                        className={`${buttonClasses} ${isUnicornTheme ? 'bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'}`}
                                    >
                                        Add Record
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Growth Summary & Chart (Card) */}
                    {isStudentSelected && currentStudentRecords.length > 0 && (
                        <div className={`${cardClasses} ${cardBgColor}`}>
                            {/* The new SVG Chart component */}
                            <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${subHeadingColor}`}>Visual Growth Trend</h2>

                            {currentStudentRecords.length < 2 ? (
                                <p className={`text-center py-8 text-base ${isUnicornTheme ? 'text-gray-600' : 'text-gray-300'}`}>
                                    Add at least two measurements to display the visual growth chart. 📊
                                </p>
                            ) : (
                                <SimpleSvgLineChart
                                    records={currentStudentRecords}
                                    isUnicornTheme={isUnicornTheme}
                                />
                            )}

                            {/* Summary Cards */}
                            <RecentGrowthSummary
                                records={currentStudentRecords}
                                isUnicornTheme={isUnicornTheme}
                                subHeadingColor={subHeadingColor}
                            />
                        </div>
                    )}

                    {/* Growth Records Table (Card) */}
                    {isStudentSelected && currentStudentRecords.length > 0 && (
                        <div className={`${cardClasses} ${cardBgColor}`}>
                            <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${subHeadingColor}`}>Measurement History</h2>
                            <div className="overflow-x-auto rounded-xl border border-white/50">
                                {/* The table structure is now heavily optimized for horizontal scrolling on mobile */}
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                        <tr className={`border-b-4 transition-colors duration-500 ${isUnicornTheme ? 'border-pink-300/60' : 'border-purple-600/60'} text-xs sm:text-sm md:text-base`}>
                                            {/* Reduced padding and size for mobile readability */}
                                            <th className={`px-2 py-3 sm:px-4 sm:py-3 text-left font-extrabold ${subHeadingColor}`}>Date</th>
                                            <th className={`px-2 py-3 sm:px-4 sm:py-3 text-left font-extrabold ${subHeadingColor}`}>H. (cm)</th>
                                            <th className={`px-2 py-3 sm:px-4 sm:py-3 text-left font-extrabold ${subHeadingColor}`}>W. (kg)</th>
                                            <th className={`px-2 py-3 sm:px-4 sm:py-3 text-left font-extrabold ${subHeadingColor}`}>BMI</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/20">
                                        {currentStudentRecords.slice().reverse().map((record, index) => {
                                            // Calculate BMI: weight (kg) / [height (m)]^2
                                            const heightMeters = record.height / 100;
                                            const bmi = (record.weight / (heightMeters * heightMeters)).toFixed(1);

                                            const rowClasses = isUnicornTheme ? 'hover:bg-pink-100/50' : 'hover:bg-purple-900/50';

                                            return (
                                                <tr key={index} className={`border-b-2 transition-colors duration-500 ${isUnicornTheme ? 'border-pink-200/50' : 'border-gray-700/50'} ${rowClasses}`}>
                                                    {/* Reduced text size and padding for mobile */}
                                                    <td className={`px-2 py-2 text-xs sm:text-sm ${isUnicornTheme ? 'text-gray-700' : 'text-gray-300'}`}>{new Date(record.date).toLocaleDateString('en-IN')}</td>
                                                    <td className={`px-2 py-2 text-xs sm:text-sm ${isUnicornTheme ? 'text-gray-700' : 'text-gray-300'}`}>{record.height}</td>
                                                    <td className={`px-2 py-2 text-xs sm:text-sm ${isUnicornTheme ? 'text-gray-700' : 'text-gray-300'}`}>{record.weight}</td>
                                                    <td className={`px-2 py-2 text-xs sm:text-sm ${isUnicornTheme ? 'text-gray-700' : 'text-gray-300'}`}>{bmi}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Alert Message component call (Fixed position) */}
            <AlertMessage
                message={alertState.message}
                type={alertState.type}
                onClose={() => setAlertState({ message: '', type: 'info' })}
                isUnicornTheme={isUnicornTheme}
            />

            {/* Custom CSS for animations and components that must be present */}
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
                `}
            </style>
        </div>
    );
};

export default GrowthTracker;
