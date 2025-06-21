import express from "express";
import auth from "../middleware/auth.js";
import {
  addToCart,
  getUserCart,
  updateQuantity,
  removeFromCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/user/:id", auth, getUserCart);

router.post("/add", auth, addToCart);

router.put("/update", auth, updateQuantity);

router.delete("/remove/:productId", auth, removeFromCart);

export default router;
