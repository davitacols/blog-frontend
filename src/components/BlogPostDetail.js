import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './BlogPostDetail.css';

const BlogPostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8000/api/blog/posts/${id}`);
            setPost(response.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError('Blog post not found.');
            } else {
                setError('Failed to load the blog post. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchPost();
    }, [id]);

    if (loading) {
        return <div className="blog-post-detail__loading">Loading...</div>;
    }

    if (error) {
        return <div className="blog-post-detail__error">{error}</div>;
    }

    if (!post) {
        return <div className="blog-post-detail__error">No post found.</div>;
    }

    return (
        <article className="blog-post-detail">
            <header className="blog-post-detail__header">
                <h1 className="blog-post-detail__title">{post.title}</h1>
                <div className="blog-post-detail__meta">
                    <span className="blog-post-detail__author">By {post.author.username}</span>
                    <span className="blog-post-detail__category">in {post.category.name}</span>
                </div>
            </header>
            <div className="blog-post-detail__content" dangerouslySetInnerHTML={{ __html: post.content }} />
            <footer className="blog-post-detail__footer">
                <Link to="/blog" className="blog-post-detail__back-link">← Back to all posts</Link>
            </footer>
        </article>
    );
};

export default BlogPostDetail;
