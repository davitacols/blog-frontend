import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import './UserLogin.css';
import GoogleLoginButton from './GoogleLoginButton';

const UserLogin = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: '',
            }));
        }
    };

    const handleCheckboxChange = () => {
        setRememberMe(!rememberMe);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) {
            newErrors.username = 'Username is required';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        return newErrors;
    };

    const handleUserLogin = async () => {
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', formData);
                localStorage.setItem('token', response.data.key);
                localStorage.setItem('user', JSON.stringify(response.data.user));

                if (rememberMe) {
                    localStorage.setItem('username', formData.username);
                } else {
                    localStorage.removeItem('username');
                }

                navigate('/');
            } catch (error) {
                console.error('Login error:', error.response ? error.response.data : error);
                setErrors({ submit: 'Login failed. Please check your credentials.' });
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrors(newErrors);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUserLogin();
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Welcome Back</h1>
                <p className="login-subtitle">Login to continue</p>
                
                {/* Email/Password login form */}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <div className="input-container">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className={`form-input ${errors.username ? 'error' : ''}`}
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                defaultValue={localStorage.getItem('username') || ''}
                            />
                        </div>
                        {errors.username && (
                            <span className="error-message">
                                <AlertCircle size={16} />
                                {errors.username}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <div className="input-container">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className={`form-input ${errors.password ? 'error' : ''}`}
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        {errors.password && (
                            <span className="error-message">
                                <AlertCircle size={16} />
                                {errors.password}
                            </span>
                        )}
                    </div>

                    <div className="form-group-inline">
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={rememberMe}
                                onChange={handleCheckboxChange}
                            />
                            <span className="checkmark"></span>
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="forgot-password-link">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span> Logging in...
                            </>
                        ) : (
                            'Log In'
                        )}
                    </button>

                    {errors.submit && (
                        <div className="submit-error">
                            <AlertCircle size={16} />
                            {errors.submit}
                        </div>
                    )}
                </form>

                {/* Divider */}
                <div className="divider">
                    <span>OR</span>
                </div>

                {/* Google login button */}
                <GoogleLoginButton />

                <p className="signup-prompt">
                    New here?{' '}
                    <Link to="/signup" className="signup-link">
                        Create an account
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default UserLogin;