import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import './UserLogin.css';

const UserLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log('User logged in:', formData);
            } catch (error) {
                setErrors({ submit: 'Login failed. Please try again.' });
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Welcome Back</h1>
                <p className="login-subtitle">Login to continue</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <div className="input-container">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={`form-input ${errors.email ? 'error' : ''}`}
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        {errors.email && (
                            <span className="error-message">
                                <AlertCircle size={16} />
                                {errors.email}
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
                            <input type="checkbox" name="remember" />
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
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>

                    {errors.submit && (
                        <div className="submit-error">
                            <AlertCircle size={16} />
                            {errors.submit}
                        </div>
                    )}
                </form>

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
