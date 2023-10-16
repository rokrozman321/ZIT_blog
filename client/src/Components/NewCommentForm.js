import React, { useState } from 'react';
import axios from 'axios';

const NewCommentForm = ({ postId, setComments }) => {
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:4000/comment',
                { postId: postId, comment: comment },
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
            setComment('');
            setComments((comments) => [...comments, response.data.comment]);
        } catch (error) {
            console.error('Error creating comment: ', error);
        }
    };

    return (
        <form onSubmit={handleCommentSubmit}>
            {error && <p className="error">{error}</p>}
            <label>
                New Comment:
                <input type="text" value={comment} onChange={handleCommentChange} />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};

export default NewCommentForm;
