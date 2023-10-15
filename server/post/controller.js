const Post = require('../models/Posts')
const User = require('../models/Users')
const { createToken, verifyToken } = require('../util/token')

const getPosts = async (data) => {
    try {
        if (!data.id) {
            console.log('No user ID provided');
            return null;
        }

        const user = await User.findById(data.id)
        if (!user) return null;

        const posts = await Post.find().populate('author');
        return posts;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getPost = async (data) => {
    try {
        if (!data.userId) {
            console.log('No user ID provided');
            return null;
        }
        if (!data.postId) {
            console.log('No post ID provided');
            return null;
        }

        const user = await User.findById(data.userId);
        if (!user) return null;

        const post = await Post.findById(data.postId).populate({
            path: 'comments',
            populate: {
                path: 'author',
                model: 'User',
                select: 'username',
            },
        })
            .populate('author', 'username');;
        return post;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const createPost = async (data) => {
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

        // return newPost
        const populatedNewPost = await newPost.populate('author');
        return populatedNewPost;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const editPost = async (data) => {
    try {
        const post = await Post.findById(data.id);
        if (!post) return null;
        if (post.author != data.authorId) return null;
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
        const post = await Post.findById(data.id);
        if (!post) {
            console.log('Post not found');
            return null;
        }

        if (post.author.toString() !== data.authorId) {
            console.log('Not the author of the post');
            return null;
        }

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
            post.likes += 1;
            user.fav_posts.push(post._id);
        } else {
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

const getFavoritePosts = async (data) => {
    try {
        if (!data.userId) {
            console.log('No user ID provided');
            return null;
        }

        const user = await User.findById(data.userId).populate({
            path: 'fav_posts',
            populate: { path: 'author', select: 'username' }
        });
        if (!user) {
            console.log('User not found');
            return null;
        }
        const favoritePosts = user.fav_posts;
        return favoritePosts;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = { getPosts, createPost, editPost, deletePost, likePost, getPost, getFavoritePosts }
