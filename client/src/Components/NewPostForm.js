import React, { useState } from 'react';
import axios from 'axios';

const NewPostForm = ({ setPosts }) => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(
                'http://localhost:4000/post',
                { title, body },
                {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setPosts(prevPosts => [...prevPosts, response.data.post]);

            setTitle('');
            setBody('');
        } catch (error) {
            console.error('Error creating post: ', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label>Body</label>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
            </div>
            <button type="submit">Create Post</button>
        </form>
    );
};

export default NewPostForm;
