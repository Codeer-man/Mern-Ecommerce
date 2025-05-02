import express from "express";

import {
  addAddress,
  deleteAddress,
  editAddress,
  fetchAllAddress,
} from "../../controllers/shop/Address.controller";

const router = express.Router();

router.post("/add", addAddress);
router.get("/get/:userId", fetchAllAddress);
router.delete("/delete/:addressId/:userId", deleteAddress);
router.put("/update/:addressId/:userId", editAddress);

export default router;
