import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NewCommentForm from './NewCommentForm';
import NavBar from './NavBar';

const PostDetail = () => {
    const { postId } = useParams();
    const [comments, setComments] = useState('');
    const [post, setPost] = useState(null);
    const token = localStorage.getItem('token');
    const [editedPost, setEditedPost] = useState({ title: '', body: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/post/${postId}`, {
                headers: {
                    Authorization: `${token}`
                }
            });

            if (response.data.post.error) {
                setError(response.data.post.error);
                return;
            }

            setPost(response.data.post);
            setComments(response.data.post.comments)
        } catch (error) {
            console.error('Error fetching post: ', error);
            setError('Error fetching post');
        }
    };

    const handleLikeComment = async (commentId) => {
        try {
            const response = await axios.put(
                `http://localhost:4000/comment/like`,
                { id: commentId },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );

            if (response.data.comment.error) {
                setError(response.data.comment.error);
                return;
            }
            fetchPost();
        } catch (error) {
            console.error('Error liking post: ', error);
            setError('Error liking post');
        }
    };

    const handleEditPost = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/post`, {
                id: postId,
                title: editedPost.title,
                body: editedPost.body
            }, {
                headers: {
                    Authorization: `${token}`
                }
            });
            if (response.data.post.error) {
                setError(response.data.post.error);
                return;
            }
            fetchPost();
            setIsEditing(false);
        } catch (error) {
            console.error('Error editing post: ', error);
            setError('Error editing post');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await axios.delete(`http://localhost:4000/comment`, {
                data: { commentId, postId },
                headers: {
                    Authorization: `${token}`
                }
            });
            if (response.data.comments.error) {
                setError(response.data.comments.error);
                return;
            }
            fetchPost(); // Refresh the post data after deleting a comment
        } catch (error) {
            console.error('Error deleting comment: ', error);
            setError('Error deleting comment');
        }
    };

    return (
        <div>
            <NavBar />
            {post ? (
                <div>
                    {error && <p className="error">{error}</p>}
                    <h2>{post.title}</h2>
                    <p>{post.body}</p>
                    <p>Author: {post.author.username}</p>
                    <p>Likes: {post.likes}</p>
                    <hr />
                    {isEditing ? (
                        <div>
                            <h2>Edit post</h2>
                            <label>Title</label>
                            <input
                                type="text"
                                value={editedPost.title}
                                onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                            />
                            <label>Body</label>
                            <textarea
                                value={editedPost.body}
                                onChange={(e) => setEditedPost({ ...editedPost, body: e.target.value })}
                            ></textarea>
                            <button onClick={handleEditPost}>Edit Post</button>
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                            <hr />
                        </div>
                    ) : (
                        <button onClick={() => setIsEditing(true)}>Edit Post</button>
                    )}
                    <hr />
                    <p>Comments:</p>
                    <NewCommentForm postId={post._id} setComments={setComments} />
                    <hr />
                    {comments.map((comment) => (
                        <div key={comment._id}>
                            <p>Author: {comment.author.username}</p>
                            <p>{comment.comment}</p>
                            <p>Likes: {comment.likes}</p>
                            <button onClick={() => handleLikeComment(comment._id)}>Like</button>
                            <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                            <hr />
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default PostDetail;