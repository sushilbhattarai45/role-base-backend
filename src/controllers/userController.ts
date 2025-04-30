import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODExYWU0MzZjYTA0M2I1NzFmMzI4NjIiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTk4OTE4NywiZXhwIjoxNzQ2ODUzMTg3fQ.kqYEbCkjUrDigVVh5wmk8bCgVy1w_-lcrbU3p0AXqLc
export const loginController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    if (!req.body.email || !req.body.password) {
      throw new Error("No data");
    }
    const email = req.body.email;
    const password = req.body.password;
    const serverToken = process.env.JWT_TOKEN;
    console.log(req.body);
    if (!serverToken) {
      throw new Error("Server Error");
    }
    const login = await prisma.user.findFirst({
      where: {
        email: email,
        password: password,
      },
    });
    if (login) {
      const userToken = jwt.sign(
        {
          userId: login?.id,
          role: "user",
        },

        serverToken,
        {
          expiresIn: "10d",
        }
      );

      res.send(200).send({
        message: "success",
        status: "success",
        data: login,
      });
    } else {
      res.send(200).send({
        message: "error",
        status: "failed",
      });
    }
  } catch (e) {
    res.send("error ");
  }
};

export const registerController = async (
  req: express.Request,
  res: express.Response
) => {
  if (!req.body.name || !req.body.password) {
    throw new Error("No data");
  }
  const serverToken = process.env.JWT_TOKEN;
  if (!serverToken) {
    throw new Error("Server Error");
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    },
  });

  res.status(200).send({
    message: "Succesfully registered",
    status: "success",
  });
};
