import express from "express";
import { cloudinary } from "../config/cloudinaryConfig";

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
        public_id: "shoes",
      })
      .catch((error) => {
        console.log(error);
      });

    console.log(uploadResult);
    res.send(uploadResult);
  } catch (e) {}
};
