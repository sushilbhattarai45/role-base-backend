import express from "express";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

export const ImageMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads/");
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
      },
    });

const checkFilter = 


    const upload = multer({ storage: storage });
  } catch (err) {
    res.status(500).send("Internal server error");
    return;
  }
};
