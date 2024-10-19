import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import axios from 'axios';
import { getToken } from '../utils/auth'; // Import the utility function for token retrieval
import './CreateBlogPost.css';

const CreateBlogPost = ({ existingPosts, setPosts }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (coverImage) {
      formData.append('cover_image', coverImage);
    }

    const token = getToken(); // Retrieve the token using the utility function
    console.log('Using token:', token); // Log the token for debugging

    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }

    try {
      setLoading(true); // Set loading state
      setError(''); // Clear any previous error messages

      const response = await axios.post('http://127.0.0.1:8000/api/blog/posts/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });

      console.log('Blog post created:', response.data); // Log response for debugging

      // Add the newly created post to the list of posts
      setPosts((prevPosts) => [response.data, ...prevPosts]);

      // Optionally clear the form after submission
      setTitle('');
      setContent('');
      setCoverImage(null);

    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Error creating blog post. Please try again.';
      setError(errorMessage);
      console.error('Error creating blog post:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="create-blog-post">
      <h2>Create Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
            className={error && !title ? 'error-input' : ''} // Highlight input on error
          />
        </div>
        <div className="form-group">
          <label htmlFor="coverImage">Cover Image:</label>
          <input
            type="file"
            id="coverImage"
            onChange={(e) => setCoverImage(e.target.files[0])}
            accept="image/*"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['link', 'image'],
                ['clean'], // Remove formatting button
              ],
            }}
            theme="snow"
            className={error && !content ? 'error-input' : ''} // Highlight editor on error
          />
        </div>
        {error && <p className="error-message">{error}</p>} {/* Display error messages */}
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default CreateBlogPost;
