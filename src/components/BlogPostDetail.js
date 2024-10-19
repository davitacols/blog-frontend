import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils/auth';
import Spinner from './Spinner';
import Toast from './Toast';
import { Heart, Bookmark, MessageSquare, Edit, Trash, Tag } from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api/blog/';

const BlogPostDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [likesCount, setLikesCount] = useState(0);
    const [bookmarksCount, setBookmarksCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState('');
    const [loadingAction, setLoadingAction] = useState(false);
    const [tags, setTags] = useState([]);
    const [loadingTags, setLoadingTags] = useState(false);
    const [tagError, setTagError] = useState(null);

    const fetchPost = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            const postResponse = await axios.get(`${API_BASE_URL}/posts/${slug}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setPost(postResponse.data);
            setLikesCount(postResponse.data.likes_count);
            setBookmarksCount(postResponse.data.bookmarks_count);
            setIsLiked(postResponse.data.is_liked);
            setIsBookmarked(postResponse.data.is_bookmarked);

            const commentsResponse = await axios.get(`${API_BASE_URL}/posts/${slug}/comments/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setComments(commentsResponse.data);

            // Fetch tags
            setLoadingTags(true);
            try {
                const tagsResponse = await axios.get(`${API_BASE_URL}/posts/${slug}/tags/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setTags(tagsResponse.data);
            } catch (tagErr) {
                console.error('Error fetching tags:', tagErr);
                setTagError('Failed to fetch tags. They may not be displayed correctly.');
            } finally {
                setLoadingTags(false);
            }

        } catch (err) {
            console.error('Error fetching post:', err);
            setError(err.response?.data?.detail || 'An error occurred while fetching the post.');
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    const handleLike = async () => {
        setLoadingAction(true);
        try {
            const token = getToken();
            const response = await axios.post(`${API_BASE_URL}/posts/${slug}/like/`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setIsLiked(response.data.is_liked);
            setLikesCount(response.data.likes_count);
        } catch (err) {
            setError('Failed to like the post. Please try again.');
        } finally {
            setLoadingAction(false);
        }
    };

    const handleBookmark = async () => {
        setLoadingAction(true);
        try {
            const token = getToken();
            const response = await axios.post(`${API_BASE_URL}/posts/${slug}/bookmark/`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setIsBookmarked(response.data.is_bookmarked);
            setBookmarksCount(response.data.bookmarks_count);
        } catch (err) {
            setError('Failed to bookmark the post. Please try again.');
        } finally {
            setLoadingAction(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setLoadingAction(true);
        try {
            const token = getToken();
            const response = await axios.post(`${API_BASE_URL}/posts/${slug}/comments/`, 
                { content: newComment },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setComments([...comments, response.data]);
            setNewComment('');
            setSuccessMessage('Comment added successfully!');
        } catch (err) {
            setError('Failed to add comment. Please try again.');
        } finally {
            setLoadingAction(false);
        }
    };

    const handleEditComment = async (commentId, content) => {
        setLoadingAction(true);
        try {
            const token = getToken();
            const response = await axios.put(`${API_BASE_URL}/comments/${commentId}/`, 
                { content },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setComments(comments.map(c => c.id === commentId ? response.data : c));
            setEditingCommentId(null);
            setEditingCommentContent('');
            setSuccessMessage('Comment updated successfully!');
        } catch (err) {
            setError('Failed to update comment. Please try again.');
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        
        setLoadingAction(true);
        try {
            const token = getToken();
            await axios.delete(`${API_BASE_URL}/comments/${commentId}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setComments(comments.filter(c => c.id !== commentId));
            setSuccessMessage('Comment deleted successfully!');
        } catch (err) {
            setError('Failed to delete comment. Please try again.');
        } finally {
            setLoadingAction(false);
        }
    };

    const handleDeletePost = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        
        setLoadingAction(true);
        try {
            const token = getToken();
            await axios.delete(`${API_BASE_URL}/posts/${slug}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSuccessMessage('Post deleted successfully!');
            navigate('/'); // Redirect to home page or post list
        } catch (err) {
            setError('Failed to delete post. Please try again.');
        } finally {
            setLoadingAction(false);
        }
    };

    if (loading) return <Spinner />;
    if (error) return <Toast message={error} type="error" />;
    if (!post) return <Toast message="Post not found" type="error" />;

    return (
        <div className="blog-post-detail max-w-4xl mx-auto p-6">
            {successMessage && <Toast message={successMessage} type="success" />}
            
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-600 mb-2">By {post.author} on {new Date(post.created_at).toLocaleDateString()}</p>

            {/* Display tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                {loadingTags ? (
                    <Spinner size="small" />
                ) : (
                    tags.map(tag => (
                        <span key={tag.id} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                            <Tag size={14} className="inline mr-1" />
                            {tag.name}
                        </span>
                    ))
                )}
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
                <button 
                    onClick={handleLike} 
                    disabled={loadingAction}
                    className={`flex items-center ${isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                >
                    <Heart className="mr-2" />
                    {likesCount} Likes
                </button>
                <button 
                    onClick={handleBookmark} 
                    disabled={loadingAction}
                    className={`flex items-center ${isBookmarked ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500`}
                >
                    <Bookmark className="mr-2" />
                    {bookmarksCount} Bookmarks
                </button>
            </div>

            <div dangerouslySetInnerHTML={{ __html: post.content }} />

            <div className="comments mt-8">
                <h3 className="text-2xl font-semibold mb-4">Comments</h3>

                {comments.length === 0 ? (
                    <p>No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="mb-4 p-4 border rounded shadow-sm">
                            <p className="mb-2">{comment.content}</p>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>By {comment.author} on {new Date(comment.created_at).toLocaleDateString()}</span>
                                <div className="space-x-2">
                                    <button 
                                        onClick={() => { setEditingCommentId(comment.id); setEditingCommentContent(comment.content); }} 
                                        className="hover:underline"
                                    >
                                        <Edit size={14} className="inline" /> Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteComment(comment.id)} 
                                        className="text-red-500 hover:underline"
                                    >
                                        <Trash size={14} className="inline" /> Delete
                                    </button>
                                </div>
                            </div>

                            {editingCommentId === comment.id && (
                                <form onSubmit={() => handleEditComment(comment.id, editingCommentContent)} className="mt-2">
                                    <textarea
                                        value={editingCommentContent}
                                        onChange={e => setEditingCommentContent(e.target.value)}
                                        rows="3"
                                        className="w-full border rounded p-2"
                                        required
                                    />
                                    <div className="flex justify-end space-x-2 mt-2">
                                        <button 
                                            type="button" 
                                            onClick={() => setEditingCommentId(null)} 
                                            className="px-4 py-2 border rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={loadingAction}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                        >
                                            {loadingAction ? 'Updating...' : 'Update'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ))
                )}

                <form onSubmit={handleCommentSubmit} className="mt-4">
                    <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        rows="4"
                        className="w-full border rounded p-2 mb-2"
                        placeholder="Write your comment..."
                        required
                    />
                    <button 
                        type="submit" 
                        disabled={loadingAction || newComment.trim() === ''}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                        {loadingAction ? 'Submitting...' : 'Add Comment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BlogPostDetail; 