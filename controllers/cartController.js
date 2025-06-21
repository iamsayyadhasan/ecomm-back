
import Cart from "../models/Cart.js";


export const addToCart = async (req, res) => {
  try {
    console.log(req);
    const { product } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!product || !product._id) {
      return res.status(400).json({ message: "Missing product ID" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const index = cart.items.findIndex(
      (item) => item.product.toString() === product._id
    );

    if (index > -1) {
      cart.items[index].quantity += 1;
    } else {
      cart.items.push({ product: product._id, quantity: 1 });
    }

    await cart.save();
    const populated = await cart.populate("items.product");
    res.json({ cart: populated.items });
  } catch (err) {
    console.error("❌ Add to cart error:", err);
    res.status(500).json({ message: "Add to cart failed" });
  }
};


export const getUserCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID missing in params" });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    res.json({ cart: cart?.items || [] });
  } catch (err) {
    console.error("❌ Get cart error:", err);
    res.status(500).json({ message: "Error fetching cart" });
  }
};


export const updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!productId || quantity == null || quantity < 0) {
      return res.status(400).json({ message: "Invalid product ID or quantity" });
    }

    const cart = await Cart.findOne({ user: userId });
    const index = cart?.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (index !== -1) {
      cart.items[index].quantity = quantity;
      await cart.save();
    }

    const populated = await cart.populate("items.product");
    res.json({ cart: populated.items });
  } catch (err) {
    console.error("❌ Update quantity error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};


export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const productId = req.params.productId;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing user or product ID" });
    }

    const cart = await Cart.findOne({ user: userId });
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    const populated = await cart.populate("items.product");
    res.json({ cart: populated.items });
  } catch (err) {
    console.error("❌ Remove item error:", err);
    res.status(500).json({ message: "Remove failed" });
  }
};
