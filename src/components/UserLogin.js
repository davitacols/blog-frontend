import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance'; // Custom axios instance for API calls
import { FaGoogle, FaLinkedin } from 'react-icons/fa'; // Social icons
import './UserLogin.css'; // Importing styles for UserLogin
import GoogleLoginButton from './GoogleLoginButton'; // Google Login button component
import LinkedInLoginButton from './LinkedInLoginButton'; // LinkedIn Login button component

const UserLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // Remember me state
  const navigate = useNavigate();

  // Load saved username if "Remember me" was previously checked
  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setFormData((prev) => ({ ...prev, username: savedUsername }));
      setRememberMe(true);
    }

    // Redirect to homepage if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  // Function to handle user login
  const handleUserLogin = async () => {
    setErrors({}); // Clear previous errors
    setIsLoading(true); // Set loading state

    try {
      const response = await axiosInstance.post('/api/users/login/', formData);
      const token = response.data.tokens?.access || response.data.authToken; // Extract token from response

      if (!token) {
        throw new Error('No token received from server');
      }

      // Save token and username in local storage
      localStorage.setItem('token', token);
      if (rememberMe) {
        localStorage.setItem('username', formData.username);
      } else {
        localStorage.removeItem('username');
      }

      // Redirect to home page after successful login
      navigate('/');
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear field-specific errors
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleUserLogin(); // Validate form before logging in
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required.';
    if (!formData.password) newErrors.password = 'Password is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle error scenarios
  const handleError = (error) => {
    let errorMessage = 'An error occurred during login.';

    if (error.code === 'ECONNABORTED') {
      errorMessage = 'The server is taking too long to respond. Please try again later.';
    } else if (error.response) {
      errorMessage = error.response.data.detail || 'Login failed. Please check your credentials.';
    } else if (error.request) {
      errorMessage = 'Could not connect to the server. Please check your internet connection.';
    }

    setErrors({ submit: errorMessage });
  };

  // Handle social login (e.g., Google, LinkedIn)
  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}...`);
    // Implement social login logic here
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Welcome Back!</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="sr-only">Email or Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Email or Username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              className={`login-input ${errors.username ? 'error' : ''}`}
              aria-describedby="usernameError"
            />
            {errors.username && <span className="error-message" id="usernameError">{errors.username}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={`login-input ${errors.password ? 'error' : ''}`}
              aria-describedby="passwordError"
            />
            {errors.password && <span className="error-message" id="passwordError">{errors.password}</span>}
          </div>
          <div className="form-group-inline">
            <label className="remember-me-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)} // Toggle rememberMe state
                disabled={isLoading}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot password?
            </Link>
          </div>
          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
          {errors.submit && <div className="submit-error">{errors.submit}</div>}
        </form>
        <div className="divider">OR</div>
        <div className="social-login">
          <GoogleLoginButton onClick={() => handleSocialLogin('google')} />
          <LinkedInLoginButton onClick={() => handleSocialLogin('linkedin')} />
        </div>
        <p className="signup-prompt">
          New here? <Link to="/signup" className="signup-link">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
