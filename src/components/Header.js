import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, Info, Mail, LogIn, UserPlus } from 'lucide-react';
import './Header.css';

const Header = () => {
    return (
        <header className="navbar">
            <div className="container">
                <Link to="/" className="logo-link">
                    DevConn
                </Link>
                
                <div className="search-container">
                    <form className="search-form">
                        <input
                            type="search"
                            placeholder="Search..."
                            className="search-input"
                        />
                        <button type="submit" className="search-button" aria-label="Search">
                            <Search size={20} />
                        </button>
                    </form>
                </div>
                
                <div className="nav-section">
                    <nav className="nav-links">
                        <Link to="/" className="nav-item">
                            <Home size={18} />
                            <span>Home</span>
                        </Link>
                        <Link to="/about" className="nav-item">
                            <Info size={18} />
                            <span>About</span>
                        </Link>
                        <Link to="/contact" className="nav-item">
                            <Mail size={18} />
                            <span>Contact</span>
                        </Link>
                    </nav>
                    
                    <div className="user-actions">
                        <Link to="/login" className="btn login-button">
                            <LogIn size={18} />
                            <span>Log in</span>
                        </Link>
                        <Link to="/signup" className="btn signup-button">
                            <UserPlus size={18} />
                            <span>Sign up</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;