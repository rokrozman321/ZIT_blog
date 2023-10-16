const express = require('express');

const app = express();

const { getUsers, createNewUser, loginUser, updatePassword } = require('./controller')
const { verifyToken } = require('../util/token')

app.get('/status', (req, res) => {
    res.json({ message: 'Server is up and running inside user' });
});

app.get('/', async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json({ users: users });

    } catch (error) {

        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/', async (req, res) => {
    try {
        const data = req.body;

        const token = await createNewUser(data)

        if (token) res.status(201).json({ token });
        else res.status(500).json({ error: 'Internal server error' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

app.post('/login', async (req, res) => {
    try {
        const data = req.body;
        console.log(data)

        const token = await loginUser(data);

        if (token) res.status(201).json({ token: token });
        else res.status(500).json({ error: 'Internal server error' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' })
    }
});

app.put('/password', async (req, res) => {
    try {
        const data = req.body;

        const token = req.header('Authorization');

        const userId = await verifyToken(token);

        data.id = userId;

        const updatedUser = await updatePassword(data);

        res.status(200).json({ updatedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = app;