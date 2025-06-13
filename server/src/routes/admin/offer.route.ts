import express from "express";
import {
  CreateOffer,
  deleteOffer,
  getAllOffer,
  updateOffer,
} from "../../controllers/admin/offer.controller";
const router = express.Router();

router.post("/create", CreateOffer);
router.delete("/delete/:offerId", deleteOffer);
router.patch("/update/:offerId", updateOffer);
router.get("/get", getAllOffer);

export default router;
