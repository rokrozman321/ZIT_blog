const express = require('express');
const app = express();

const { getPosts, createPost, editPost, deletePost, likePost, getPost, getFavoritePosts } = require('../post/controller')
const { verifyToken } = require('../util/token')

app.get('/status', (req, res) => {
    res.json({ message: 'Server is up and running inside post' });
});

app.get('/', async (req, res) => {
    try {
        const token = req.header('Authorization');
        const data = {};
        const userId = await verifyToken(token);
        data.id = userId;
        const posts = await getPosts(data);
        res.status(200).json({ posts: posts });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/favorite', async (req, res) => {
    try {
        const token = req.header('Authorization');
        const data = {};
        const userId = await verifyToken(token);
        data.userId = userId;
        const posts = await getFavoritePosts(data);
        res.status(200).json({ posts: posts });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/:postId', async (req, res) => {
    try {
        const token = req.header('Authorization');
        const data = {};
        const userId = await verifyToken(token);
        data.userId = userId;
        data.postId = req.params.postId;
        const post = await getPost(data);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json({ post });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/', async (req, res) => {
    try {
        const data = req.body;
        const token = req.header('Authorization');
        const userId = await verifyToken(token);
        data.id = userId;
        const post = await createPost(data)

        if (post) res.status(201).json({ post: post });
        else res.status(500).json({ error: 'Internal server error' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

app.put('/', async (req, res) => {
    try {
        const data = req.body;
        const token = req.header('Authorization');
        const userId = await verifyToken(token);
        data.authorId = userId;

        const post = await editPost(data);

        if (post) res.status(201).json({ post: post });
        else res.status(500).json({ error: 'Internal server error' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

app.delete('/', async (req, res) => {
    try {
        const data = req.body;
        const token = req.header('Authorization');
        const userId = await verifyToken(token);
        data.authorId = userId;

        const posts = await deletePost(data);

        if (posts) res.status(201).json({ posts: posts });
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
        data.authorId = userId;

        const post = await likePost(data);

        if (post) res.status(201).json({ post: post });
        else res.status(500).json({ error: 'Internal server error' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
})



module.exports = app;