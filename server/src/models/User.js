import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    role: { type: String, default: "customer", enum: ["customer", "admin"] },
  },
  { timestamps: true },
);

export default model("User", userSchema);
