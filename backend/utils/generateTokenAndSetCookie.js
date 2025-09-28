import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true, // prevents XSS attacks
    secure: process.env.NODE_ENV === "production", // set to true in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // allow cross-site cookies in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
};
