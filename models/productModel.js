import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  category: String,
  description: String
});

const Product = mongoose.model("Product", productSchema);

export default Product;
