import mongoose, { Types } from "mongoose";

const wishListSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, "User is required"],
    },
    products: [
      {
        type: Types.ObjectId,
        ref: "product",
        required: [true, "product is required"],
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("wishList", wishListSchema);
