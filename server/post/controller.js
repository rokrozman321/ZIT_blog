const Post = require('../models/Posts')
const User = require('../models/Users')
const {createToken, verifyToken} = require('../util/token')

const getPosts = async(data) => {
    try {
        if (!data.id) {
            console.log('No user ID provided');
            return null;
        }

        console.log('id v get posts: ', data.id);
        const user = await User.findById(data.id);
        if (!user) return null;

        const posts = await Post.find();
        console.log('posts', posts)
        return posts;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const createPost = async(data) =>{
    try {
        const user = await User.findById(data.id);
        if (!user) return null;
        const author = user.id; 
        const title = data.title;
        const body = data.body;
        if (!title || !body) {
            return null
        }

        const newPost = await Post.create({
            title,
            body,
            author,
        });

        return newPost
    } catch (error) {
        console.log(error);
        return null;
    }
}

const editPost = async (data) =>{
    try {
        console.log('edit post data: ', data);
        const post = await Post.findById(data.id);
        if (!post) return null;
        if(post.author != data.authorId) return null;
        if (data.title) post.title = data.title;
        if (data.body) post.body = data.body;
        await post.save();
        return post;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {getPosts, createPost, editPost}
