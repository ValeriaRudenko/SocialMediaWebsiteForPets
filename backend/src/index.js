require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Setup session management
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'defaultSessionSecret',
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false},
    })
);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern_stack', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create a middleware function for generating JWT tokens
function generateToken(user) {
    return jwt.sign(
        {userId: user._id, username: user.username, email: user.email},
        process.env.SECRET_KEY || 'defaultSecretKey',
        {expiresIn: '1d'}
    );
}

// Routes
app.post('/api/signup', async (req, res) => {
    const {username, email, password} = req.body;

    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: 'User with this email already exists'});
        }

        const newUser = new User({username, email, password});
        await newUser.save();

        const token = generateToken(newUser);

        req.session.user = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
        };

        res.status(201).json({message: 'User signed up successfully', token});
    } catch (error) {
        console.error('Error signing up:', error.message || error);
        res.status(500).json({message: 'Internal server error'});
    }
});

app.post('/api/signin', async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if (!user || user.password !== password) {
            return res.status(401).json({message: 'Incorrect email or password'});
        }

        const token = generateToken(user);

        res.status(200).json({message: 'User signed in successfully', token});
    } catch (error) {
        console.error('Error signing in:', error.message || error);
        res.status(500).json({message: 'Internal server error'});
    }
});

app.get('/api/check-auth', (req, res) => {
    if (req.session.user) {
        res.status(200).json({authenticated: true, user: req.session.user});
    } else {
        res.status(401).json({authenticated: false, user: null});
    }
});

// Add a route to get user profile data
app.get('/api/profile', async (req, res) => {
    try {
        // Retrieve user profile data based on the user's ID (you may need to modify this logic)
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
            avatar: user.avatar, // You may need to handle avatar separately (e.g., serve static files)
        });
    } catch (error) {
        console.error('Error retrieving user profile:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add a route to update user profile data
app.post('/api/profile', async (req, res) => {
    try {
        // Retrieve user based on the user's ID (you may need to modify this logic)
        const user = await User.findById(req.session.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user profile data
        user.fullName = req.body.fullName || user.fullName;
        user.age = req.body.age || user.age;
        user.breed = req.body.breed || user.breed;
        user.pettype = req.body.pettype || user.pettype;

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error.message || error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
module.exports = app;