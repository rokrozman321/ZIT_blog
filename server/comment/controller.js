const User = require('../models/Users');
const Post = require('../models/Posts');
const Comment = require('../models/Comments');
const bcrypt = require('bcrypt');
const { createToken, verifyToken } = require('../util/token')

const getAllCommentsForPost = async (data) => {
    try {
        const post = await Post.findById(data.id).populate('comments');
        if (!post) {
            return { error: 'Post not found' };
        }
        const comments = post.comments;
        return comments;
    } catch (error) {
        console.log(error);
        return { error: 'Error getting all comments for post' };
    }
}

const createComment = async (data) => {
    try {
        const { postId, userId, comment } = data;

        const post = await Post.findById(postId);
        if (!post) {
            return { error: 'Post not found' };
        }

        const user = await User.findById(data.userId);
        if (!user) {
            console.log('no user');
            return { error: 'User not found' };
        }

        const newComment = await Comment.create({
            post: post._id,
            author: user._id,
            comment: comment,
        });

        post.comments.push(newComment._id);
        await post.save();

        // return newComment;
        const populatedComment = await newComment.populate('author')
        return populatedComment;
    } catch (error) {
        console.log(error);
        return { error: 'Error creating new comment' };
    }
}

const deleteComment = async (data) => {
    try {
        const comment = await Comment.findById(data.commentId);
        if (!comment) {
            console.log('Comment not found');
            return { error: 'Comment not found' };
        }

        const post = await Post.findById(data.postId);
        if (!post) {
            console.log('Post not found');
            return { error: 'Post not found' };
        }

        if (comment.author.toString() !== data.userId) {
            console.log('Not the author of the comment');
            return { error: 'You are not the author of the comment' };
        }

        await Comment.deleteOne({ _id: data.commentId });
        const updatedPost = await Post.findById(post._id).populate('comments');
        return updatedPost.comments;
    } catch (error) {
        console.log(error);
        return { error: 'Error deleting comment' };
    }
};

const likeComment = async (data) => {
    try {
        const comment = await Comment.findById(data.id);
        if (!comment) {
        return { error: 'Comment not found' };
        }

        const user = await User.findById(data.userId);
        if (!user) {
        return { error: 'User not found' };
        }

        const likedIndex = user.fav_comments.indexOf(comment._id);

        if (likedIndex === -1) {
            comment.likes += 1;
            user.fav_comments.push(comment._id);
        } else {
            comment.likes -= 1;
            user.fav_comments.splice(likedIndex, 1);
        }

        await comment.save();
        await user.save();

        return comment;
    } catch (error) {
        console.log(error);
        return { error: 'Error liking comment' };
    }
};


module.exports = { getAllCommentsForPost, createComment, deleteComment, likeComment }