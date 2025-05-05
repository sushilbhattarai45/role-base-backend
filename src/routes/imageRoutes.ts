import express from "express";
import { uploadImage } from "../controllers/imageController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
const router = express.Router();

router.route("/upload").post(AuthMiddleware, uploadImage);

export default router;
