import axios from 'axios';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Ensure this matches your server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for adding the token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token'); // Retrieve token from local storage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Set authorization header
    console.log('Token added to request:', token); // Log token for debugging
  }
  return config; // Return the updated config
});

// Function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    console.error('Response error:', error.response.data);
    return error.response.data || { detail: 'An error occurred' };
  } else if (error.request) {
    console.error('Request error:', error.request);
    return { detail: 'No response from server' };
  } else {
    console.error('Error:', error.message);
    return { detail: 'An error occurred' };
  }
};

// Function to register a new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/users/register/', userData);
    return response.data;
  } catch (error) {
    throw handleApiError(error); // Use error handler
  }
};

// Function to log in a user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/users/login/', credentials); // Updated endpoint
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message || 'Login failed';
    throw new Error(errorMsg);
  }
};

// Function to fetch a list of posts
export const getPosts = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/api/blog/posts/?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message || 'Failed to fetch posts';
    throw new Error(errorMsg);
  }
};

// Function to create a new post
export const createPost = async (postData) => {
  try {
    const response = await api.post('/api/blog/posts/', postData);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message || 'Failed to create post';
    throw new Error(errorMsg);
  }
};

// Function to update an existing post
export const updatePost = async (postId, postData) => {
  try {
    const response = await api.put(`/api/blog/posts/${postId}/`, postData);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message || 'Failed to update post';
    throw new Error(errorMsg);
  }
};

// Function to delete a post
export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/api/blog/posts/${postId}/`);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message || 'Failed to delete post';
    throw new Error(errorMsg);
  }
};

// Function to fetch the details of a specific post by ID
export const getPostDetail = async (postId) => {
  try {
    const response = await api.get(`/api/blog/posts/${postId}/`); // Correct endpoint for post detail
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message || 'Failed to fetch post detail';
    throw new Error(errorMsg);
  }
};

export default api;
