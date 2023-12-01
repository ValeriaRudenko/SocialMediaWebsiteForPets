const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

const secretKey='efbhfeefsgergergre4645ge4vw4tfs4gesgr'
// Middleware
app.use(cors());
app.use(bodyParser.json());

// Setup session management
app.use(
    session({
        secret: 'hugvrshdgsinodvsijo7683278rfehwiufg7t4wg87',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // For development purposes, set secure to false. In production, set it to true if using HTTPS
    })
);

// Connect to MongoDB (replace 'your-mongodb-uri' with your actual MongoDB URI)
mongoose.connect('mongodb://localhost:27017/mern_stack', { useNewUrlParser: true, useUnifiedTopology: true });

// Routes
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();
        //Create JWT token
        const token = jwt.sign(
            { userId: newUser._id, username: newUser.username, email: newUser.email },
            secretKey, // replace with a secure secret key
            { expiresIn: '1d' } // set expiration time
        );
        // Store user information in the session
        req.session.user = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
        };

        res.status(201).json({ message: 'User signed up successfully', token });
    } catch (error) {
        console.error('Error signing up:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username, email: user.email },
            secretKey,
            { expiresIn: '1d' }
        );

        // Send token to the client along with user information
        res.status(200).json({ message: 'User signed in successfully',  token });
    } catch (error) {
        console.error('Error signing in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Check if the user is authenticated
app.get('/api/check-auth', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ authenticated: true, user: req.session.user });
    } else {
        res.status(401).json({ authenticated: false, user: null });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
