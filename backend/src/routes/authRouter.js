
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

// Create a middleware function for generating JWT tokens
function generateToken(user) {
    return jwt.sign(
        { userId: user._id, username: user.username, email: user.email },
        process.env.SECRET_KEY || 'defaultSecretKey',
        { expiresIn: '1d' }
    );
}

// Signup route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        const token = generateToken(newUser);

        req.session.user = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
        };

        res.status(201).json({ message: 'User signed up successfully', token });
    } catch (error) {
        console.error('Error signing up:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Signin route
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }

        // Set the user session before sending the response
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email,
        };

        const token = generateToken(user);
        res.status(200).json({ message: 'User signed in successfully', token });
    } catch (error) {
        console.error('Error signing in:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Check authentication route
router.get('/check-auth', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ authenticated: true, user: req.session.user });
    } else {
        res.status(401).json({ authenticated: false, user: null });
    }
});
// Validate token route
router.get('/validate-token', async (req, res) => {
    try {
        // Extract the token from the Authorization header
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY || 'defaultSecretKey');

        // Use the decoded token to get user ID
        const userId = decodedToken.userId;

        // Retrieve user from the database based on the user ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If the token is valid, return a success response
        res.status(200).json({ message: 'Token is valid', user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        console.error('Error validating token:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
