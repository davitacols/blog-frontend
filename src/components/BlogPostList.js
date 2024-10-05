import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './BlogPostList.css';

function BlogPostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // To handle redirection

  useEffect(() => {
    const token = localStorage.getItem('token');

    // If no token is found, redirect to login
    if (!token) {
      console.log('No token found, redirecting to login.');
      navigate('/login');
      return; // Prevent further execution
    }

    const fetchPosts = async () => {
      try {
        console.log('Fetching posts...');
        console.log('Auth token:', token ? 'Present' : 'Not found');

        const response = await axios.get('http://127.0.0.1:8000/api/blog/posts/', {
          headers: token ? { Authorization: `Token ${token}` } : {}
        });

        console.log('API Response:', response.data);

        if (response.data && Array.isArray(response.data)) {
          setPosts(response.data); // Handle non-paginated response
        } else if (response.data.results && response.data.results.length > 0) {
          setPosts(response.data.results); // Handle paginated response
        } else {
          console.log('No posts found in the response');
        }
      } catch (err) {
        console.error('Error fetching posts:', err.response ? err.response : err);
        setError(err.response?.data?.detail || 'Failed to fetch blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]); // Add navigate to dependencies

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Latest Blog Posts</h1>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No blog posts available at the moment. 
          {localStorage.getItem('token') ? (
            <Link to="/create-post" className="alert-link ms-2">Create the first post!</Link>
          ) : (
            <Link to="/login" className="alert-link ms-2">Log in to create a post!</Link>
          )}
        </div>
      ) : (
        <div className="row">
          {posts.map(post => (
            <div key={post.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    By {post.author_username} | {new Date(post.created_at).toLocaleDateString()}
                  </h6>
                  <p className="card-text">{post.content.substring(0, 150)}...</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to={`/posts/${post.slug || post.id}`} className="btn btn-primary">
                      Read More
                    </Link>
                    <div>
                      <span className="me-2">❤️ {post.likes_count}</span>
                      <span>💬 {post.comments_count}</span>
                    </div>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-2">
                      {post.tags.map(tag => (
                        <span key={tag.id} className="badge bg-secondary me-1">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BlogPostList;
