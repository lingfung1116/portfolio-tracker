// Header.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import headerLogo from '../../assets/header-logo.png';

function Header({ showLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const shouldShowLogout = showLogout || location.pathname === '/dashboard';

  return (
    <header className="header">
      <div className="header-container">
        <img src={headerLogo} alt="logo" className="header-logo" />
        <h1 className="header-title">Personal Stock Portfolio Tracker</h1>
      </div>
      {/* Conditional rendering of the logout button */}
      {shouldShowLogout && (
        <div className="logout-container">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
