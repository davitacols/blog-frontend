import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({});

    const fetchProfile = async () => {
        try {
            const response = await axios.get('/api/profile/');
            setProfile(response.data);
            setUpdatedProfile(response.data);
        } catch (err) {
            setError('Error fetching profile. Please try again later.');
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('/api/users/profile/', updatedProfile);
            setProfile(response.data);
            setIsEditing(false);
            setError('');
        } catch (err) {
            setError('Error updating profile. Please try again.');
        }
    };

    if (!profile) return <div className="user-profile__loading">Loading...</div>;

    return (
        <div className="user-profile">
            <h2 className="user-profile__title">{profile.username}'s Profile</h2>
            {error && <p className="user-profile__error">{error}</p>}
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
                            value={updatedProfile.bio || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="user-profile__button-group">
                        <button type="submit" className="user-profile__button user-profile__button--primary">Save</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="user-profile__button">Cancel</button>
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