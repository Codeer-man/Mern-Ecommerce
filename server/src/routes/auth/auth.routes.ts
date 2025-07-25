import express from "express";
import {
  authLogin,
  authRegister,
  GetUserData,
  logout,
  refreshToken,
} from "../../controllers/auth/auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { loginSchema, registerSchema } from "../../validation/user.validation";
import { validation } from "../../middleware/validation.middleware";

const router = express.Router();

router.post("/register", validation(registerSchema), authRegister);
router.post("/login", validation(loginSchema), authLogin);
router.get("/getData", authMiddleware, GetUserData);
router.post("/logout", logout);
router.post("/refreshToken", refreshToken);

router.get("/check-auth", authMiddleware, (req, res) => {
  console.log("auth triggered ");

  const user = (req as any).user;
  res.status(200).json({ sucess: true, message: "Authenticated User", user });
});

export default router;
