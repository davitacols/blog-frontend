import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BlogPostList.css';

const BlogPostList = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('/api/blog/posts/'); // Adjust to your API endpoint
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="blog-post-list">
            <h2 className="blog-post-list__title">Latest Blog Posts</h2>
            <div className="blog-post-list__grid">
                {posts.map((post) => (
                    <div key={post.id} className="blog-post-card">
                        <h3 className="blog-post-card__title">{post.title}</h3>
                        <p className="blog-post-card__excerpt">{post.content.substring(0, 100)}...</p>
                        <div className="blog-post-card__footer">
                            <span className="blog-post-card__date">{post.date}</span>
                            <Link to={`/post/${post.id}`} className="blog-post-card__link">
                                Read more
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogPostList;