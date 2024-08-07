import mongoose from "mongoose";
import { roleSystem } from "../../src/utils/roleSystem.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: [2, "Name must be at least 2 characters"],
      maxLength: [20, "Name must be at most 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minLength: [8, "Password must be at least 8 characters"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      trim: true,
    },
    phone: [String],
    address: [String],
    confirmed: {
      type: Boolean,
      default: false,
    },
    loggedIn: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: [roleSystem.Admin, roleSystem.User],
      default: roleSystem.User,
    },
    OTP: String,
    passwordChangedAt: Date,
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("User", userSchema);
