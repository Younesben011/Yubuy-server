import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Register
router.post("/register",adminOnly, async (req, res) => {
  try {
    const { username, name, email, password, userType, occupation, phone } = req.body;

    // check if username already exists
    const existUser = await User.findOne({ username });
    if (existUser) return res.status(400).json({ msg: "Username already taken" });

    // if email provided, check uniqueness
    if (email) {
      const existEmail = await User.findOne({ email });
      if (existEmail) return res.status(400).json({ msg: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      name,
      email,
      password: hashed,
      userType,
      occupation,
      phone,
    });

    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login (by username OR email)
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

    // allow login via username OR email
    const user = await User.findOne( { username });
        const users = await User.find({})

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        occupation: user.occupation,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
