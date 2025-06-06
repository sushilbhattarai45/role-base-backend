import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { errorHandler, ApiError } from "../middlewares/errorHandler";

const prisma = new PrismaClient();

////eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODExYWU0MzZjYTA0M2I1NzFmMzI4NjIiLCJyb2xlIjoidXNlciIsImlhdCI6MTc0NTk5MzU4NCwiZXhwIjoxNzQ2ODU3NTg0fQ.CBr8xxvcDFpN1HLVSQ9SBqIujzX-kw9QerX-XSj6v9Uexport const loginController = async (

export const loginController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    if (!req.body.email || !req.body.password) {
      throw new ApiError("Fields are Required", 400);
    }

    const serverToken = process.env.JWT_TOKEN;
    console.log(req.body);

    if (!serverToken) {
      throw new Error("Invalid Server Token");
    }

    const userExists = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (userExists) {
      let compare = await bcrypt.compare(
        req.body.password,
        userExists.password
      );
      if (compare) {
        const userToken = jwt.sign(
          {
            userId: userExists?.id,
            role: "admin",
          },

          serverToken,
          {
            expiresIn: "10d",
          }
        );
        console.log(req.user);

        res.status(200).send({
          message: "success",
          status: "success",
          token: userToken,
        });
      } else {
        throw new ApiError("Wrong Password", 400);
      }
    } else {
      throw new ApiError("User doesn't exist with the username", 400);
    }
  } catch (e) {
    next(e);
  }
};

export const registerController = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    if (!req.body.email || !req.body.password) {
      throw new ApiError("Fields are Required", 400);
    }
    const serverToken = process.env.JWT_TOKEN;
    if (!serverToken) {
      throw new Error("Missing Server Token");
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const checkExisting = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (checkExisting) {
      throw new ApiError("Email Already Exists", 400);
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
  } catch (err) {
    next(err);
  }
};

export const updateInfo = async (
  req: express.Request,
  res: express.Response
) => {
  console.log(req.user);
  try {
    if (!req?.body?.name) {
      res.status(400).send({
        message: "Invalid Inputs",
      });
    }

    let updateData = await prisma.user.update({
      where: {
        id: req.user.userId,
      },

      data: {
        name: req.body.name,
      },
    });

    if (updateData) {
      res.status(200).send({
        message: "Update successfull",
        status: "success",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Server Error",
      status: "failed",
    });
  }

  // const login = await prisma.user.findFirst({
  //   where: {
  //     email: req.body.email,
  //   },
  // });
};
