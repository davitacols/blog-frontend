import axios from 'axios';

// Create an Axios instance with enhanced debugging and error handling
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/', // Use environment variable for the base URL
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json', // Specify content type
    Accept: 'application/json', // Specify accepted response type
  },
});

// Request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`Sending ${config.method?.toUpperCase()} request to ${config.url} with data:`, config.data);
    return config;
  },
  (error) => {
    console.error('Request setup error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log(`Received response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out:', error.message);
    } else if (error.response) {
      console.error(`Server responded with error (${error.response.status}):`, error.response.data);
    } else if (error.request) {
      console.error('No response received from server:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
