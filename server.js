import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js"; 

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: "*",
 
}));
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

app.get("/", (req, res) => {
  res.send(" API is working at root route!");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected successfully"))
  .catch((err) => {
    console.error(" MongoDB connection error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
