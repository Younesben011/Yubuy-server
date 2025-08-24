import express from "express";
import Product from "../models/Product.js";
import { authMiddleware, roleMiddleware } from "../middleware/auth.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "stock-manager"]),
  async (req, res) => {
    try {
      const product = new Product(req.body);
      const saved = await product.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "stock-manager"]),
  async (req, res) => {
    try {
      const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updated) return res.status(404).json({ message: "Product not found" });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "stock-manager"]),
  async (req, res) => {
    try {
      const deleted = await Product.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Product not found" });
      res.json({ message: "Product deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
