import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        console.log('useEffect')
        if (!token) {
            console.log('no token')
            navigate('/login');
        } else {
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
        
        console.log('tuaj')
        fetchPosts();
    }
    }, [token, navigate]);

    return (
        <div>
            <h2>Recent Posts</h2>
            {posts.length > 0 ? (
                <ul>
                    {posts.map(post => (
                        <li key={post._id}>
                            <Link to={`/post/${post._id}`}>
                                <h3>{post.title}</h3>
                            </Link>
                            <p>{post.body}</p>
                            <p>Author: {post.author}</p>
                            <p>Likes: {post.likes}</p>
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