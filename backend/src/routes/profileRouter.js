const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const Pet = require('../models/Pet.js');

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
            type: pet ? pet.type : null,
            id: userId,
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        console.error('Error retrieving user profile:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get user profile data route
router.post('/profilebyid', async (req, res) => {
    const {id} = req.body;
    console.log(id);
    try {
        // Retrieve user from the database based on the user ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has a pet
        let pet = await Pet.findOne({ owner: id });

        res.status(200).json({
            fullName: pet ? pet.name : null,
            age: pet ? pet.age : null,
            breed: pet ? pet.breed : null,
            type: pet ? pet.type : null,
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
                type: req.body.type || null,
                owner: userId,
            });
        } else {
            // If the user already has a pet, update the pet data
            pet.name = req.body.fullName || pet.name;
            pet.age = req.body.age || pet.age;
            pet.breed = req.body.breed || pet.breed;
            pet.type = req.body.type || pet.type;
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
