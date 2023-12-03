// app.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const routes = require('./routes/routes.js'); // Import the routes module
//const User = require('./models/User.js');

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
        cookie: { secure: false },
    })
);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mern_stack', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Use the routes defined in the routes module
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
