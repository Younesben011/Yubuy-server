import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true }, // optional
    password: { type: String, required: true },
    userType: { type: String, default: "worker" }, // worker | admin
    occupation: { type: String, default: "operator" },
    phone: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
