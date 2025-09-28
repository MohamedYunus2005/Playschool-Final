import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Layout/Auth/Login';
import Landing from './components/Layout/Pages/Landing';
import Register from './components/Layout/Auth/Register';

// Dashboard Components
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ParentDashboard from './components/Dashboard/ParentDashboard';
import AttendanceTracker from './components/Attendance/AttendanceTracker';
import GrowthTracker from './components/Growth/GrowthTracker';
import NutritionTracker from './components/Nutrition/NutritionTracker';
import DailyActivities from './components/Activities/DailyActivities';
import LearningPage from './components/Learning/LearningPage';
import Notifications from './components/Notifications/Notifications';

// Layout Components
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/Layout/PublicLayout';
import DashboardLayout from './components/Layout/DashboardLayout';
import AdminLayout from './components/Layout/AdminLayout';
import ThemeToggleButton from './components/ThemeToggleButton';

import './App.css';
import './index.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Temporarily set to true for easy testing
  const [theme, setTheme] = useState('unicorn');

  return (
    <Router>
      <div className="App">
        {/* Global Theme Toggle Button */}
        <div className="fixed top-4 right-4 z-[100] p-2 rounded-full shadow-lg cursor-pointer bg-white transition-colors duration-500">
          <button onClick={() => setTheme(theme === 'unicorn' ? 'moon' : 'unicorn')} className="text-gray-800 focus:outline-none">
            {theme === 'unicorn' ? (
              <span className="text-2xl" aria-label="Change to dark theme">🌙</span>
            ) : (
              <span className="text-2xl" aria-label="Change to light theme">🦄</span>
            )}
          </button>
        </div>

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout theme={theme} setTheme={setTheme} />}>
            <Route index element={<Landing theme={theme} setTheme={setTheme} />} />
            <Route path="login" element={<Login theme={theme} setTheme={setTheme} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="register" element={<Register theme={theme} setTheme={setTheme} />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
            {/* Admin Routes */}
            <Route element={<AdminLayout theme={theme} setTheme={setTheme} />}>
              <Route path="admin-dashboard" element={<AdminDashboard theme={theme} />} />
              <Route path="attendance" element={<AttendanceTracker theme={theme} />} />
              <Route path="growth-tracker" element={<GrowthTracker theme={theme} />} />
              <Route path="nutrition-tracker" element={<NutritionTracker theme={theme} />} />
              <Route path="daily-activities" element={<DailyActivities theme={theme} />} />
              <Route path="learning" element={<LearningPage theme={theme} />} />
              <Route path="notifications" element={<Notifications theme={theme} />} />
            </Route>

            {/* Parent Routes */}
            <Route element={<DashboardLayout theme={theme} setTheme={setTheme} />}>
              <Route path="parent-dashboard" element={<ParentDashboard theme={theme} />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
