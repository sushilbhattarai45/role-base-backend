import express from "express";
const router = express.Router();
import {
  loginController,
  registerController,
} from "../controllers/userController";

router.route("/login").get(loginController);
router.route("/register").get(registerController);

export default router;
