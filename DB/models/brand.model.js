import mongoose, { Types } from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      unique: true,
      minLength: [2, "Name must be at least 2 characters"],
      maxLength: [30, "Name must be at most 20 characters"],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      minLength: [2, "Name must be at least 2 characters"],
      maxLength: [30, "Name must be at most 20 characters"],
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, "User is required"],
    },
    image: {
      secure_url: String,
      public_id: String,
    },
    customID: String,
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("brand", brandSchema);
