import mongoose, { Types } from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      require: [true, "code is required"],
      trim: true,
      unique: true,
      minLength: [2, "Name must be at least 2 characters"],
      maxLength: [30, "Name must be at most 20 characters"],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
      min: [1, "amount must be at least 1"],
      max: [100, "amount must be at most 100"],
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, "User is required"],
    },
    usedBy: [
      {
        type: Types.ObjectId,
        ref: "user",
      },
    ],
    fromDate: {
      type: Date,
      required: [true, "fromDate is required"],
    },
    toDate: {
      type: Date,
      required: [true, "fromDate is required"],
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("coupon", couponSchema);
