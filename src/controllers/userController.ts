import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

////eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODExYWU0MzZjYTA0M2I1NzFmMzI4NjIiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTk5MzU4NCwiZXhwIjoxNzQ2ODU3NTg0fQ.CBr8xxvcDFpN1HLVSQ9SBqIujzX-kw9QerX-XSj6v9Uexport const loginController = async (

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
        // password: password,
      },
    });
    if (login) {
      let compare = await bcrypt.compare(password, login.password);
      if (compare) {
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

        res.status(200).send({
          message: "success",
          status: "success",
          token: userToken,
          compare: compare,
        });
      } else {
        res.status(401).send({
          message: "Wrong Password",
          status: "failed",
        });
      }
    } else {
      res.status(401).send({
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
  if (!req.body.email || !req.body.password) {
    throw new Error("No data");
  }
  const serverToken = process.env.JWT_TOKEN;
  if (!serverToken) {
    throw new Error("Server Error");
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  const checkExisting = await prisma.user.findFirst({
    where: {
      email: req.body.email,
    },
  });
  if (checkExisting) {
    res.status(409).send({
      message: "Email already exists",
      status: "failed",
    });
  } else {
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
  }
};
