import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js"; // Product model
import products from "./data/products.js"; // Sample data

dotenv.config();

// ✅ Function to insert sample product data
const importData = async () => {
  try {
    await Product.deleteMany(); // Clear old products
    await Product.insertMany(products); // Add new sample products

    console.log("✅ Sample products imported successfully!");
    process.exit(); // Exit process
  } catch (error) {
    console.error("❌ Error importing data:", error);
    process.exit(1);
  }
};

// ✅ Connect to MongoDB, then import data
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected for seeding");
    return importData(); // Run data insertion
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
