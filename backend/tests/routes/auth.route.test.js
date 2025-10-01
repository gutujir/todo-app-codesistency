import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../src/app.js";
import { connect, closeDatabase, clearDatabase } from "../setup/mongodb.js";

// Mock sendEmail to avoid sending real emails during tests
// ESM-safe mock for sendEmail
jest.unstable_mockModule("../../src/resend/resendEmail.js", () => ({
  ...jest.requireActual("../../src/resend/resendEmail.js"),
  sendEmail: async () => Promise.resolve(),
}));

beforeAll(async () => {
  await connect();
}, 30000);

afterEach(async () => {
  await clearDatabase();
}, 30000);

afterAll(async () => {
  await closeDatabase();
}, 30000);

describe("Auth API", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe("test@example.com");
  }, 30000);

  it("should not register with existing email", async () => {
    await request(app).post("/api/auth/signup").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });
    const res = await request(app).post("/api/auth/signup").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  }, 30000);

  it("should not login with wrong credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "notfound@example.com",
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  }, 30000);

  it("should verify email with valid code", async () => {
    // Register user
    const signupRes = await request(app).post("/api/auth/signup").send({
      email: "verify@example.com",
      password: "password123",
      name: "Verify User",
    });
    // Get verification code from DB
    const { User } = await import("../../src/models/user.model.js");
    const user = await User.findOne({ email: "verify@example.com" });
    const code = user.verificationToken;
    // Verify email
    const res = await request(app)
      .post("/api/auth/verify-email")
      .send({ verificationCode: code });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.isVerified).toBe(true);
  }, 30000);

  it("should resend verification email for unverified user", async () => {
    // Register user
    await request(app).post("/api/auth/signup").send({
      email: "resend@example.com",
      password: "password123",
      name: "Resend User",
    });
    // Resend verification
    const res = await request(app)
      .post("/api/auth/resend-verification")
      .send({ email: "resend@example.com" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  }, 30000);

  it("should not resend verification for verified user", async () => {
    // Register and verify user
    await request(app).post("/api/auth/signup").send({
      email: "verified@example.com",
      password: "password123",
      name: "Verified User",
    });
    const { User } = await import("../../src/models/user.model.js");
    const user = await User.findOne({ email: "verified@example.com" });
    user.isVerified = true;
    await user.save();
    // Try to resend verification
    const res = await request(app)
      .post("/api/auth/resend-verification")
      .send({ email: "verified@example.com" });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  }, 30000);

  it("should send forgot password code for existing user", async () => {
    // Register user
    await request(app).post("/api/auth/signup").send({
      email: "forgot@example.com",
      password: "password123",
      name: "Forgot User",
    });
    // Forgot password
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "forgot@example.com" });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  }, 30000);

  it("should not send forgot password code for non-existent user", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "nouser@example.com" });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  }, 30000);

  it("should reset password with valid code", async () => {
    // Register user
    await request(app).post("/api/auth/signup").send({
      email: "reset@example.com",
      password: "password123",
      name: "Reset User",
    });
    // Request forgot password
    await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: "reset@example.com" });
    // Get reset code from DB
    const { User } = await import("../../src/models/user.model.js");
    const user = await User.findOne({ email: "reset@example.com" });
    const code = user.resetPasswordCode;
    // Reset password
    const res = await request(app)
      .post("/api/auth/reset-password-by-code")
      .send({
        email: "reset@example.com",
        code,
        newPassword: "newpassword123",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  }, 30000);

  it("should not reset password with invalid code", async () => {
    // Register user
    await request(app).post("/api/auth/signup").send({
      email: "badreset@example.com",
      password: "password123",
      name: "Bad Reset User",
    });
    // Try to reset with wrong code
    const res = await request(app)
      .post("/api/auth/reset-password-by-code")
      .send({
        email: "badreset@example.com",
        code: "wrongcode",
        newPassword: "newpassword123",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  }, 30000);

  it("should logout user", async () => {
    // Register and login user
    await request(app).post("/api/auth/signup").send({
      email: "logout@example.com",
      password: "password123",
      name: "Logout User",
    });
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "logout@example.com",
      password: "password123",
    });
    // Logout
    const res = await request(app).post("/api/auth/logout");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  }, 30000);

  it("should check auth for logged in user", async () => {
    // Register and login user
    await request(app).post("/api/auth/signup").send({
      email: "checkauth@example.com",
      password: "password123",
      name: "Check Auth User",
    });
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "checkauth@example.com",
      password: "password123",
    });
    // Get cookie from login response
    const cookies = loginRes.headers["set-cookie"];
    // Check auth with cookie
    const res = await request(app)
      .get("/api/auth/check-auth")
      .set("Cookie", cookies)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe("checkauth@example.com");
  }, 30000);
});
