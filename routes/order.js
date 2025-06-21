import express from "express";
import { Order } from "../models/Order.js"; // 
import requireLogin from "../middleware/requireLogin.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    console.log('body',req.user.id)
    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
    });
    await order.save();
    res.json({ success: true, order });

  } catch (err) {
    res.status(500).json({ error: "Failed to place order" });
  }
});

router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id})
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

export default router;
