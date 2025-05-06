import express from "express";
import { cloudinary } from "../config/cloudinaryConfig";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const uploadImage = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    console.log(req.user);
    if (!req.file) {
      res.status(400).send({ message: "No file Attached", status: "failed" });
      return;
    }
    const uploadResult = await cloudinary.uploader
      .upload(req.file.path, {
        public_id: "user",
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(uploadResult);
    if (uploadResult) {
      const updateToDB = await prisma.image.create({
        data: {
          imageUrl: uploadResult.url,
          cloudId: uploadResult.asset_id,
          uploadedBy: req.user.userId,
          role: "user",
        },
      });
      if (updateToDB) {
        res.status(200).send({
          message: "Image Uploaded Succesfully",
          status: "success",
        });
      }
    } else {
      res
        .status(500)
        .send({ message: "Internal server errors", status: "failed" });
    }
  } catch (e) {
    res
      .status(500)
      .send({ message: "Internal server errors", status: "failed" });
  }
};

export const getImage = async (req: express.Request, res: express.Response) => {
  try {
    console.log(req.user.userId);
    const check = await prisma.image.findMany({
      where: {
        uploadedBy: req.user.userId,
      },
    });
    if (check) {
      res.status(200).send({
        data: check,
        status: "success",
        message: "success",
      });
    } else {
      res.status(404).send({
        message: "No data found",
        status: "success",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Internal server error",
      status: "failed",
    });
  }
};
