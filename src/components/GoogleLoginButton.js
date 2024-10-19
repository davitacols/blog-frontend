// src/components/GoogleLoginButton.js
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import './GoogleLoginButton.css';

const GoogleLoginButton = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const responseGoogle = async (credentialResponse) => {
        const { credential } = credentialResponse;

        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://127.0.0.1:8000/api/users/google-login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: credential }),
            });

            if (res.ok) {
                const data = await res.json();
                console.log('Login successful:', data);

                // Ensure the response contains the expected data
                if (data.authToken && data.username) {
                    // Store the token and user info locally
                    localStorage.setItem('token', data.authToken); // Store as 'token' instead of 'access'
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('user', JSON.stringify(data));

                    // Use the navigate function to redirect
                    navigate('/');
                } else {
                    throw new Error('Invalid response from server');
                }
            } else {
                const errorData = await res.json();
                console.error('Login failed:', errorData);
                setError(errorData.detail || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during Google login:', error);
            setError('An error occurred while logging in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="google-login-button-wrapper">
            {error && <p className="error-message">{error}</p>}
            <GoogleLogin
                onSuccess={responseGoogle}
                onError={(error) => {
                    console.error('Login failed:', error);
                    setError('An error occurred while logging in. Please try again.');
                }}
                className="google-login-button"
            />
        </div>
    );
};

export default GoogleLoginButton;