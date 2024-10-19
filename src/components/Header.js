import React, { useState, useEffect } from 'react';
import { Search, Bell, MessageSquare, User, Menu, X } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <a href="/" className="logo">DevConn</a>
          <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="/feed" className="nav-link">Feed</a>
          <a href="/network" className="nav-link">Network</a>
          <a href="/jobs" className="nav-link">Jobs</a>
          <a href="/learn" className="nav-link">Learn</a>
        </nav>

        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input type="text" placeholder="Search DevConnect" className="search-input" />
        </div>

        {isLoggedIn ? (
          <div className="user-controls">
            <button className="icon-button">
              <Bell size={24} />
            </button>
            <button className="icon-button">
              <MessageSquare size={24} />
            </button>
            <div className="profile-menu-container">
              <button className="profile-button" onClick={toggleProfileMenu}>
                <User size={24} />
              </button>
              {isProfileMenuOpen && (
                <div className="profile-menu">
                  <a href="/profile" className="profile-menu-item">Your Profile</a>
                  <a href="/dashboard" className="profile-menu-item">Dashboard</a>
                  <a href="/settings" className="profile-menu-item">Settings</a>
                  <button onClick={handleLogout} className="profile-menu-item">Log Out</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <a href="/login" className="login-button">Log In</a>
            <a href="/signup" className="signup-button">Sign Up</a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;