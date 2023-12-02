const supertest = require('supertest');
const chai = require('chai');
const app = require('../index.js'); // Replace with the actual path to your app file

const expect = chai.expect;
const api = supertest(app);

describe('Authentication API Tests', () => {
    let testUser;

    before(async () => {
        // Perform any setup tasks, like creating a test user
        testUser = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'testpassword',
        };
        // Perform any other setup tasks, like registering the test user
        const response = await api.post('/api/signup').send(testUser);
        expect(response.status).to.equal(201);
    });

    after(async () => {
        // Perform any cleanup tasks, like deleting the test user
        // Ensure you have a route or function to delete the user by ID or email
        // const response = await api.delete(`/api/users/${testUser._id}`);
        // expect(response.status).to.equal(204);
    });

    it('should sign up a new user', async () => {
        const newUser = {
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'newpassword',
        };
        const response = await api.post('/api/signup').send(newUser);
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('token');
    });

    it('should not sign up a user with an existing email', async () => {
        const response = await api.post('/api/signup').send(testUser);
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('message').to.equal('User with this email already exists');
    });

    it('should sign in an existing user', async () => {
        const response = await api.post('/api/signin').send({
            email: testUser.email,
            password: testUser.password,
        });
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('token');
    });

    it('should not sign in a user with incorrect credentials', async () => {
        const response = await api.post('/api/signin').send({
            email: testUser.email,
            password: 'incorrectpassword',
        });
        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('message').to.equal('Incorrect email or password');
    });

    it('should check authentication status for a logged-in user', async () => {
        const response = await api.get('/api/check-auth').set('Authorization', 'Bearer your_valid_token_here');
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('authenticated').to.equal(true);
        expect(response.body).to.have.property('user').to.be.an('object');
    });

    it('should check authentication status for a non-logged-in user', async () => {
        const response = await api.get('/api/check-auth');
        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('authenticated').to.equal(false);
        expect(response.body).to.have.property('user').to.equal(null);
    });
});