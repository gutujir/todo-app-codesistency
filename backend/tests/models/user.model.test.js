import mongoose from "mongoose";
import { User } from "../../src/models/user.model.js";

describe("User Model", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/test-user-model", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  it("should create and save a user successfully", async () => {
    const userData = {
      email: "test@example.com",
      password: "hashedpassword",
      name: "Test User",
    };
    const user = new User(userData);
    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password);
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.isVerified).toBe(false);
    expect(savedUser.lastLogin).toBeInstanceOf(Date);
  });

  it("should require email, password, and name", async () => {
    const user = new User({});
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
    expect(err.errors.name).toBeDefined();
  });

  it("should not allow duplicate emails", async () => {
    const userData = {
      email: "unique@example.com",
      password: "pass",
      name: "User1",
    };
    await new User(userData).save();
    let err;
    try {
      await new User(userData).save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Mongo duplicate key error
  });

  it("should set default values for isVerified and lastLogin", async () => {
    const user = new User({
      email: "defaults@example.com",
      password: "pass",
      name: "Default User",
    });
    const savedUser = await user.save();
    expect(savedUser.isVerified).toBe(false);
    expect(savedUser.lastLogin).toBeInstanceOf(Date);
  });

  it("should allow setting and retrieving verification and reset fields", async () => {
    const user = new User({
      email: "fields@example.com",
      password: "pass",
      name: "Fields User",
      verificationToken: "token123",
      verificationTokenExpiresAt: new Date(Date.now() + 10000),
      resetPasswordCode: "reset123",
      resetPasswordCodeExpiresAt: new Date(Date.now() + 20000),
    });
    const savedUser = await user.save();
    expect(savedUser.verificationToken).toBe("token123");
    expect(savedUser.verificationTokenExpiresAt).toBeInstanceOf(Date);
    expect(savedUser.resetPasswordCode).toBe("reset123");
    expect(savedUser.resetPasswordCodeExpiresAt).toBeInstanceOf(Date);
  });
});
