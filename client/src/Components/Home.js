import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import NewPostForm from "./NewPostForm";
import NavBar from "./NavBar";

const Home = ({ setIsAuthenticated }) => {
    const [posts, setPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [favoritePosts, setFavoritePosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const token = localStorage.getItem("token");
    const [searchText, setSearchText] = useState("");
    const [showFavorites, setShowFavorites] = useState(false);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            console.log("no token");
            navigate("/login");
        } else {
            fetchPosts();
        }
    }, [token, navigate]);

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:4000/post", {
                headers: {
                    Authorization: `${token}`,
                },
            });

            if (response.data.posts.error) {
                setError(response.data.posts.error);
                return;
            }

            setPosts(response.data.posts);
            setAllPosts(response.data.posts);
        } catch (error) {
            console.error("Error fetching posts: ", error);
            setError('Error fetching posts');
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
            if (response.data.post.error) {
                setError(response.data.post.error);
                return;
            }
            fetchPosts();
        } catch (error) {
            console.error("Error liking post: ", error);
            setError('Error liking post');
        }
    };

    const handleDeletePost = async (postId, setPosts) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete("http://localhost:4000/post", {
                headers: {
                    Authorization: `${token}`,
                },
                data: {
                    id: postId,
                },
            });
            if (response.data.posts.error) {
                setError(response.data.posts.error);
                return;
            }
            fetchPosts();
        } catch (error) {
            console.error("Error deleting post: ", error);
            setError('Error deleting post');
        }
    };

    useEffect(() => {
        const fPosts = posts.filter((post) => {
            const postText =
                `${post.title} ${post.body} ${post.author.username}`.toLowerCase();
            return postText.includes(searchText.toLowerCase());
        });
        console.log(filteredPosts);
        setFilteredPosts(fPosts);
        setPosts(fPosts);
        if (!searchText) {
            setPosts(allPosts);
        }
    }, [searchText]);

    useEffect(() => {
        if (showFavorites) {
            getFavoritePosts();
        } else {
            setPosts(allPosts);
        }
    }, [showFavorites]);

    const getFavoritePosts = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:4000/post/favorite", {
                headers: {
                    Authorization: `${token}`,
                },
            });
            if (response.data.posts.error) {
                setError(response.data.posts.error);
                return;
            }
            setPosts(response.data.posts);
            setFavoritePosts(response.data.posts);
        } catch (error) {
            console.error("Error deleting post: ", error);
            setError('Error fetching favorite posts');
        }
    };

    return (
        <div>
            <NavBar setIsAuthenticated={setIsAuthenticated} />
            <h2>Recent Posts</h2>
            {error && <p className="error">{error}</p>}
            <div>
                <input
                    type="text"
                    placeholder="Search posts"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <input
                    type="checkbox"
                    checked={showFavorites}
                    onChange={() => setShowFavorites(!showFavorites)}
                />
                <label>Show Favorites</label>
            </div>
            <NewPostForm setPosts={setPosts} />
            {posts.length > 0 ? (
                <ul>
                    {posts.map((post) => (
                        <li key={post._id}>
                            <Link to={`/post/${post._id}`}>
                                <h3>{post.title}</h3>
                            </Link>
                            <p>{post.body}</p>
                            <p>Author: {post.author.username}</p>
                            <p>Likes: {post.likes}</p>
                            <button onClick={() => handleLikePost(post._id)}>Like</button>
                            <button onClick={() => handleDeletePost(post._id, setPosts)}>
                                Delete
                            </button>
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
