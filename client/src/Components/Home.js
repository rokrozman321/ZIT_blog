import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import NewPostForm from './NewPostForm';
import NavBar from './NavBar';

const Home = ({setIsAuthenticated}) => {
    const [posts, setPosts] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        console.log('useEffect')
        if (!token) {
            console.log('no token')
            navigate('/login');
        } else {
                console.log('tuaj')
            fetchPosts();
        }
    }, [token, navigate]);

    const fetchPosts = async () => {
        try {
            console.log('fetch posts')
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:4000/post', {
                headers: {
                    Authorization: `${token}`
                }
            });
            setPosts(response.data.posts);
            //setPosts(response.data.posts.map(post => post.posts).flat());
        } catch (error) {
            console.error('Error fetching posts: ', error);
        }
    };

    const handleLikePost = async (postId) => {
        try {
            const response = await axios.put(
                `http://localhost:4000/post/like`,
                { id: postId },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            console.log(response.data);
            // Call fetchPosts again to update the posts
            fetchPosts();
        } catch (error) {
            console.error('Error liking post: ', error);
        }
    };

    const handleDeletePost = async (postId, setPosts) => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete('http://localhost:4000/post', {
            headers: {
                Authorization: `${token}`,
            },
            data: {
                id: postId,
            },
        });
        fetchPosts();
    } catch (error) {
        console.error('Error deleting post: ', error);
    }
};

    return (
        <div>
            <NavBar setIsAuthenticated={setIsAuthenticated}/>
            <h2>Recent Posts</h2>
            <NewPostForm setPosts={setPosts}/>
            {posts.length > 0 ? (
                <ul>
                    {posts.map(post => (
                        <li key={post._id}>
                            <Link to={`/post/${post._id}`}>
                                <h3>{post.title}</h3>
                            </Link>
                            <p>{post.body}</p>
                            <p>Author: {post.author.username}</p>
                            <p>Likes: {post.likes}</p>
                            <button onClick={() => handleLikePost(post._id)}>Like</button>
                            <button onClick={() => handleDeletePost(post._id, setPosts)}>Delete</button>
                            <p>Comments: {post.comments.length}</p>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No posts to display.</p>
            )}
        </div>
    );
};

export default Home;