import React, { useState } from 'react';
import { User, Mail, Lock, Loader } from 'lucide-react';
import axios from 'axios';

// If using Create React App, you can remove this constant and just use '/api/users/register'
// as the endpoint. Make sure you've added "proxy": "http://localhost:5000" to package.json
const API_URL = 'http://127.0.0.1:8000';

export default function UserRegistration() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear errors when user starts typing again
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/users/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      console.log('Registration successful:', response.data);
      setSuccess('User registered successfully!');
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      console.error('Registration error:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setError('Registration service is currently unavailable. Please try again later.');
          console.error('API endpoint not found. Please check the API URL:', `${API_URL}/api/users/register`);
        } else if (error.code === 'ERR_NETWORK') {
          setError('Unable to connect to the server. Please check your internet connection.');
        } else if (error.response?.status === 400) {
          setError(error.response.data.message || 'Invalid input. Please check your details.');
        } else if (error.response?.status === 409) {
          setError(error.response.data.message || 'Username or email already exists.');
        } else {
          setError('Registration failed. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create an Account</h2>
        <p className="text-sm text-gray-600 mt-1">Enter your details to register</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
              minLength={3}
              maxLength={20}
              disabled={isLoading}
              placeholder="Choose a username"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
              disabled={isLoading}
              placeholder="Enter your email"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
              minLength={8}
              disabled={isLoading}
              placeholder="Create a password"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">Must be at least 8 characters long</p>
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
              minLength={8}
              disabled={isLoading}
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
              <span>Registering...</span>
            </>
          ) : (
            'Register'
          )}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {success}
        </div>
      )}
    </div>
  );
}