const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const userRouter = require('./user/routes')
const postRouter = require('./post/routes')
const commentRouter = require('./comment/routes')

const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/comment', commentRouter);

const atlas_geslo = process.env.ATLAS_GESLO
const url = "mongodb+srv://Rok:"+ atlas_geslo +"@cluster0.vc1wigh.mongodb.net/Blog";

mongoose.connect(url, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }).then(()=>{
        console.log("Database connected");
    }).catch((err)=>{
        console.log(err);
    });

app.get('/status', (req, res) => {
    res.json({ message: 'Server is up and running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});