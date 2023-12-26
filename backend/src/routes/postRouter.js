// postRouter.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const User = require('../models/User.js');
const Post = require('../models/Post.js');

const postImageStorage = multer.diskStorage({
    destination: './public/images/posts',
    filename: (req, file, cb) => {
        const originalExtension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = 'post-' + uniqueSuffix + originalExtension;
        cb(null, fileName);
    },
});

const postImageUpload = multer({
    storage: multer.diskStorage({
        destination: './public/images/posts/',
        filename: (req, file, cb) => {
            const originalExtension = require('path').extname(file.originalname);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileName = file.fieldname + '-' + uniqueSuffix + originalExtension;
            cb(null, fileName);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    },
});

const handleFileTooLarge = (err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size is too large. Maximum allowed size is 5 MB.' });
    }
    next(err);
};

router.post('/posts', postImageUpload.single('image'), handleFileTooLarge, async (req, res) => {
    try {
        // Check if the image upload was successful
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // Extract the token from the Authorization header
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY || 'defaultSecretKey');

        // Use the decoded token to get user ID
        const userId = decodedToken.userId;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract post data from the request body
        const { image, label, text } = req.body;


        // Create a new post
        const newPost = new Post({
            image,
            label,
            text,
            author: userId,
            image: '/images/posts/' + req.file.filename,
        });

        // Save the new post to the database
        await newPost.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        console.error('Error creating post:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/posts/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Fetch all posts by the specified user ID from the database
        const userPosts = await Post.find({ author: userId });

        // Map the posts to include image URLs and image data
        const postsWithImages = await Promise.all(
            userPosts.map(async (post) => {
                const imageUrl = post.image ? post.image : null;

                // Read the image file asynchronously
                let imageData;
                try {
                    imageData = await fs.readFile(path.join(__dirname, '../../public', imageUrl), 'base64');
                } catch (readError) {
                    console.error('Error reading image file:', readError.message || readError);
                    imageData = null;
                }

                return {
                    _id: post._id,
                    label: post.label,
                    text: post.text,
                    author: post.author,
                    imageUrl,
                    imageData,
                };
            })
        );

        res.status(200).json({ posts: postsWithImages });
    } catch (error) {
        console.error('Error getting posts by user ID:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.get('/posts', async (req, res) => {
    try {
        // Fetch all posts from the database
        const allPosts = await Post.find().populate('author', 'username');

        // Map the posts to include image URLs
        const postsWithImages = await Promise.all(
            allPosts.map(async (post) => {
                const imageUrl = post.image ? post.image : null;

                // Read the image file asynchronously
                let imageData;
                try {
                    imageData = await fs.readFile(path.join(__dirname, '../../public', imageUrl), 'base64');
                } catch (readError) {
                    console.error('Error reading image file:', readError.message || readError);
                    imageData = null;
                }

                return {
                    _id: post._id,
                    label: post.label,
                    text: post.text,
                    author: post.author,
                    imageUrl,
                    imageData,
                };
            })
        );

        res.status(200).json({ posts: postsWithImages });
    } catch (error) {
        console.error('Error getting all posts:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
