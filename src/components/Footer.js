import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Github, 
    Twitter, 
    Linkedin, 
    Mail,
    Heart
} from 'lucide-react';
import './Footer.css'

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section">
                    <h3 className="footer-title">DevConn</h3>
                    <p className="footer-description">
                        Connecting developers worldwide. Share, learn, and grow together 
                        in our vibrant community.
                    </p>
                    <div className="social-links">
                        <a href="https://github.com" aria-label="GitHub" className="social-icon">
                            <Github size={20} />
                        </a>
                        <a href="https://twitter.com" aria-label="Twitter" className="social-icon">
                            <Twitter size={20} />
                        </a>
                        <a href="https://linkedin.com" aria-label="LinkedIn" className="social-icon">
                            <Linkedin size={20} />
                        </a>
                    </div>
                </div>

                <div className="footer-section">
                    <h4 className="footer-subtitle">Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/blog">Blog</Link></li>
                        <li><Link to="/careers">Careers</Link></li>
                        <li><Link to="/support">Support</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4 className="footer-subtitle">Resources</h4>
                    <ul className="footer-links">
                        <li><Link to="/tutorials">Tutorials</Link></li>
                        <li><Link to="/documentation">Documentation</Link></li>
                        <li><Link to="/community">Community</Link></li>
                        <li><Link to="/events">Events</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4 className="footer-subtitle">Legal</h4>
                    <ul className="footer-links">
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms of Service</Link></li>
                        <li><Link to="/cookies">Cookie Policy</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p className="copyright">
                    &copy; {new Date().getFullYear()} DevConn. All rights reserved.
                </p>
                <p className="made-with">
                    Made with <Heart size={16} className="heart-icon" /> by David Ansa for Developers
                </p>
            </div>
        </footer>
    );
};

export default Footer;