import React from 'react';
import { Outlet } from 'react-router-dom';
// Removed 'Sidebar' import as it belongs exclusively in AdminLayout

const DashboardLayout = ({ theme }) => {
    // Note: The setTheme prop is removed as it wasn't used here, but keeping 'theme' for background.
    const bgColor = theme === 'unicorn' ? 'bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100' : 'bg-gradient-to-br from-gray-900 via-purple-950 to-blue-950';

    return (
        <div className={`flex min-h-screen transition-all duration-1000 ${bgColor}`}>
            {/* The Sidebar component is intentionally excluded from this generic Dashboard Layout */}

            {/* CRITICAL FIX: Ensure the content area takes full available height (flex-1, w-full, AND h-full) */}
            <div className="flex-1 overflow-auto w-full h-full">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
