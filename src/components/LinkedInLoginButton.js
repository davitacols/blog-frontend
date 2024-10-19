import React from 'react';
import { Linkedin } from 'lucide-react';
import './LinkedInLoginButton.css';

const LinkedInLoginButton = () => {
  const linkedInLoginUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.REACT_APP_LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REACT_APP_LINKEDIN_REDIRECT_URI)}&scope=r_liteprofile%20r_emailaddress`;

  const handleLogin = () => {
    window.location.href = linkedInLoginUrl;
  };

  return (
    <button onClick={handleLogin} className="linkedin-login-button">
      <Linkedin size={30} className="linkedin-icon" />
      <span>Login with LinkedIn</span>
    </button>
  );
};

export default LinkedInLoginButton;
