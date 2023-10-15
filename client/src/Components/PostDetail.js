import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PostDetail = () => {
    const { postId } = useParams();
    console.log('postId:', postId);
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:4000/post/${postId}`, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                setPost(response.data.post);
                console.log('post: ', response.data.post)
            } catch (error) {
                console.error('Error fetching post: ', error);
            }
        };

        fetchPost();
    }, [postId]);

    return (
        <div>
            {post ? (
                <div>
                    <h2>{post.title}</h2>
                    <p>{post.body}</p>
                    <p>Author: {post.author.username}</p>
                    <p>Likes: {post.likes}</p>
                    <hr />
                    <p>Comments:</p>
                    {post.comments.map(comment => (
                        <div key={comment._id}>
                            <p>Author: {comment.author.username}</p>
                            <p>{comment.comment}</p>
                            <p>Likes: {comment.likes}</p>
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