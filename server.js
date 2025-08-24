import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authRoutes from "./routes/auth.js";
import User from "./models/User.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send({ message: "hi wellcom" })
})
app.use("/auth", authRoutes);
app.get("/test",async (req, res)  => {
  const hashed = await bcrypt.hash("054090", 10);
  const user = new User({
    username:"yoba",
    name:"younes",
    email:"younesbenzaama011@gmail.com",
    password: hashed,
    userType:"superUser",
    occupation:"owner",
    phone:"05400",
  });

  await user.save();
  res.status(201).json({ msg: "User registered successfully" });
  
})
// db connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`✅ Server running on port ${process.env.PORT}`)
    )
  )
  .catch((err) => console.log(err));
