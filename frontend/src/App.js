import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import Sidebar from './components/Dashboard/Sidebar';
import Header from './components/Dashboard/Header';
import Appointments from './components/Appointments';
import Doctors from './components/Doctors';
import Patients from './components/Patients';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleSignup = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isAuthenticated) {
    return showSignup ? (
      <Signup
        onSignup={handleSignup}
        onSwitchToLogin={() => setShowSignup(false)}
      />
    ) : (
      <Login
        onLogin={handleLogin}
        onSwitchToSignup={() => setShowSignup(true)}
      />
    );
  }

  const MainLayout = ({ children }) => (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Header user={user} onLogout={handleLogout} />
        <div className="dashboard-content">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={<Dashboard user={user} onLogout={handleLogout} />}
        />
        <Route
          path="/appointments"
          element={
            <MainLayout>
              <Appointments />
            </MainLayout>
          }
        />
        <Route
          path="/doctors"
          element={
            <MainLayout>
              <Doctors />
            </MainLayout>
          }
        />
        <Route
          path="/patients"
          element={
            <MainLayout>
              <Patients />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;