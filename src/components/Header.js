import React, { useState } from 'react';
import { Search, Home, Info, Mail, LogIn, UserPlus, Menu, X } from 'lucide-react';
import './Header.css';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-content">
                    {/* Logo */}
                    <a href="/" className="logo gradient-text">
                        DevConn
                    </a>

                    {/* Search Bar */}
                    <div className="search-container">
                        <div className="search-wrapper">
                            <input
                                type="search"
                                placeholder="Search developers, projects..."
                                className="search-input focus-outline"
                            />
                            <button className="search-button">
                                <Search size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="nav-menu">
                        <NavLink href="/" icon={<Home size={18} />} text="Home" />
                        <NavLink href="/about" icon={<Info size={18} />} text="About" />
                        <NavLink href="/contact" icon={<Mail size={18} />} text="Contact" />
                        
                        <div className="action-buttons">
                            <ActionButton href="/login" icon={<LogIn size={18} />} text="Log in" variant="login" />
                            <ActionButton href="/signup" icon={<UserPlus size={18} />} text="Sign up" variant="signup" />
                        </div>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="mobile-menu-button"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                <div className="mobile-nav-links">
                    <MobileNavLink href="/" icon={<Home size={18} />} text="Home" />
                    <MobileNavLink href="/about" icon={<Info size={18} />} text="About" />
                    <MobileNavLink href="/contact" icon={<Mail size={18} />} text="Contact" />
                </div>
                <div className="mobile-action-buttons">
                    <MobileActionButton href="/login" icon={<LogIn size={18} />} text="Log in" />
                    <MobileActionButton href="/signup" icon={<UserPlus size={18} />} text="Sign up" />
                </div>
            </div>
        </header>
    );
};

const NavLink = ({ href, icon, text }) => (
    <a href={href} className="nav-link">
        {icon}
        <span>{text}</span>
    </a>
);

const ActionButton = ({ href, icon, text, variant }) => (
    <a
        href={href}
        className={`btn ${variant === 'signup' ? 'btn-signup' : 'btn-login'}`}
    >
        {icon}
        <span>{text}</span>
    </a>
);

const MobileNavLink = ({ href, icon, text }) => (
    <a href={href} className="mobile-nav-link">
        {icon}
        <span>{text}</span>
    </a>
);

const MobileActionButton = ({ href, icon, text }) => (
    <a href={href} className="mobile-btn">
        {icon}
        <span>{text}</span>
    </a>
);

export default Header;