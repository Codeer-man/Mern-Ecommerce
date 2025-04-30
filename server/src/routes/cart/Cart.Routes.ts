import express from "express";
import {
  addToCart,
  deleteCartItems,
  fetchCartItems,
  updateCartItemsQty,
} from "../../controllers/shop/Cart.controller";

const router = express.Router();

router.post("/add", addToCart);
router.get("/get/:userId", fetchCartItems);
router.put("/update-cart", updateCartItemsQty);
router.delete("/delete/:userId/product/:ProductId", deleteCartItems);

export default router;
