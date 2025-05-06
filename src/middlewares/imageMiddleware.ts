import express from "express";
import multer from "multer";

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists!
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

const filterFile = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    // res.status(400).send("Incorrect File Format")
    cb(new Error("Invalid file type or Multiple files"), false);
  }
};

// Create the upload middleware
export const uploadImageMidd = multer({
  storage: storage,
  fileFilter: filterFile,
  limits: {
    files: 1,
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
