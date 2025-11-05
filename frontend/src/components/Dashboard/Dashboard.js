import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import StatsCard from './StatsCard';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    todayAppointments: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Header user={user} onLogout={onLogout} />
        <div className="dashboard-content">
          <div className="dashboard-welcome">
            <h1>Welcome, {user?.name}! 👋</h1>
            <p>Here's what's happening in your hospital today</p>
          </div>

          <div className="stats-grid">
            <StatsCard
              title="Total Patients"
              value={stats.totalPatients}
              icon="👥"
              color="#667eea"
            />
            <StatsCard
              title="Total Doctors"
              value={stats.totalDoctors}
              icon="👨‍⚕️"
              color="#f093fb"
            />
            <StatsCard
              title="Total Appointments"
              value={stats.totalAppointments}
              icon="📅"
              color="#4facfe"
            />
            <StatsCard
              title="Today's Appointments"
              value={stats.todayAppointments}
              icon="⏰"
              color="#43e97b"
            />
          </div>

          <div className="about-hospital">
            <h2>About Our Hospital Management System</h2>
            <p>
              Welcome to our comprehensive Hospital Management System designed to streamline healthcare operations
              and improve patient care. Our system provides efficient management of appointments, patient records,
              and doctor schedules all in one place.
            </p>
            <p>
              With our intuitive interface, healthcare professionals can easily access patient information,
              schedule appointments, and manage their daily tasks efficiently. We're committed to providing
              the best healthcare management solution.
            </p>

            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">📋</div>
                <h3>Patient Management</h3>
                <p>Comprehensive patient records and history tracking</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">👨‍⚕️</div>
                <h3>Doctor Management</h3>
                <p>Manage doctor profiles and specialties</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📅</div>
                <h3>Appointments</h3>
                <p>Easy appointment scheduling and management</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <h3>Analytics</h3>
                <p>Real-time statistics and insights</p>
              </div>
            </div>
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button className="action-button" onClick={() => navigate('/appointments')}>
                <span>📅</span> Manage Appointments
              </button>
              <button className="action-button" onClick={() => navigate('/doctors')}>
                <span>👨‍⚕️</span> Manage Doctors
              </button>
              <button className="action-button" onClick={() => navigate('/patients')}>
                <span>👥</span> Manage Patients
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;