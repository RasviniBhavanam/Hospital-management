import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🏥 Hospital</h2>
        <p>Management System</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">🏠</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/appointments" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">📅</span>
          <span>Appointments</span>
        </NavLink>

        <NavLink to="/doctors" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">👨‍⚕️</span>
          <span>Doctors</span>
        </NavLink>

        <NavLink to="/patients" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">👥</span>
          <span>Patients</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <p>© 2025 Hospital MS</p>
      </div>
    </div>
  );
};

export default Sidebar;