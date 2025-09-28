import React, { useState, useRef, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = ({ theme }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Swipe-to-close logic
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (sidebarOpen && touchStartX.current - touchEndX.current > 50) {
            setSidebarOpen(false); // swipe left closes sidebar
        }
    };

    const bgColor =
        theme === 'unicorn'
            ? 'bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100'
            : 'bg-gradient-to-br from-gray-900 via-purple-950 to-blue-950 text-white';

    return (
        <div
            className={`flex min-h-screen transition-all duration-1000 ${bgColor}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Sidebar */}
            <Sidebar
                theme={theme}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Hamburger Button */}
                <div className="md:hidden flex items-center p-4 z-50 relative">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className={`p-2 rounded-full focus:outline-none ${theme === 'unicorn' ? 'bg-white/30 text-purple-800' : 'bg-gray-700/30 text-gray-200'
                            }`}
                    >
                        <svg
                            className="w-7 h-7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="ml-4 font-bold text-lg">Admin Panel</h1>
                </div>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
