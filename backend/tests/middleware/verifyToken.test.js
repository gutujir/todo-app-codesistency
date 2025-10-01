import { jest } from "@jest/globals";
import { verifyToken } from "../../src/middleware/verifyToken.js";
import jwt from "jsonwebtoken";

// Mock response and next
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("verifyToken middleware", () => {
  const userId = "user123";
  const secret = "testsecret";
  let oldEnv;

  beforeAll(() => {
    oldEnv = process.env.JWT_SECRET;
    process.env.JWT_SECRET = secret;
  });

  afterAll(() => {
    process.env.JWT_SECRET = oldEnv;
  });

  it("should call next if token is valid", () => {
    const token = jwt.sign({ userId }, secret);
    const req = { cookies: { token } };
    const res = mockRes();
    const next = jest.fn();
    verifyToken(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe(userId);
  });

  it("should return 401 if no token provided", () => {
    const req = { cookies: {} };
    const res = mockRes();
    const next = jest.fn();
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: expect.stringContaining("no token provided"),
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", () => {
    const req = { cookies: { token: "badtoken" } };
    const res = mockRes();
    const next = jest.fn();
    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: expect.stringContaining("token verification failed"),
    });
    expect(next).not.toHaveBeenCalled();
  });
});
