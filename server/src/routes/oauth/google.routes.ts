import express from "express";
import { Oauth } from "../../controllers/auth/Oauth.controller";
const router = express.Router();

router.post("/google-route", Oauth);

export default router;
