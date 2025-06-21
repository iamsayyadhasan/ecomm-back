import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    const uniqueCategories = new Set();
    const filtered = [];

    for (const product of products) {
      const cat = product.category.toLowerCase();
      if (!uniqueCategories.has(cat)) {
        uniqueCategories.add(cat);
        filtered.push(product);
      }
    }

    res.status(200).json(filtered);
  } catch (error) {
    console.error(" Error fetching products:", error);
    res.status(500).json({ message: "Server error while fetching products." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error(" Error fetching product:", error);
    res.status(500).json({ message: "Server error while fetching product." });
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    const products = await Product.find({
      category: { $regex: new RegExp(req.params.category, "i") },
    });

    if (!products.length)
      return res
        .status(404)
        .json({ message: "No products found for this category" });

    res.status(200).json(products);
  } catch (error) {
    console.error(" Error fetching category products:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching category products." });
  }
});

export default router;
