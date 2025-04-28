import express from "express";
import {
  getGoogleLoginCallback,
  getGoogleLoginPage,
} from "../../controllers/auth/Oauth/auth.controller";

const router = express.Router();

router.get("/google", getGoogleLoginPage);
router.post("/google/callback", getGoogleLoginCallback);

export default router;
