const request = require("supertest");
const app = require("../../src/server");
const User = require("../../src/models/User");

describe("Auth Routes", () => {
    beforeEach(async () => {
        await User.deleteMany({});
    });

    it("should create a user and return a token", async () => {
        const res = await request(app).post("/api/auth/signup").send({
            email: "test@example.com",
            password: "123456",
        });

        expect(res.status).toBe(201);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe("test@example.com");
    });

    it("should not allow duplicate email", async () => {
        await request(app).post("/api/auth/signup").send({
            email: "test@example.com",
            password: "123456",
        });

        const res = await request(app).post("/api/auth/signup").send({
            email: "test@example.com",
            password: "123456",
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("User already exists");
    });
});
