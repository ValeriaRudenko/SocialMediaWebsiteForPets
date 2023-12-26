const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const Pet = require('../models/Pet.js');
const Addition = require('../models/Addition.js');
const Comment = require('../models/Comment.js');
const Post = require('../models/Post.js');
const Subscription = require('../models/Subscription.js');

const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

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
        const postComments = await Comment.find({ post: postId }).populate('autor', 'username');

        res.status(200).json({ comments: postComments });
    } catch (error) {
        console.error('Error getting comments by post ID:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/subscribe', async (req, res) => {
    try {
        const { subscribedUserId } = req.body;
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY || 'defaultSecretKey');

        // Use the decoded token to get user ID
        const subscriberUserId = decodedToken.userId;
        // Check if the subscriber and subscribed users exist
        const [subscriber, subscribed] = await Promise.all([
            User.findById(subscriberUserId),
            User.findById(subscribedUserId),
        ]);

        if (!subscriber || !subscribed) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the subscription already exists
        const existingSubscription = await Subscription.findOne({
            subscriber: subscriberUserId,
            subscribed: subscribedUserId,
        });

        if (existingSubscription) {
            return res.status(400).json({ message: 'Subscription already exists' });
        }

        // Create a new subscription
        const newSubscription = new Subscription({
            subscriber: subscriberUserId,
            subscribed: subscribedUserId,
        });

        // Save the new subscription to the database
        await newSubscription.save();

        res.status(201).json({ message: 'Subscription created successfully' });
    } catch (error) {
        console.error('Error creating subscription:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Add this to your existing router file

router.post('/checksubscription', async (req, res) => {
    try {
        const { subscribedUserId } = req.body;
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY || 'defaultSecretKey');

        // Use the decoded token to get user ID
        const subscriberUserId = decodedToken.userId;
        // Check if the subscriber and subscribed users exist
        const [subscriber, subscribed] = await Promise.all([
            User.findById(subscriberUserId),
            User.findById(subscribedUserId),
        ]);

        if (!subscriber || !subscribed) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the subscription exists
        const existingSubscription = await Subscription.findOne({
            subscriber: subscriberUserId,
            subscribed: subscribedUserId,
        });

        res.status(200).json({ isSubscribed: !!existingSubscription });
    } catch (error) {
        console.error('Error checking subscription:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/unsubscribe', async (req, res) => {
    try {
        const { subscribedUserId } = req.body;
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY || 'defaultSecretKey');

        // Use the decoded token to get user ID
        const subscriberUserId = decodedToken.userId;
        // Check if the subscriber and subscribed users exist
        const [subscriber, subscribed] = await Promise.all([
            User.findById(subscriberUserId),
            User.findById(subscribedUserId),
        ]);

        if (!subscriber || !subscribed) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the subscription exists
        const existingSubscription = await Subscription.findOneAndDelete({
            subscriber: subscriberUserId,
            subscribed: subscribedUserId,
        });

        if (!existingSubscription) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.status(200).json({ message: 'Unsubscribed successfully' });
    } catch (error) {
        console.error('Error unsubscribing:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/subscriptionposts', async (req, res) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY || 'defaultSecretKey');

        const userId = decodedToken.userId;

        // Fetch all subscriptions for the current user
        const subscriptions = await Subscription.find({ subscriber: userId });

        // Extract the user IDs of subscribed users
        const subscribedUserIds = subscriptions.map(subscription => subscription.subscribed);

        // Fetch all posts from subscribed users
        const postsFromSubscribedUsers = await Post.find({ author: { $in: subscribedUserIds } });

        // Map the posts to include image URLs and image data
        const postsWithImages = await Promise.all(
            postsFromSubscribedUsers.map(async (post) => {
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
        console.error('Error getting posts from subscribed users:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;