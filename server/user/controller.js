const User = require('../models/Users');
const bcrypt = require('bcrypt');
const { createToken, verifyToken } = require('../util/token')

const getUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//TODO 
// check if username already exists 

const createNewUser = async (data) => {
    try {
        const existingUser = await User.findOne({ username: data.username });
        if (existingUser) {
            return { error: 'Username is already taken' };
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        const newUser = await User.create({
            username: data.username,
            password: hashedPassword
        });

        // create token
        const token = await createToken(newUser);

        return token
    } catch (error) {
        console.log(error);
        return { error: 'Internal server error' };
    }
}
const loginUser = async (data) => {
    try {
        if (!data.username || !data.password) {
            return { error: 'Missing username or password' };
        }

        const user = await User.findOne({
            username: data.username,
        });

        if (!user) {
            return { error: 'User not found' };
        }

        const passwordMatch = await bcrypt.compare(data.password, user.password);

        if (!passwordMatch) {
            return { error: 'Wrong password' };
        }

        // create token
        const token = await createToken(user);

        return token;

    } catch (error) {
        console.log(error);
        return { error: 'Error logging in user' };
    }
}

const updatePassword = async (data) => {
    try {
        if (!data.id) {
            console.log('No user ID provided');
            return { error: 'No user provided' };
        }

        const user = await User.findById(data.id);

        if (!user) {
            console.log('User not found');
            return { error: 'User not found' };
        }

        if (!data.oldPassword) {
            console.log('Old password not provided');
            return { error: 'Old password not provided' };
        }

        // Check if the old password is correct
        const isPasswordValid = await bcrypt.compare(data.oldPassword, user.password);

        if (!isPasswordValid) {
            console.log('Old password is incorrect');
            return { error: 'Old password is incorrect' };
        }

        if (data.newPassword) {
            // Update the password if a new password is provided
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(data.newPassword, saltRounds);
            user.password = hashedPassword;
        }

        await user.save();

        return user;
    } catch (error) {
        console.log(error);
        return { error };
    }
}

module.exports = { createNewUser, getUsers, loginUser, updatePassword };