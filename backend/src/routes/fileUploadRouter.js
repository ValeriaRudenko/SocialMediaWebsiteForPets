const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const User = require('../models/User.js');
const Addition = require("../models/Addition");
const { handleFileTooLarge, imageUpload, additionImageUpload } = require('../middleware/middleware.js');



router.post('/upload', imageUpload.single('image'), async (req, res) => {
    try {
        // Check if 'image' is null
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }
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

        // Save the avatar path to the user document
        user.avatar = req.file.filename;
        await user.save();

        res.json({ message: 'Image uploaded successfully', avatarPath: user.avatar });
    } catch (error) {
        console.error('Error uploading image:', error.message || error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/avatar', async (req, res) => {
    try {
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
        if (!user || !user.avatar) {
            return res.status(404).json({ message: 'User or avatar not found' });
        }

        // Construct the path to the avatar image
        const avatarPath = path.join(__dirname, '../../public/images/', user.avatar);

        // Send the image file
        res.sendFile(avatarPath);
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        console.error('Error retrieving user avatar:', error.message || error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/additions', additionImageUpload.single('image'), handleFileTooLarge, async (req, res) => {
    try {
        // Check if the image upload was successful
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // Extract addition data from the request body
        const { image, label, text } = req.body;

        // Create a new addition
        const newAddition = new Addition({
            image: '/images/additions/' + req.file.filename,
            label,
            text,
        });

        // Save the new addition to the database
        await newAddition.save();

        res.status(201).json({ message: 'Addition created successfully', addition: newAddition });
    } catch (error) {
        console.error('Error creating addition:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
