import express from "express";
import { cloudinary } from "../config/cloudinaryConfig";
import { PrismaClient } from "@prisma/client";
import { ApiError } from "../middlewares/errorHandler";
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

export const getImage = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    console.log(req.user.userId);
    const images = await prisma.image.findMany({
      where: {
        uploadedBy: req.user.userId,
      },
    });
    if (images.length > 0) {
      res.status(200).send({
        data: images,
        status: "success",
        message: "success",
      });
    } else {
      throw new ApiError("No Data Found", 400);
    }
  } catch (err) {
    next(err);
  }
};

export const deleteImage = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    if (!req?.body?.imageId) {
      throw new ApiError("No Image ID", 400);
    }
    const check = await prisma.image.delete({
      where: {
        id: req.body.imageId,
      },
    });

    if (check) {
      res.status(200).send({
        status: "success",
        message: "deleted Successfully",
      });
    } else {
      throw new ApiError("No Data Found", 400);
    }
  } catch (err) {
    next(err);
  }
};

export const paginatingImages = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const page = Number(req.body.page) || 1;

    const limit = Number(req.body.limit) || 2;
    const skip = (page - 1) * limit;

    const [images, total] = await Promise.all([
      prisma.image.findMany({
        skip,
        take: limit,
        orderBy: {
          id: "desc",
        },
      }),
      prisma.image.count(),
    ]);

    if (images.length === 0) {
      throw new ApiError("No Data Found", 400);
    }
    res.status(200).send({
      data: images,
      status: "success",
      message: "Images retrieved successfully",
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
    return;
  } catch (err) {
    next(err);
  }
};
