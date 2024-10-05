import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmailConfirmation.css';  // Import the CSS file

const EmailConfirmation = () => {
    const { token } = useParams();  // Extract the token from the URL
    const [confirmationStatus, setConfirmationStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);  // Loading state
    const [error, setError] = useState('');  // Error state
    const navigate = useNavigate();

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                await axios.post('http://127.0.0.1:8000/api/auth/registration/verify-email/', {
                    key: token,  // Send the token from the URL
                });

                setConfirmationStatus('Email confirmed successfully!');
                setIsLoading(false);
                setTimeout(() => {
                    navigate('/login');  // Redirect to login page after success
                }, 3000);

            } catch (error) {
                console.error('Email confirmation failed:', error.response?.data || error);
                setError(error.response?.data?.detail || 'Email confirmation failed. Please try again.');
                setIsLoading(false);
            }
        };

        confirmEmail();
    }, [token, navigate]);

    return (
        <div className="email-confirmation-container">
            <div className="email-confirmation-box">
                <h2>Email Confirmation</h2>

                {/* Display loading state */}
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <p className={error ? 'email-confirmation-error' : 'email-confirmation-success'}>
                        {error || confirmationStatus}
                    </p>
                )}
            </div>
        </div>
    );
};

export default EmailConfirmation;
