const User = require('../models/Users');
const Post = require('../models/Posts');
const Comment = require('../models/Comments');
const bcrypt = require('bcrypt');
const {createToken, verifyToken} = require('../util/token')

const getAllCommentsForPost = async (data) => {
    try {
        const post = await Post.findById(data.id).populate('comments');
        if (!post) return null;
        const comments = post.comments;
        return comments;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const createComment = async (data) => {
    try {
        const { postId, userId, comment } = data;

        const post = await Post.findById(postId);
        if (!post) return null;
        console.log(post)

        const user = await User.findById(data.userId);
        if (!user) {console.log('no user'); return null;}
        console.log(user)

        console.log('data v create', data)
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
        return null;
    }
}

const deleteComment = async (data) => {
    try {
        const comment = await Comment.findById(data.commentId);
        if (!comment) {
            console.log('Comment not found');
            return null;
        }

        const post = await Post.findById(data.postId);
        if (!post) {
            console.log('Post not found');
            return null;
        }

        if (comment.author.toString() !== data.userId) {
            console.log('Not the author of the comment');
            return null;
        }

        await Comment.deleteOne({ _id: data.commentId });
        const updatedPost = await Post.findById(post._id).populate('comments');
        return updatedPost.comments;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const likeComment = async (data) => {
    try {
        const comment = await Comment.findById(data.id);
        if (!comment) return null;

        const user = await User.findById(data.userId);
        if (!user) return null;

        const likedIndex = user.fav_comments.indexOf(comment._id);

        if (likedIndex === -1) {
            // If the comment is not in the user's fav_comments, like the comment and add it to fav_comments
            comment.likes += 1;
            user.fav_comments.push(comment._id);
        } else {
            // If the comment is already liked, unlike the comment and remove it from fav_comments
            comment.likes -= 1;
            user.fav_comments.splice(likedIndex, 1);
        }

        await comment.save();
        await user.save();

        return comment;
    } catch (error) {
        console.log(error);
        return null;
    }
};


module.exports = {getAllCommentsForPost, createComment, deleteComment, likeComment}