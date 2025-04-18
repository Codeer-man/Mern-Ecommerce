import express from "express";
import {
  authLogin,
  authRegister,
  GetUserData,
  logout,
} from "../controllers/auth/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { loginSchema, registerSchema } from "../validation/user.validation";
import { validation } from "../middleware/validation.middleware";

const router = express.Router();

router.post("/register", validation(registerSchema), authRegister);
router.post("/login", validation(loginSchema), authLogin);
router.get("/getData", authMiddleware, GetUserData);
router.post("/logout", authMiddleware, logout);

export default router;
