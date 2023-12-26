// Import required modules
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const fs = require('fs');
const axios = require('axios');


// Database connection
mongoose.connect('mongodb://localhost:27017/mern_stack', { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Connected to MongoDB');
        createIndexes();
        generateData();
    })
    .catch(err => console.error('Failed to connect to MongoDB:', err));
// Database schema and model (assuming they are already defined)
const additionSchema = new mongoose.Schema({
    image: { type: String},
    label: { type: String, required: true },
    text: { type: String, required: true },
});

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
});

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
    },
    breed: String,
    type: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const postSchema = new mongoose.Schema({
    image: { type: String},
    label: { type: String, required: true },
    text: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const subscriptionSchema = new mongoose.Schema({
    subscribed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String},
});

const User = mongoose.model('User', userSchema);
const Addition = mongoose.model('Addition', additionSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Pet = mongoose.model('Pet', petSchema);
const Post = mongoose.model('Post', postSchema);
const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Create indexes
async function createIndexes() {
    try {
        await Addition.createIndexes();
        await Comment.createIndexes();
        await Pet.createIndexes();
        await Post.createIndexes();
        await Subscription.createIndexes();
        await User.createIndexes();
        console.log('Indexes created successfully');
    } catch (err) {
        console.error('Failed to create indexes:', err);
    }
}

async function downloadImage(url, uniqueSuffix) {
    const response = await axios.get(url, { responseType: 'stream' });
    response.data.pipe(fs.createWriteStream('./backend/public/images/' + uniqueSuffix));
    console.log('Image downloaded!');
}


// Generate data
async function generateData() {
    try {
        // Generate 10 users
        const users = [];
        for (let i = 0; i < 10; i++) {
            const password = faker.internet.password();
            const hashedPassword = await bcrypt.hash(password, 10);
            const email = faker.internet.email();

            image = faker.image.url();
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+'.jpg';
            downloadImage(image,uniqueSuffix);

            const user = new User({
                username: faker.internet.userName(),
                email: email,
                password: hashedPassword,
                avatar: uniqueSuffix,
            });
            console.log(`User created: ${email} ${password}`);
            users.push(await user.save());
        }

        // Generate additions
        for (let i = 0; i < 15; i++) {
            image = faker.image.url();
            const uniqueSuffix = 'posts/'+Date.now() + '-' + Math.round(Math.random() * 1E9)+'.jpg';
            downloadImage(image,uniqueSuffix);

            const addition = new Addition({
                image: '/images/'+uniqueSuffix,
                label: faker.lorem.word(),
                text: faker.lorem.paragraph(),
            });
            await addition.save();
        }

        // Generate pets
        for (let i = 0; i < 5; i++) {
            const pet = new Pet({
                name: faker.animal.dog(),
                age: faker.datatype.number({ min: 1, max: 15 }),
                breed: faker.animal.dog(),
                type: faker.lorem.word(),
                owner: getRandomUser(users),
            });
            await pet.save();
        }



        // Generate posts
        for (let user of users) {
            for (let i = 0; i < 5; i++) {
                image = faker.image.url();
                const uniqueSuffix = 'posts/'+Date.now() + '-' + Math.round(Math.random() * 1E9)+'.jpg';
                downloadImage(image,uniqueSuffix);

                const post = new Post({
                    image: '/images/'+uniqueSuffix,
                    label: faker.lorem.word(),
                    text: faker.lorem.paragraph(),
                    author: user._id,
                });
                await post.save();
            }
        }

        // Generate subscriptions
        for (let i = 0; i < 15; i++) {
            const subscriber = getRandomUser(users);
            const subscribed = getRandomUser(users, subscriber);
            const subscription = new Subscription({
                subscriber: subscriber._id,
                subscribed: subscribed._id,
            });
            await subscription.save();
        }

        console.log('Data generated successfully');
    } catch (err) {
        console.error('Failed to generate data:', err);
    }
}


// Helper function to get a random user
function getRandomUser(users, excludeUser = null) {
    const filteredUsers = users.filter(user => user !== excludeUser);
    const randomIndex = Math.floor(Math.random() * filteredUsers.length);
    return filteredUsers[randomIndex];
}