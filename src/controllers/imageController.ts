import express from "express";
import { cloudinary } from "../config/cloudinaryConfig";

export const uploadImage = async (
  req: express.Request,
  res: express.Response
) => {
  const uploadResult = await cloudinary.uploader
    .upload(
      "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
      {
        public_id: "shoes",
      }
    )
    .catch((error) => {
      console.log(error);
    });

  console.log(uploadResult);
  res.send(uploadResult);
};
