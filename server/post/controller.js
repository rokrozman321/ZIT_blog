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

        user.posts.push(newPost);
        await user.save();

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

const deletePost = async (data) => {
    try {
        console.log('data in delete post')    
        const post = await Post.findById(data.id);
        if (!post) {
            console.log('Post not found');
            return null;
        }

        if (post.author.toString() !== data.authorId) {
            console.log('Not the author of the post');
            return null;
        }

        // await post.remove();
        await Post.deleteOne({ _id: data.id });
        const posts = await Post.find();
        return posts;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const likePost = async (data) => {
    try {
        const post = await Post.findById(data.id);
        if (!post) return null;
        
        const user = await User.findById(data.authorId);
        if (!user) return null;
        
        const likedIndex = user.fav_posts.indexOf(post._id);

        if (likedIndex === -1) {
            // If the post is not in the user's fav_posts, like the post and add it to fav_posts
            post.likes += 1;
            user.fav_posts.push(post._id);
        } else {
            // If the post is already liked, unlike the post and remove it from fav_posts
            post.likes -= 1;
            user.fav_posts.splice(likedIndex, 1);
        }

        await post.save();
        await user.save();

        return post;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {getPosts, createPost, editPost, deletePost, likePost}
