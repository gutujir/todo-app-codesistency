import { jest } from "@jest/globals";
import { generateTokenAndSetCookie } from "../../src/utils/generateTokenAndSetCookie.js";
import jwt from "jsonwebtoken";

describe("generateTokenAndSetCookie", () => {
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

  it("should set a cookie with a JWT token and correct options", () => {
    const res = { cookie: jest.fn() };
    generateTokenAndSetCookie(res, userId);
    expect(res.cookie).toHaveBeenCalledWith(
      "token",
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: false,
      })
    );
    // Check the token is valid
    const token = res.cookie.mock.calls[0][1];
    const decoded = jwt.verify(token, secret);
    expect(decoded.userId).toBe(userId);
  });

  it("should set a cookie even if no userId is provided, but token will not have userId", () => {
    const res = { cookie: jest.fn() };
    generateTokenAndSetCookie(res);
    expect(res.cookie).toHaveBeenCalledWith(
      "token",
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: false,
      })
    );
    const token = res.cookie.mock.calls[0][1];
    const decoded = jwt.verify(token, secret);
    expect(decoded.userId).toBeUndefined();
  });
});
