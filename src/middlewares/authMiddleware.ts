import express from "express";
import jwt from "jsonwebtoken";

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
      res.status(500).json({ error: "JWT secret is not configured" });
      return;
    }

    jwt.verify(token, jwtToken);
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
};
