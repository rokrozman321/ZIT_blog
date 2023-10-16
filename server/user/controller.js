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
            // return null;
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        const newUser = await User.create({
            username: data.username,
            password: hashedPassword
        });

        // create token
        const token = await createToken(newUser);
        // const token = 'fake token'

        return token
    } catch (error) {
        console.log(error);
        // return null;
        return { error: 'Internal server error' };
    }
}
const loginUser = async (data) => {
    try {
        if (!data.username || !data.password) {
            console.log('Did not got username or password');
            return null
        }

        const user = await User.findOne({
            username: data.username,
        });

        if (!user) {
            console.log('user does not exists');
            return null
        }

        const passwordMatch = await bcrypt.compare(data.password, user.password);

        if (!passwordMatch) {
            return null
        }

        // create token
        const token = await createToken(user);
        // const token = 'Fake token from login'
        // const id = await verifyToken(token);

        return token;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const updatePassword = async (data) => {
    try {
        if (!data.id) {
            console.log('No user ID provided');
            return null;
        }

        const user = await User.findById(data.id);

        if (!user) {
            console.log('User not found');
            return null;
        }

        if (!data.oldPassword) {
            console.log('Old password not provided');
            return null;
        }

        // Check if the old password is correct
        const isPasswordValid = await bcrypt.compare(data.oldPassword, user.password);

        if (!isPasswordValid) {
            console.log('Old password is incorrect');
            return null;
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
        return null;
    }
}

module.exports = { createNewUser, getUsers, loginUser, updatePassword };