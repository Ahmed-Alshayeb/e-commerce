import mongoose, { Types } from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, "User is required"],
    },
    products: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "product",
          required: [true, "product is required"],
        },
        quantity: {
          type: Number,
          required: [true, "quantity is required"],
        },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("cart", cartSchema);
