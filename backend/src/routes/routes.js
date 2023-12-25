const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const Pet = require('../models/Pet.js');
const Addition = require('../models/Addition.js');
const Comment = require('../models/Comment.js');
const Post = require('../models/Post.js');

const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

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

// File upload configuration
const storage = multer.diskStorage({
    destination: './public/images/',
    filename: (req, file, cb) => {
        const originalExtension = require('path').extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = file.fieldname + '-' + uniqueSuffix + originalExtension;
        cb(null, fileName);
    },
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 2 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    },
});
router.post('/upload', upload.single('image'), async (req, res) => {
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

// Get all users route
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '_id username');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error getting users:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// File upload configuration for post images
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



router.post('/additions', async (req, res) => {
    try {
        // Extract addition data from the request body
        const { image, label, text } = req.body;

        // Create a new addition
        const newAddition = new Addition({
            image,
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


router.get('/additions', async (req, res) => {
    try {
        // Fetch all additions from the database
        const allAdditions = await Addition.find();

        res.status(200).json({ additions: allAdditions });
    } catch (error) {
        console.error('Error getting all additions:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/posts', async (req, res) => {
    try {
        // Fetch all posts from the database
        const allPosts = await Post.find();

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


// Post a comment route
router.post('/comments', async (req, res) => {
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

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract comment data from the request body
        const { text, postId } = req.body;

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create a new comment
        const newComment = new Comment({
            text,
            autor: userId,
            post: postId,
        });

        // Save the new comment to the database
        await newComment.save();

        res.status(201).json({ message: 'Comment posted successfully', comment: newComment });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        console.error('Error posting comment:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get comments by post ID route
router.get('/comments/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;

        // Fetch all comments for the specified post ID from the database
        const postComments = await Comment.find({ post: postId });

        res.status(200).json({ comments: postComments });
    } catch (error) {
        console.error('Error getting comments by post ID:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
