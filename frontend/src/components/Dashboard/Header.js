import React from 'react';
import './Header.css';

const Header = ({ user, onLogout }) => {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h2>Hospital Management System</h2>
      </div>

      <div className="header-right">
        <div className="user-info">
          <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          <span>🚪</span> Logout
        </button>
      </div>
    </header>
  );
};

export default Header;