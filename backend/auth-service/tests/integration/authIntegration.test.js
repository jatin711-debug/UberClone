// backend/auth-service/tests/integration/authIntegration.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/index');
const User = require('../../src/models/User');
const SessionController = require('../../src/controllers/sessionController');

describe('Authentication Integration Tests', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('User Registration and Login Flow', () => {
        const validUserData = {
            username: 'integrationuser',
            email: 'integration@example.com',
            password: 'StrongPass123!',
            firstName: 'Integration',
            lastName: 'User'
        };

        it('should complete full registration and login process', async () => {
            // Registration
            const registrationResponse = await request(app)
                .post('/api/auth/register')
                .send(validUserData)
                .expect(201);

            expect(registrationResponse.body).toHaveProperty('userId');

            // Login
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: validUserData.email,
                    password: validUserData.password
                })
                .expect(200);

            expect(loginResponse.body).toHaveProperty('token');
            expect(loginResponse.body).toHaveProperty('userId');
            expect(loginResponse.body).toHaveProperty('role');

            // Validate Session
            const sessionValidationResponse = await request(app)
                .post('/api/session/validate')
                .send({ token: loginResponse.body.token })
                .expect(200);

            expect(sessionValidationResponse.body).toHaveProperty('valid', true);
            expect(sessionValidationResponse.body).toHaveProperty('userId');
        });

        it('should prevent duplicate registration', async () => {
            // First registration
            await request(app)
                .post('/api/auth/register')
                .send(validUserData)
                .expect(201);

            // Attempt duplicate registration
            await request(app)
                .post('/api/auth/register')
                .send(validUserData)
                .expect(409);
        });
    });

    describe('Session Management', () => {
        let user;
        let authToken;

        beforeEach(async () => {
            // Create a test user
            user = new User({
                username: 'sessionuser',
                email: 'session@example.com',
                password: 'StrongPass123!',
                firstName: 'Session',
                lastName: 'User'
            });
            await user.save();

            // Create a session
            authToken = await SessionController.createSession(
                user._id,
                'web',
                '127.0.0.1'
            );
        });

        it('should successfully validate an active session', async () => {
            const response = await request(app)
                .post('/api/session/validate')
                .send({ token: authToken })
                .expect(200);

            expect(response.body).toHaveProperty('valid', true);
            expect(response.body).toHaveProperty('userId', user._id.toString());
        });

        it('should logout and invalidate session', async () => {
            // Logout
            await request(app)
                .post('/api/session/logout')
                .send({ token: authToken })
                .expect(200);

            // Validate logout
            const validationResponse = await request(app)
                .post('/api/session/validate')
                .send({ token: authToken })
                .expect(401);

            expect(validationResponse.body).toHaveProperty('valid', false);
        });
    });
});