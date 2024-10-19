import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, User, Tag, Folder, Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './BlogPostList.css';

const API_BASE_URL = 'http://127.0.0.1:8000/api/blog';

const BlogPostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const navigate = useNavigate();

    const getTokenFromLocalStorage = useCallback(() => localStorage.getItem('token'), []);

    const handleAuthError = useCallback(() => {
        localStorage.removeItem('token');
        setError('Your session has expired. Please log in again.');
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    }, [navigate]);

    const fetchData = useCallback(async (endpoint, errorMessage) => {
        const token = getTokenFromLocalStorage();
        if (!token) throw new Error('No authentication token found');

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
            handleAuthError();
            return null;
        }

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        return response.json();
    }, [getTokenFromLocalStorage, handleAuthError]);

    const fetchPosts = useCallback(async (page = 1, category = '', tags = []) => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams({ page, category, tags: tags.join(',') }).toString();
            const data = await fetchData(`/posts/?${queryParams}`, 'Failed to fetch posts');
            if (data && Array.isArray(data)) {
                setPosts(data);
            }
        } catch (err) {
            setError(err.message || 'An error occurred while fetching posts');
        } finally {
            setLoading(false);
        }
    }, [fetchData]);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await fetchData('/categories', 'Failed to fetch categories');
            if (data) setCategories(data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    }, [fetchData]);

    const fetchTags = useCallback(async () => {
        try {
            const data = await fetchData('/tags', 'Failed to fetch tags');
            if (data) setTags(data);
        } catch (err) {
            console.error('Failed to fetch tags:', err);
        }
    }, [fetchData]);

    useEffect(() => {
        fetchPosts(currentPage, selectedCategory, selectedTags);
        fetchCategories();
        fetchTags();
    }, [fetchPosts, fetchCategories, fetchTags, currentPage, selectedCategory, selectedTags]);

    const handlePageChange = (newPage) => setCurrentPage(newPage);
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };
    const handleTagToggle = (tag) => {
        setSelectedTags(prevTags => 
            prevTags.includes(tag)
                ? prevTags.filter(t => t !== tag)
                : [...prevTags, tag]
        );
        setCurrentPage(1);
    };

    const calculateReadingTime = (content) => {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    };

    if (loading) return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="loading">Loading posts...</motion.div>;

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="blog-container"
        >
            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="error-alert"
                >
                    <p>{error}</p>
                </motion.div>
            )}

            <div className="sidebar">
                <motion.div 
                    className="category-filter"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Folder className="filter-icon" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="category-select"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </motion.div>

                <motion.div 
                    className="tag-filter"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Tag className="filter-icon" />
                    <div className="tags-list">
                        {tags.map((tag) => (
                            <motion.button 
                                key={tag.id} 
                                className={`tag-item ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                                onClick={() => handleTagToggle(tag.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {tag.name}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="posts-content">
                <AnimatePresence>
                    {posts.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="no-posts"
                        >
                            No posts found
                        </motion.div>
                    ) : (
                        <motion.div 
                            className="posts-grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {posts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 50 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link to={`/blog/${post.id}`} className="post-card">
                                        <article className="post-card-content">
                                            <div className="post-header">
                                                {post.featured_image && (
                                                    <img src={post.featured_image} alt="Post Featured" className="post-image" />
                                                )}
                                                <div className="post-details">
                                                    <div className="author-info">
                                                        <User className="avatar-icon" />
                                                        <div>
                                                            <h3 className="author-name">{post.author_username || 'Anonymous'}</h3>
                                                            <time className="post-date">
                                                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                })}
                                                            </time>
                                                        </div>
                                                    </div>
                                                    <span className="reading-time">{calculateReadingTime(post.content)}</span>
                                                </div>
                                            </div>

                                            <h2 className="post-title">{post.title}</h2>
                                            <p className="post-content">
                                                {post.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                                            </p>

                                            <div className="post-meta">
                                                {post.category && (
                                                    <span className="post-category">
                                                        <Folder className="category-icon" />
                                                        {post.category.name}
                                                    </span>
                                                )}
                                                {post.tags?.length > 0 && (
                                                    <div className="tags-container">
                                                        <Tag className="tag-icon" />
                                                        {post.tags.map((tag) => (
                                                            <span key={tag.id} className="tag">{tag.name}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div 
                    className="pagination"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <motion.button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronLeft className="icon" />
                        Previous
                    </motion.button>
                    <span className="page-info">Page {currentPage}</span>
                    <motion.button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={posts.length < 10}
                        className="pagination-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Next <ChevronRight className="icon" />
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default BlogPostList;