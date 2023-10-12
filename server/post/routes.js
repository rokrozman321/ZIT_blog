const express = require('express');
const app = express();

const {getPosts, createPost, editPost} = require('../post/controller')
const {verifyToken} = require('../util/token')

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
        res.status(500).json({ error: 'Internal server error'});
    }
});

app.post('/', async (req, res) => {
    try {
        const data = req.body;
        const token = req.header('Authorization');
        const userId = await verifyToken(token);
        data.id = userId;
        console.log(data)
        const post = await createPost(data)

        if(post) res.status(201).json({ post: post });
        else res.status(500).json({ error : 'Internal server error'})
    
    } catch (error) {
        console.log(error)
        res.status(500).json({ error : 'Internal server error'})
    }
});

app.put('/', async (req,res)=>{
    try {
        const data = req.body;
        const token = req.header('Authorization');
        const userId = await verifyToken(token);
        data.authorId = userId;

        const post = await editPost(data);
        
        if(post) res.status(201).json({ post: post });
        else res.status(500).json({ error : 'Internal server error'})

    } catch (error) {
        console.log(error)
        res.status(500).json({ error : 'Internal server error'})
    }
})

module.exports = app;