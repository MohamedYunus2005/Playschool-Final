// src/components/Layout/PublicLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const PublicLayout = ({ theme, setTheme }) => {
    // The main background is handled by the individual pages
    return (
        <>
            <Navbar theme={theme} setTheme={setTheme} />
            <div> {/* Add padding for the fixed navbar */}
                <Outlet />
            </div>
        </>
    );
};

export default PublicLayout;