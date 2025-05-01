import express from "express";
const router = express.Router();
import {
  loginController,
  registerController,
  updateInfo,
} from "../controllers/userController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

router.route("/login").post(loginController);
router.route("/register").post(registerController);
router.route("/update").put(AuthMiddleware, updateInfo);

export default router;
