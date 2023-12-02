const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const Pet = require('../models/Pet.js');
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

// Get user profile data route
router.get('/profile', async (req, res) => {
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

        // Check if the user has a pet
        let pet = await Pet.findOne({ owner: userId });

        res.status(200).json({
            fullName: pet ? pet.name : null,
                age: pet ? pet.age : null,
                breed: pet ? pet.breed : null,
                type: pet ? pet.pettype : null,
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        console.error('Error retrieving user profile:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Update user profile data route
router.post('/profile', async (req, res) => {
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

        // Check if the user already has a pet
        let pet = await Pet.findOne({ owner: userId });

        if (!pet) {
            // If the user doesn't have a pet, create a new pet
            pet = new Pet({
                name: req.body.fullName || user.fullName,
                age: req.body.age || null,
                breed: req.body.breed || null,
                type: req.body.pettype || null,
                owner: userId,
            });
        } else {
            // If the user already has a pet, update the pet data
            pet.name = req.body.fullName || pet.name;
            pet.age = req.body.age || pet.age;
            pet.breed = req.body.breed || pet.breed;
            pet.type = req.body.pettype || pet.type;
        }

        // Save/update the pet
        await pet.save();

        res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        console.error('Error updating user profile:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
