import express from "express";
import {
  CreateOffer,
  deleteOffer,
  updateOffer,
} from "../../controllers/admin/offer.controller";
const router = express.Router();

router.post("/create", CreateOffer);
router.delete("/delete/:offerId", deleteOffer);
router.patch("/update/:offerId", updateOffer);

export default router;
