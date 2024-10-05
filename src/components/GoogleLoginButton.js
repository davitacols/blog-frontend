// src/components/GoogleLoginButton.js

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './GoogleLoginButton.css'; // Import the CSS file

const GoogleLoginButton = () => {
    const responseGoogle = async (credentialResponse) => {
        const { credential } = credentialResponse; // Get the token from Google response

        try {
            const res = await fetch('http://127.0.0.1:8000/api/auth/google/', { // Update the URL to your backend
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tokenId: credential }), // Send the credential token to your backend
            });

            if (res.ok) {
                const data = await res.json();
                // Handle success (e.g., redirect or update state)
                console.log('Login successful:', data);
                // Example: Store token and user data in local storage
                localStorage.setItem('token', data.key); // Adjust according to your response structure
                localStorage.setItem('user', JSON.stringify(data.user)); // Adjust according to your response structure
                // Redirect to homepage or update the state
            } else {
                // Handle error
                console.error('Login failed:', res.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <GoogleLogin
            onSuccess={responseGoogle}
            onError={(error) => console.error('Login failed:', error)}
            clientId="793694365694-0fcvgv3dcdi40f3cbpkjpk4addju4i83.apps.googleusercontent.com" // Replace with your Google Client ID
            cookiePolicy={'single_host_origin'}
            className="google-login-button" // Apply the CSS class
        />
    );
};

export default GoogleLoginButton;
