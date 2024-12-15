// backend/auth-service/tests/unit/userController.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const UserController = require('../../src/controllers/userController');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');

describe('UserController', () => {
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

    describe('register method', () => {
        const validUserData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'StrongPass123!',
            firstName: 'Test',
            lastName: 'User',
            role: 'passenger'
        };

        it('should successfully register a new user', async () => {
            const mockReq = {
                body: validUserData
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await UserController.register(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'User registered successfully',
                    userId: expect.any(String)
                })
            );

            const user = await User.findOne({ email: validUserData.email });
            expect(user).toBeTruthy();
        });

        it('should reject registration with existing email', async () => {
            // First, create a user
            await new User(validUserData).save();

            const mockReq = {
                body: validUserData
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await UserController.register(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(409);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'User with this email or username already exists'
                })
            );
        });
    });

    describe('login method', () => {
        const userData = {
            username: 'loginuser',
            email: 'login@example.com',
            password: 'StrongPass123!',
            firstName: 'Login',
            lastName: 'User'
        };

        beforeEach(async () => {
            await new User(userData).save();
        });

        it('should successfully login with correct credentials', async () => {
            const mockReq = {
                body: {
                    email: userData.email,
                    password: userData.password
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await UserController.login(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    token: expect.any(String),
                    userId: expect.any(String),
                    role: expect.any(String)
                })
            );
        });

        it('should reject login with incorrect password', async () => {
            const mockReq = {
                body: {
                    email: userData.email,
                    password: 'WrongPassword123!'
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await UserController.login(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Invalid credentials'
                })
            );
        });
    });

    describe('Token Generation', () => {
        const user = new User({
            username: 'tokenuser',
            email: 'token@example.com',
            firstName: 'Token',
            lastName: 'User',
            role: 'passenger'
        });

        it('should generate a valid JWT token', () => {
            const token = UserController.generateAuthToken(user);

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

            expect(decoded).toHaveProperty('username', user.username);
            expect(decoded).toHaveProperty('email', user.email);
            expect(decoded).toHaveProperty('role', user.role);
        });
    });
});