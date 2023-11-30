const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/mern_stack', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

// Define your routes here

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
