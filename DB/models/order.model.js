import mongoose, { Types } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, "User is required"],
    },
    products: [
      {
        name: { type: String, required: [true, "product name is required"] },
        productId: { type: String, required: [true, "product ID is required"] },
        quantity: {
          type: String,
          required: [true, "product quantity is required"],
        },
        price: { type: Number, required: [true, "product price is required"] },
        finalPrice: { type: Number, required: true },
      },
    ],
    subPrice: {
      type: Number,
      required: [true, "subPrice is required"],
    },
    couponId: {
      type: String,
      ref: "coupon",
    },
    totalPrice: {
      type: Number,
      required: [true, "total is required"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card"],
    },
    status: {
      type: String,
      enum: [
        "placed",
        "waitPayment",
        "delivered",
        "onWay ",
        "canceled",
        "rejected",
      ],
    },
    canceledBy: {
      type: Types.ObjectId,
      ref: "user",
    },
    reason: { String },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("order", orderSchema);
