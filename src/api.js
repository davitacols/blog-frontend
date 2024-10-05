import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for adding token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const handleApiError = (error) => {
  if (error.response) {
    console.error('Response error:', error.response.data);
    return error.response.data.detail || 'An error occurred';
  } else if (error.request) {
    console.error('Request error:', error.request);
    return 'No response from server';
  } else {
    console.error('Error:', error.message);
    return 'An error occurred';
  }
};

// Add registerUser function
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/auth/registration/', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/api/users/login/', credentials);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message || 'Login failed';
    throw new Error(errorMsg);
  }
};

// Posts-related API calls remain the same
export const getPosts = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/api/blog/posts/?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message || 'Failed to fetch posts';
    throw new Error(errorMsg);
  }
};

export const createPost = async (postData) => {
  try {
    const response = await api.post('/api/blog/posts/', postData);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message || 'Failed to create post';
    throw new Error(errorMsg);
  }
};

export const updatePost = async (postId, postData) => {
  try {
    const response = await api.put(`/api/blog/posts/${postId}/`, postData);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message || 'Failed to update post';
    throw new Error(errorMsg);
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/api/blog/posts/${postId}/`);
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message || 'Failed to delete post';
    throw new Error(errorMsg);
  }
};

export default api;