import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// --- MOCK DATA INITIALIZATION ---
const initializeMockData = (selectedChild, setSelectedChild) => {
    // Check if data already exists to avoid overwriting real data or looping
    if (localStorage.getItem('playschoolStudents')) {
        return;
    }

    const mockStudentId = 'S-101';

    const mockStudents = [{
        id: mockStudentId,
        name: 'Luna Sparkle',
        parentName: 'Jane Doe',
        age: 4,
        class: 'Preschool',
        allergies: 'Peanuts'
    }];

    const mockAttendance = {
        '2024-09-23': { [mockStudentId]: true },
        '2024-09-24': { [mockStudentId]: true },
        '2024-09-25': { [mockStudentId]: false },
        '2024-09-26': { [mockStudentId]: true },
        '2024-09-27': { [mockStudentId]: true },
    };

    const mockGrowthRecords = {
        [mockStudentId]: [
            { date: '2024-07-01', height: 100, weight: 15.5 },
            { date: '2024-08-01', height: 101.5, weight: 15.8 },
            { date: '2024-09-01', height: 102, weight: 16.1 },
        ]
    };

    const mockNutritionRecords = {
        [mockStudentId]: [
            { date: '2024-09-27', mealType: 'Breakfast', mealDetails: 'Oatmeal, Banana' },
            { date: '2024-09-27', mealType: 'Lunch', mealDetails: 'Chicken & Veggie Pasta' },
            { date: '2024-09-26', mealType: 'Snack', mealDetails: 'Apple slices, Yogurt' },
        ]
    };

    localStorage.setItem('playschoolStudents', JSON.stringify(mockStudents));
    localStorage.setItem('playschoolAttendance', JSON.stringify(mockAttendance));
    localStorage.setItem('playschoolGrowthRecords', JSON.stringify(mockGrowthRecords));
    localStorage.setItem('playschoolNutritionRecords', JSON.stringify(mockNutritionRecords));

    // Force selection of the mock child immediately
    if (!selectedChild) {
        setSelectedChild(mockStudentId);
    }
};

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

// Animated Background Component 
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

const ParentDashboard = ({ theme }) => {
    const [students, setStudents] = useState([]);
    const [selectedChild, setSelectedChild] = useState('');
    const [attendance, setAttendance] = useState({});
    const [growthRecords, setGrowthRecords] = useState({});
    const [nutritionRecords, setNutritionRecords] = useState({});

    // Load all data from localStorage
    useEffect(() => {
        // --- STEP 1: INITIALIZE MOCK DATA IF STORAGE IS EMPTY ---
        initializeMockData(selectedChild, setSelectedChild);

        // --- STEP 2: LOAD DATA FROM STORAGE (MOCK OR REAL) ---
        const savedStudents = JSON.parse(localStorage.getItem('playschoolStudents')) || [];
        const savedAttendance = JSON.parse(localStorage.getItem('playschoolAttendance')) || {};
        const savedGrowth = JSON.parse(localStorage.getItem('playschoolGrowthRecords')) || {};
        const savedNutrition = JSON.parse(localStorage.getItem('playschoolNutritionRecords')) || {};

        setStudents(savedStudents);
        setAttendance(savedAttendance);
        setGrowthRecords(savedGrowth);
        setNutritionRecords(savedNutrition);

        // Auto-select first child if available
        if (savedStudents.length > 0 && !selectedChild) {
            setSelectedChild(savedStudents[0].id);
        }
    }, [selectedChild]);

    const isUnicornTheme = theme === 'unicorn';

    // --- Theming Variables (Consolidated) ---
    const textColor = isUnicornTheme ? 'text-gray-800' : 'text-gray-200';
    const headingColor = isUnicornTheme ? 'text-purple-800' : 'text-yellow-200';
    const subHeadingColor = isUnicornTheme ? 'text-blue-700' : 'text-purple-300';
    const notificationColor = isUnicornTheme ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-yellow-900 border-yellow-700 text-yellow-200';

    // Get selected child data
    const selectedChildData = students.find(student => student.id === selectedChild);

    // Calculate attendance percentage (logic remains the same)
    const calculateAttendance = () => {
        if (!selectedChild) return { percentage: 0, present: 0, total: 0 };

        const childRecords = Object.entries(attendance).filter(([date, records]) =>
            records[selectedChild] !== undefined
        );

        const presentDays = childRecords.filter(([date, records]) =>
            records[selectedChild] === true
        ).length;

        const percentage = childRecords.length > 0 ? (presentDays / childRecords.length) * 100 : 0;

        return {
            percentage: Math.round(percentage),
            present: presentDays,
            total: childRecords.length
        };
    };

    const attendanceData = calculateAttendance();

    // Get growth chart data (logic remains the same)
    const getGrowthChartData = () => {
        if (!selectedChild || !growthRecords[selectedChild]) return null;
        // ... (Chart data logic)
        const records = growthRecords[selectedChild];

        const data = {
            labels: records.map(record => new Date(record.date).toLocaleDateString('en-IN')),
            datasets: [
                {
                    label: 'Height (cm)',
                    data: records.map(record => record.height),
                    borderColor: isUnicornTheme ? 'rgb(75, 192, 192)' : 'rgb(129, 230, 217)',
                    backgroundColor: isUnicornTheme ? 'rgba(75, 192, 192, 0.2)' : 'rgba(129, 230, 217, 0.2)',
                    yAxisID: 'y',
                },
                {
                    label: 'Weight (kg)',
                    data: records.map(record => record.weight),
                    borderColor: isUnicornTheme ? 'rgb(255, 99, 132)' : 'rgb(255, 179, 196)',
                    backgroundColor: isUnicornTheme ? 'rgba(255, 99, 132, 0.2)' : 'rgba(255, 179, 196, 0.2)',
                    yAxisID: 'y1',
                },
            ],
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Growth Progress',
                    color: isUnicornTheme ? '#4B5563' : '#E5E7EB'
                },
                legend: {
                    labels: {
                        color: isUnicornTheme ? '#4B5563' : '#D1D5DB'
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Height (cm)',
                        color: isUnicornTheme ? '#4B5563' : '#D1D5DB'
                    },
                    ticks: { color: isUnicornTheme ? '#4B5563' : '#9CA3AF' },
                    grid: { color: isUnicornTheme ? 'rgba(209, 213, 219, 0.5)' : 'rgba(107, 114, 128, 0.5)' }
                },
                y1: {
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Weight (kg)',
                        color: isUnicornTheme ? '#4B5563' : '#D1D5DB'
                    },
                    ticks: { color: isUnicornTheme ? '#4B5563' : '#9CA3AF' },
                    grid: {
                        drawOnChartArea: false,
                        color: isUnicornTheme ? 'rgba(209, 213, 219, 0.5)' : 'rgba(107, 114, 128, 0.5)'
                    }
                },
                x: {
                    ticks: { color: isUnicornTheme ? '#4B5563' : '#9CA3AF' },
                    grid: { color: isUnicornTheme ? 'rgba(209, 213, 219, 0.5)' : 'rgba(107, 114, 128, 0.5)' }
                }
            }
        };

        return { data, options };
    };

    // Get recent meals (logic remains the same)
    const getRecentMeals = () => {
        if (!selectedChild) return [];
        return (nutritionRecords[selectedChild] || [])
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
    };

    const recentMeals = getRecentMeals();
    const growthChartData = getGrowthChartData();

    // Theming for cards and text
    const cardClasses = `p-6 rounded-3xl shadow-lg transition-all duration-500 transform hover:scale-105`;
    const cardBgColor = isUnicornTheme ? 'bg-white/70' : 'bg-gray-800/70 text-white';

    return (
        // FIX: Retaining 'h-full' to ensure the content fills the layout's viewport.
        <div className="p-4 sm:p-8 w-full h-full">
            {/* The AnimatedBackground is rendered first to be behind the content */}
            <AnimatedBackground isUnicornTheme={isUnicornTheme} />

            <div className="relative z-10 container mx-auto">
                <h1 className={`text-4xl font-extrabold text-center mb-6 drop-shadow-md transition-colors duration-500 ${headingColor}`}>
                    Parent Dashboard
                </h1>

                {/* Child Selection */}
                <div className={`${cardClasses} ${cardBgColor} mb-6`}>
                    <h2 className={`text-xl font-semibold mb-4 ${subHeadingColor}`}>My Child</h2>
                    <select
                        value={selectedChild}
                        onChange={(e) => setSelectedChild(e.target.value)}
                        className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${isUnicornTheme ? 'bg-white border border-gray-300 text-gray-700 focus:ring-pink-300' : 'bg-gray-700 border border-gray-600 text-white focus:ring-purple-500'}`}
                    >
                        <option value="" className={isUnicornTheme ? 'text-gray-400' : 'text-gray-400'}>Select your child</option>
                        {students.map(student => (
                            <option key={student.id} value={student.id} className={textColor}>
                                {student.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedChildData && (
                    <>
                        {/* Welcome Message */}
                        <div className={`p-6 rounded-3xl shadow-lg mb-6 transition-all duration-500 ${isUnicornTheme ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-gradient-to-r from-blue-800 to-blue-900 text-white'}`}>
                            <h2 className="text-2xl font-bold mb-2">Welcome, Parent!</h2>
                            <p>Viewing progress for <strong>{selectedChildData.name}</strong></p>
                        </div>

                        {/* Attendance Summary */}
                        <div className={`${cardClasses} ${cardBgColor} backdrop-blur-sm`}>
                            <h2 className={`text-xl font-semibold mb-4 ${subHeadingColor}`}>📊 Attendance Summary</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className={`text-center p-4 rounded-lg transition-all duration-500 ${isUnicornTheme ? 'bg-blue-50' : 'bg-gray-700'}`}>
                                    <div className={`text-3xl font-bold transition-colors duration-500 ${isUnicornTheme ? 'text-blue-600' : 'text-blue-400'}`}>{attendanceData.percentage}%</div>
                                    <p className="text-sm">Attendance Rate</p>
                                </div>
                                <div className={`text-center p-4 rounded-lg transition-all duration-500 ${isUnicornTheme ? 'bg-green-50' : 'bg-gray-700'}`}>
                                    <div className={`text-3xl font-bold transition-colors duration-500 ${isUnicornTheme ? 'text-green-600' : 'text-green-400'}`}>{attendanceData.present}</div>
                                    <p className="text-sm">Days Present</p>
                                </div>
                                <div className={`text-center p-4 rounded-lg transition-all duration-500 ${isUnicornTheme ? 'bg-gray-50' : 'bg-gray-700'}`}>
                                    <div className={`text-3xl font-bold transition-colors duration-500 ${isUnicornTheme ? 'text-gray-600' : 'text-gray-400'}`}>{attendanceData.total}</div>
                                    <p className="text-sm">Days Recorded</p>
                                </div>
                            </div>
                            <p className={`mt-4 text-sm ${textColor}`}>
                                Regular attendance ensures your child receives continuous education, nutrition, and healthcare.
                            </p>
                        </div>

                        {/* Growth Progress */}
                        {growthChartData && (
                            <div className={`${cardClasses} ${cardBgColor} backdrop-blur-sm mt-6`}>
                                <h2 className={`text-xl font-semibold mb-4 ${subHeadingColor}`}>📈 Growth Progress</h2>
                                <div className="h-64">
                                    <Line data={growthChartData.data} options={growthChartData.options} />
                                </div>
                            </div>
                        )}

                        {/* Recent Meals */}
                        <div className={`${cardClasses} ${cardBgColor} backdrop-blur-sm mt-6`}>
                            <h2 className={`text-xl font-semibold mb-4 ${subHeadingColor}`}>🍎 Recent Meals</h2>
                            {recentMeals.length === 0 ? (
                                <p className={textColor}>No meal records available.</p>
                            ) : (
                                <div className="space-y-3">
                                    {recentMeals.map((meal, index) => (
                                        <div key={index} className={`p-3 rounded-lg transition-colors duration-500 ${isUnicornTheme ? 'border border-gray-200 bg-white/50' : 'border border-gray-600 bg-gray-700'}`}>
                                            <h4 className={`font-semibold ${isUnicornTheme ? 'text-green-700' : 'text-green-300'}`}>
                                                {new Date(meal.date).toLocaleDateString('en-IN')}
                                            </h4>
                                            {/* Note: This meal logic is incomplete as it only checks for one mealType per record, but I'm keeping the original structure for now. */}
                                            <p className={textColor}><strong>Breakfast:</strong> {meal.mealType === 'Breakfast' ? meal.mealDetails : 'Not specified'}</p>
                                            <p className={textColor}><strong>Lunch:</strong> {meal.mealType === 'Lunch' ? meal.mealDetails : 'Not specified'}</p>
                                            <p className={textColor}><strong>Snacks:</strong> {meal.mealType === 'Snack' ? meal.mealDetails : 'Not specified'}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Important Notice */}
                        <div className={`p-6 rounded-lg shadow-md transition-all duration-500 mt-6 ${notificationColor}`}>
                            <h2 className="text-xl font-semibold mb-3">📢 Important Notice</h2>
                            <ul className="space-y-2">
                                <li>• Please ensure your child attends regularly for continuous learning</li>
                                <li>• Vaccinations are essential for your child's health and development</li>
                                <li>• Balanced nutrition at the playschool supports your child's growth</li>
                                <li>• Regular health check-ups help detect issues early</li>
                            </ul>
                        </div>
                    </>
                )}

                {/* No child data message */}
                {!selectedChildData && (
                    <div className={`${cardClasses} ${cardBgColor} backdrop-blur-sm text-center`}>
                        <h2 className={`text-xl font-semibold mb-3 ${subHeadingColor}`}>Welcome to Playschool Services!</h2>
                        <p className={textColor}>
                            Your child's data will appear here once they are registered by the playschool admin.
                            Please ensure regular attendance for complete benefits.
                        </p>
                    </div>
                )}
            </div>

            {/* The style block remains for the animations used by AnimatedBackground */}
            <style>
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
                .animation-delay-1000 {
                    animation-delay: 1s;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-3000 {
                    animation-delay: 3s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .animation-delay-5000 {
                    animation-delay: 5s;
                }
                .animation-delay-6000 {
                    animation-delay: 6s;
                }
                .animation-delay-7000 {
                    animation-delay: 7s;
                }
                .animation-delay-8000 {
                    animation-delay: 8s;
                }
                .animation-delay-9000 {
                    animation-delay: 9s;
                }
                .animation-delay-10000 {
                    animation-delay: 10s;
                }
                .animation-delay-11000 {
                    animation-delay: 11s;
                }
                .animation-delay-12000 {
                    animation-delay: 12s;
                }
                .animation-delay-13000 {
                    animation-delay: 13s;
                }
                .animation-delay-14000 {
                    animation-delay: 14s;
                }
                .animation-delay-15000 {
                    animation-delay: 15s;
                }
                `}
            </style>
        </div>
    );
};

export default ParentDashboard;
