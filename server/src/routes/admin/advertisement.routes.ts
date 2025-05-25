import express = require("express");
import {
  adsForUser,
  createAds,
  deleteAds,
  getAllAds,
  updateAds,
  updateIsActive,
} from "../../controllers/admin/ads.controller";

const router = express.Router();

router.post("/create", createAds);
router.get("/get/all", getAllAds);
router.put("/update/:id", updateAds);
router.delete("/delete/:id", deleteAds);
router.put("/isactive/update/:id", updateIsActive);

router.get("/toShow/ads", adsForUser);

export default router;
