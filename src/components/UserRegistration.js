import React, { useState } from 'react';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { registerUser } from '../api';
import GoogleLoginButton from './GoogleLoginButton';
import './UserRegistration.css';

export default function UserRegistration() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error for the field being changed
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');
    
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
    
        setIsLoading(true);
        try {
            await registerUser({
                username: formData.username,
                email: formData.email,
                password1: formData.password,
                password2: formData.confirmPassword,
            });
    
            setSuccessMessage('Registration successful! Please verify your email.');
            setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.error('Registration error:', error);
            if (typeof error === 'object' && error !== null) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    ...Object.entries(error).reduce((acc, [key, value]) => {
                        acc[key] = Array.isArray(value) ? value.join(' ') : value;
                        return acc;
                    }, {}),
                    submit: 'Registration failed. Please check your information.'
                }));
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    submit: error.toString()
                }));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="registration-container">
            <div className="form-box">
                <h1 className="registration-title">Create an Account</h1>
                <p className="registration-subtitle">Start your journey with us</p>

                <form onSubmit={handleSubmit} className="registration-form" aria-live="polite">
                    {/* Username Field */}
                    <div className="form-group">
                        <div className="input-container">
                            <User className="input-icon" size={20} />
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className={`form-input ${errors.username ? 'error' : ''}`}
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Username"
                                required
                                aria-invalid={!!errors.username}
                            />
                        </div>
                        {errors.username && (
                            <span className="error-message" role="alert">
                                <AlertCircle size={16} />
                                {errors.username}
                            </span>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="form-group">
                        <div className="input-container">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={`form-input ${errors.email ? 'error' : ''}`}
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                                aria-invalid={!!errors.email}
                            />
                        </div>
                        {errors.email && (
                            <span className="error-message" role="alert">
                                <AlertCircle size={16} />
                                {errors.email}
                            </span>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <div className="input-container">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className={`form-input ${errors.password ? 'error' : ''}`}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                                aria-invalid={!!errors.password}
                            />
                        </div>
                        {errors.password && (
                            <span className="error-message" role="alert">
                                <AlertCircle size={16} />
                                {errors.password}
                            </span>
                        )}
                        <p className="password-hint">Must be at least 8 characters long</p>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="form-group">
                        <div className="input-container">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                                required
                                aria-invalid={!!errors.confirmPassword}
                            />
                        </div>
                        {errors.confirmPassword && (
                            <span className="error-message" role="alert">
                                <AlertCircle size={16} />
                                {errors.confirmPassword}
                            </span>
                        )}
                    </div>

                    <button type="submit" className="register-button" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner"></span> Registering...
                            </>
                        ) : (
                            'Register'
                        )}
                    </button>

                    {errors.submit && (
                        <div className="submit-error" role="alert">
                            <AlertCircle size={16} />
                            {errors.submit}
                        </div>
                    )}

                    {successMessage && (
                        <div className="success-message" role="alert">
                            {successMessage}
                        </div>
                    )}
                </form>

                <div className="divider">
                    <span>OR</span>
                </div>

                <GoogleLoginButton />

                <p className="login-prompt">
                    Already have an account?{' '}
                    <Link to="/login" className="login-link">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
