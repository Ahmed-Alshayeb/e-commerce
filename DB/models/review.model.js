import mongoose, { Types } from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      require: [true, "code is required"],
      minLength: [2, "Name must be at least 2 characters"],
    },
    rate: {
      type: Number,
      required: [true, "amount is required"],
      min: [1, "rate must be at least 1"],
      max: [5, "rate must be at most 5"],
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, "User is required"],
    },
    productId: {
      type: Types.ObjectId,
      ref: "product",
      required: [true, "product is required"],
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("review", reviewSchema);
