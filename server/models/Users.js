const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    fav_posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    fav_comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;