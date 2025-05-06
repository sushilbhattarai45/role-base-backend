import express from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import {
  deleteImage,
  getImage,
  uploadImage,
} from "../controllers/imageController";
import { uploadImageMidd } from "../middlewares/imageMiddleware";
import { AdminMiddleware } from "../middlewares/adminMiddleware";
const router = express.Router();

const ImageHandler = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  uploadImageMidd.single("image")(req, res, function (err) {
    console.log(req.file);
    if (err) {
      return res
        .status(400)
        .send({ message: "Invalid file type", status: "failed" });
    }
    uploadImage(req, res);
  });
};

router.route("/upload").post(AuthMiddleware, ImageHandler);
router.route("/get").get(AuthMiddleware, getImage);
router.route("/delete").get(AuthMiddleware, AdminMiddleware, deleteImage);

export default router;
