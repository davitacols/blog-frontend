import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './BlogPostDetail.css';

const BlogPostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sample post for demonstration
    const samplePost = {
        id: 1,
        title: 'Sample Blog Post Title',
        author: { username: 'Sample Author' },
        category: { name: 'Sample Category' },
        content: `<p>This is a sample blog post content for demonstration purposes. 
                   You can replace this with real content fetched from your API.</p>`,
    };

    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/blog/posts/${id}/`); // Adjusted to your API endpoint
            setPost(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching post:', error);
            setError('Failed to load the blog post. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    if (loading) return <div className="blog-post-detail__loading">Loading...</div>;
    if (error) return <div className="blog-post-detail__error">{error}</div>;
    
    // If no post is found, use the sample post
    const displayPost = post || samplePost;

    return (
        <article className="blog-post-detail">
            <header className="blog-post-detail__header">
                <h1 className="blog-post-detail__title">{displayPost.title}</h1>
                <div className="blog-post-detail__meta">
                    <span className="blog-post-detail__author">By {displayPost.author.username}</span>
                    <span className="blog-post-detail__category">in {displayPost.category.name}</span>
                </div>
            </header>
            <div className="blog-post-detail__content" dangerouslySetInnerHTML={{ __html: displayPost.content }} />
            <footer className="blog-post-detail__footer">
                <Link to="/blog" className="blog-post-detail__back-link">← Back to all posts</Link>
            </footer>
        </article>
    );
};

export default BlogPostDetail;
