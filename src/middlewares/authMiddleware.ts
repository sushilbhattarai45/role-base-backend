import express from "express";
import jwt from "jsonwebtoken";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

export const AuthMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log("next function");

  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const jwtToken = process.env.JWT_TOKEN;
    if (!token) {
      res.status(401).json({ error: "Access token is missing" });
      return;
    }

    if (!jwtToken) {
      res.status(500).json({ error: "Token is not configured: Server Error" });
      return;
    }

    const decoded = jwt.verify(token, jwtToken);
    // Attach decoded data to request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid/Expired token" });
    return;
  }
};
