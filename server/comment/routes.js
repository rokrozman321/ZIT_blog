const express = require('express');
const app = express();

const { verifyToken } = require('../util/token');
const { getAllCommentsForPost, createComment, deleteComment, likeComment } = require('./controller');

app.get('/status', (req, res) => {
    res.json({ message: 'Server is up and running inside comment' });
});

app.get('/', async (req, res) => {
    try {
        const data = req.body;
        const comments = await getAllCommentsForPost(data);
        res.status(200).json({ comments: comments });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.post('/', async (req, res) => {
    try {
        const data = req.body
        const token = req.header('Authorization');
        data.userId = await verifyToken(token)
        const comment = await createComment(data);
        res.status(200).json({ comment: comment });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.delete('/', async (req, res) => {
    try {
        const data = req.body;
        const token = req.header('Authorization');
        const userId = await verifyToken(token);
        data.userId = userId;

        const comments = await deleteComment(data);

        if (comments) res.status(201).json({ comments: comments });
        else res.status(500).json({ error: 'Internal server error' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

app.put('/like', async (req, res) => {
    try {
        const data = req.body;
        const token = req.header('Authorization');
        const userId = await verifyToken(token);
        data.userId = userId;

        const comment = await likeComment(data);

        if (comment) res.status(201).json({ comment: comment });
        else res.status(500).json({ error: 'Internal server error' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

module.exports = app;