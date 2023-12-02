const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

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

// Get user profile data route
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            id: user._id,
            fullName: user.fullName,
            age: user.age,
            breed: user.breed,
            pettype: user.pettype,
            avatar: user.avatar,
        });
    } catch (error) {
        console.error('Error retrieving user profile:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update user profile data route
router.post('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.fullName = req.body.fullName || user.fullName;
        user.age = req.body.age || user.age;
        user.breed = req.body.breed || user.breed;
        user.pettype = req.body.pettype || user.pettype;

        await user.save();

        res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
