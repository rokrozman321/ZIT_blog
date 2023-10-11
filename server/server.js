const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/status', (req, res) => {
    res.json({ message: 'Server is up and running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});