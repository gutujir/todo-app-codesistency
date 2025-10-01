import { jest } from "@jest/globals";
import {
  signup,
  verifyEmail,
  resendVerification,
  login,
  logout,
  forgotPassword,
  resetPasswordByCode,
  checkAuth,
} from "../../src/controllers/auth.controller.js";

// Mock User model and dependencies
const userModel = await import("../../src/models/user.model.js");
jest.spyOn(userModel.User, "findOne").mockImplementation(() => null);
jest.spyOn(userModel.User.prototype, "save").mockImplementation(() => {});

// Mock utility functions
jest.unstable_mockModule(
  "../../src/utils/generateTokenAndSetCookie.js",
  () => ({
    generateTokenAndSetCookie: jest.fn(),
  })
);
jest.unstable_mockModule("../../src/utils/generateVerificationCode.js", () => ({
  generateVerificationCode: () => "123456",
}));
jest.unstable_mockModule("../../src/resend/resendEmail.js", () => ({
  sendEmail: async () => Promise.resolve(),
}));

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

describe("auth.controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("should return 400 if required fields are missing", async () => {
      const req = { body: { email: "", password: "", name: "" } };
      const res = mockRes();
      await signup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe("verifyEmail", () => {
    it("should return 400 if verification fails", async () => {
      const req = { body: { verificationCode: "badcode" } };
      const res = mockRes();
      await verifyEmail(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe("resendVerification", () => {
    it("should handle error if user not found", async () => {
      const req = { body: { email: "nouser@example.com" } };
      const res = mockRes();
      await resendVerification(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe("login", () => {
    it("should return 400 if user not found", async () => {
      const req = { body: { email: "nouser@example.com", password: "pass" } };
      const res = mockRes();
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe("logout", () => {
    it("should clear the token cookie and return success", () => {
      const req = {};
      const res = mockRes();
      logout(req, res);
      expect(res.clearCookie).toHaveBeenCalledWith("token");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: expect.any(String),
      });
    });
  });

  describe("forgotPassword", () => {
    it("should handle error if user not found", async () => {
      const req = { body: { email: "nouser@example.com" } };
      const res = mockRes();
      await forgotPassword(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe("resetPasswordByCode", () => {
    it("should handle error if code is invalid", async () => {
      const req = {
        body: { email: "nouser@example.com", code: "bad", newPassword: "pass" },
      };
      const res = mockRes();
      await resetPasswordByCode(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe("checkAuth", () => {
    it("should handle error if user is not authenticated", async () => {
      jest.spyOn(userModel.User, "findById").mockImplementation(() => ({
        select: () => null,
      }));
      const req = { userId: undefined };
      const res = mockRes();
      await checkAuth(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });
});
