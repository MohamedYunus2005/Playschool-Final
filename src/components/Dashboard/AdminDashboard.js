import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = ({ theme, setTheme }) => {
    const isUnicornTheme = theme === 'unicorn';
    const bgColor = isUnicornTheme
        ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200'
        : 'bg-gradient-to-br from-gray-900 via-purple-950 to-blue-950 text-white';
    const cardBaseClasses = `p-6 sm:p-8 rounded-3xl sm:rounded-[40px] shadow-2xl text-center transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 border-2 sm:border-4 border-white border-opacity-60 relative overflow-hidden group`;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const floatingEmojis = isUnicornTheme
        ? ['🦄', '🌈', '🌟', '☁️', '🎈', '🍭', '🎀', '💖', '✨', '🌸']
        : ['🌙', '✨', '🪐', '💫', '🚀', '⭐', '☄️', '🔮', '👽', '🌌'];

    return (
        <div className={`font-sans overflow-hidden transition-all duration-1000 ${bgColor} min-h-screen relative`}>
            {/* Floating emojis */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 40 }).map((_, index) => (
                    <div
                        key={index}
                        className={`absolute text-3xl sm:text-4xl opacity-70 animate-float-spin`}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${Math.random() * 5 + 5}s`,
                        }}
                    >
                        {floatingEmojis[Math.floor(Math.random() * floatingEmojis.length)]}
                    </div>
                ))}
            </div>

            <div className={`relative z-10 container mx-auto px-4 py-6 sm:py-8 transform transition-all duration-1000 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h1 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-8 sm:mb-12 drop-shadow-md transition-colors duration-500 ${isUnicornTheme ? 'text-purple-800' : 'text-yellow-200'}`}>
                    Playschool Admin Dashboard
                </h1>

                {/* Responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                    {/* Map cards dynamically */}
                    {[
                        {
                            path: '/attendance',
                            title: '📅 Attendance Tracker',
                            desc: 'Mark daily attendance and manage student records.',
                            bg: isUnicornTheme ? 'from-pink-300 to-purple-300' : 'from-gray-800 to-purple-800',
                            titleColor: isUnicornTheme ? 'text-purple-800' : 'text-pink-300',
                            descColor: isUnicornTheme ? 'text-gray-800' : 'text-gray-200',
                        },
                        {
                            path: '/growth-tracker',
                            title: '📈 Growth Monitor',
                            desc: "Track child's physical development and milestones.",
                            bg: isUnicornTheme ? 'from-blue-300 to-green-300' : 'from-purple-800 to-blue-800',
                            titleColor: isUnicornTheme ? 'text-purple-800' : 'text-yellow-300',
                            descColor: isUnicornTheme ? 'text-gray-800' : 'text-gray-200',
                        },
                        {
                            path: '/nutrition-tracker',
                            title: '🍎 Nutrition Tracker',
                            desc: 'Log meals and manage dietary plans for each child.',
                            bg: isUnicornTheme ? 'from-yellow-300 to-pink-300' : 'from-blue-800 to-pink-800',
                            titleColor: isUnicornTheme ? 'text-purple-800' : 'text-blue-300',
                            descColor: isUnicornTheme ? 'text-gray-800' : 'text-gray-200',
                        },
                        {
                            path: '/daily-activities',
                            title: '🎨 Daily Activities',
                            desc: 'Plan and record creative and physical activities.',
                            bg: isUnicornTheme ? 'from-pink-300 to-blue-300' : 'from-gray-800 to-blue-800',
                            titleColor: isUnicornTheme ? 'text-purple-800' : 'text-pink-300',
                            descColor: isUnicornTheme ? 'text-gray-800' : 'text-gray-200',
                        },
                        {
                            path: '/learning',
                            title: '📚 Learning Progress',
                            desc: 'Monitor academic and foundational learning progress.',
                            bg: isUnicornTheme ? 'from-blue-300 to-purple-300' : 'from-purple-800 to-pink-800',
                            titleColor: isUnicornTheme ? 'text-purple-800' : 'text-yellow-300',
                            descColor: isUnicornTheme ? 'text-gray-800' : 'text-gray-200',
                        },
                        {
                            path: '/notifications',
                            title: '🔔 Notifications',
                            desc: 'Send important alerts and messages to parents.',
                            bg: isUnicornTheme ? 'from-yellow-300 to-pink-300' : 'from-blue-800 to-pink-800',
                            titleColor: isUnicornTheme ? 'text-purple-800' : 'text-blue-300',
                            descColor: isUnicornTheme ? 'text-gray-800' : 'text-gray-200',
                        },
                    ].map((card, idx) => (
                        <Link key={idx} to={card.path} className={`animate-fade-in delay-${idx % 3}`}>
                            <div className={`${cardBaseClasses} bg-gradient-to-br ${card.bg}`}>
                                <h3 className={`text-xl sm:text-2xl font-semibold mb-2 transition-colors duration-500 ${card.titleColor}`}>
                                    {card.title}
                                </h3>
                                <p className={`text-sm sm:text-base transition-colors duration-500 ${card.descColor}`}>
                                    {card.desc}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Custom animation styles */}
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
                @keyframes fade-in {
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                    opacity: 0;
                }
                .delay-0 { animation-delay: 0s; }
                .delay-1 { animation-delay: 0.5s; }
                .delay-2 { animation-delay: 1s; }
                `}
            </style>
        </div>
    );
};

export default AdminDashboard;
