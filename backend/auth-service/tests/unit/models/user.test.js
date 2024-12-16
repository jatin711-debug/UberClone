const User = require("../../src/models/User");
const mongoose = require("mongoose");

describe("User Model", () => {
    beforeAll(async () => {
        await mongoose.connect("mongodb://localhost:27017/testdb", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it("should hash password before saving", async () => {
        const user = await User.create({ email: "test@example.com", password: "123456" });
        expect(user.password).not.toBe("123456");
    });

    it("should validate password correctly", async () => {
        const user = await User.create({ email: "user@example.com", password: "mypassword" });
        const isMatch = await user.matchPassword("mypassword");
        expect(isMatch).toBe(true);
    });
});
