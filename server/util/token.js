const jwt = require('jsonwebtoken');

const createToken = async (user) => {
    try {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        return null;
    }
}

const verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId; 
        return userId;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
}

module.exports = {createToken, verifyToken};