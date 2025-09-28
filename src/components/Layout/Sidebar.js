import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ theme, sidebarOpen, setSidebarOpen }) => {
    const isUnicornTheme = theme === 'unicorn';
    const linkBaseClasses = `flex items-center px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105`;
    const activeLinkClasses = isUnicornTheme ? 'bg-purple-300 text-white shadow-md' : 'bg-purple-700 text-white shadow-md';
    const inactiveLinkClasses = isUnicornTheme ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-300 hover:bg-gray-700';

    return (
        <aside
            className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:inset-auto
        ${isUnicornTheme ? 'bg-white/70 backdrop-blur-md' : 'bg-gray-800/70 text-white backdrop-blur-md'}
        shadow-2xl
        flex flex-col
      `}
        >
            {/* Mobile Close Button */}
            <div className="flex justify-between items-center p-4 md:hidden">
                <span className="font-bold text-lg">Menu</span>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-800 dark:text-gray-200 focus:outline-none z-50"
                >
                    ✖️
                </button>
            </div>

            {/* Sidebar Links */}
            <nav className="mt-4 space-y-4 px-4 flex-1 overflow-y-auto">
                {[
                    { path: '/admin-dashboard', icon: '🏠', label: 'Dashboard' },
                    { path: '/attendance', icon: '📅', label: 'Attendance' },
                    { path: '/growth-tracker', icon: '📈', label: 'Growth Tracker' },
                    { path: '/nutrition-tracker', icon: '🍎', label: 'Nutrition' },
                    { path: '/daily-activities', icon: '🎨', label: 'Daily Activities' },
                    { path: '/learning', icon: '📚', label: 'Learning' },
                    { path: '/notifications', icon: '📢', label: 'Notifications' },
                ].map((link, idx) => (
                    <NavLink
                        key={idx}
                        to={link.path}
                        onClick={() => setSidebarOpen(false)} // closes sidebar on mobile
                        className={({ isActive }) => `${linkBaseClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
                    >
                        <span className="mr-3">{link.icon}</span> {link.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
