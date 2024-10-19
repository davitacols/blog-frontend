import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({ email: '', bio: '' });

    // Updated base URL for the API
    const API_BASE_URL = 'http://127.0.0.1:8000/api/blog';

    // Create an axios instance with a request interceptor
    const axiosInstance = axios.create();
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Fetch user profile from the API
    // Fetch user profile from the API
    const fetchProfile = async () => {
        const username = localStorage.getItem('username');
        if (!username) {
            setError('No username found. Please log in again.');
            return;
        }
        try {
            // Fetch profile using the updated URL with username
            const response = await axiosInstance.get(`${API_BASE_URL}/profile/${username}/`);
            setProfile(response.data);
            setUpdatedProfile({ email: response.data.email, bio: response.data.bio || '' });
        } catch (error) {
            handleApiError(error, 'fetching profile');
        }
    };


    useEffect(() => {
        fetchProfile();
    }, []);

    // Handle changes in the input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
    };

    // Handle form submission to update profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update profile using the updated URL
            const { data } = await axiosInstance.put(`${API_BASE_URL}/profile/${profile.username}/`, updatedProfile);
            setProfile(data);
            setIsEditing(false);
            setSuccessMessage('Profile updated successfully!');
            setError('');
            // Fetch the profile again to ensure we have the latest data
            fetchProfile();
        } catch (error) {
            handleApiError(error, 'updating profile');
        }
    };

    // Handle API errors
    const handleApiError = (error, action) => {
        console.error(`Error ${action}:`, error);
        setSuccessMessage('');
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    setError('Your session has expired. Please log in again.');
                    // Implement logout functionality here
                    // For example: logout();
                    break;
                case 403:
                    setError('You do not have permission to perform this action.');
                    break;
                default:
                    setError(`An error occurred while ${action}. Please try again later.`);
            }
        } else if (error.request) {
            setError('No response received from the server. Please check your internet connection.');
        } else {
            setError(`An unexpected error occurred while ${action}. Please try again.`);
        }
    };

    if (!profile) return <div className="user-profile__loading">Loading...</div>;

    return (
        <div className="user-profile">
            <h2 className="user-profile__title">{profile.username}'s Profile</h2>
            {error && <p className="user-profile__error">{error}</p>}
            {successMessage && <p className="user-profile__success">{successMessage}</p>}

            {isEditing ? (
                <form onSubmit={handleSubmit} className="user-profile__form">
                    <div className="user-profile__form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={updatedProfile.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="user-profile__form-group">
                        <label htmlFor="bio">Bio:</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={updatedProfile.bio}
                            onChange={handleInputChange}
                            placeholder="Tell us about yourself..."
                        />
                    </div>
                    <div className="user-profile__button-group">
                        <button type="submit" className="user-profile__button user-profile__button--primary">Save</button>
                        <button type="button" onClick={() => {
                            setIsEditing(false);
                            setUpdatedProfile({ email: profile.email, bio: profile.bio || '' });
                        }} className="user-profile__button">Cancel</button>
                    </div>
                </form>
            ) : (
                <div className="user-profile__info">
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Bio:</strong> {profile.bio || 'No bio provided'}</p>
                    <button onClick={() => setIsEditing(true)} className="user-profile__button user-profile__button--primary">Edit Profile</button>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
