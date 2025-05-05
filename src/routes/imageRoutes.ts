import express from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { uploadImage } from "../controllers/imageController";
import { uploadImageMidd } from "../middlewares/imageMiddleware";
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

export default router;
