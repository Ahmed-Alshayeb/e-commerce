import mongoose, { Types } from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      unique: true,
      minLength: [2, "Name must be at least 2 characters"],
      maxLength: [20, "Name must be at most 20 characters"],
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      minLength: [2, "Name must be at least 2 characters"],
      maxLength: [20, "Name must be at most 20 characters"],
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
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
categorySchema.virtual("subCategories", {
  ref: "subCategory",
  localField: "_id",
  foreignField: "category",
});


export default mongoose.model("category", categorySchema);
