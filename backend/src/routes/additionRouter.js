const express = require('express');
const router = express.Router();
const Addition = require('../models/Addition.js');
const path = require('path');
const fs = require('fs').promises;


router.get('/additions', async (req, res) => {
    try {
        // Fetch all additions from the database
        const allAdditions = await Addition.find();

        // Map the additions to include image URLs
        const additionsWithImages = await Promise.all(
            allAdditions.map(async (addition) => {
                const imageUrl = addition.image ? addition.image : null;

                // Read the image file asynchronously
                let imageData;
                try {
                    imageData = await fs.readFile(path.join(__dirname, '../../public', imageUrl), 'base64');
                } catch (readError) {
                    console.error('Error reading image file:', readError.message || readError);
                    imageData = null;
                }

                return {
                    _id: addition._id,
                    label: addition.label,
                    text: addition.text,
                    imageUrl,
                    imageData,
                };
            })
        );

        res.status(200).json({ additions: additionsWithImages });
    } catch (error) {
        console.error('Error getting all additions:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});






module.exports = router;
