import express from "express";
import jwt from "jsonwebtoken";

export const AuthMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log("next function");
  const token = req.headers["authorization"]?.split(" ")[1];
  const jwtToken = process.env.JWT_TOKEN;

  if (!token || !jwtToken) {
    throw new Error("Token Required");
  }
  const match = jwt.verify(token, jwtToken);
  if (match) {
    console.log(match);
  }
    next();
};
