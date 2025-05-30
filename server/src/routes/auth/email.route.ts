import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  checkVerificationCode,
  verifyEmail,
} from "../../controllers/auth/email-veify.controller";

const router = express.Router();

router.post("/send/verification/:userId", verifyEmail);
router.post("/check/verification/code/:userId", checkVerificationCode);

export default router;
