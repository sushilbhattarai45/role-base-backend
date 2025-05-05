import express from "express";
import { cloudinary } from "../config/cloudinaryConfig";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const uploadImage = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    if (!req.file) {
      res.send("Nop file");
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
          uploadedBy: "user",
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
