  import mongoose, { Types } from "mongoose";

  const productSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Name is required"],
        minLength: [2, "Name must be at least 2 characters"],
        maxLength: [60, "Name must be at most 20 characters"],
      },
      description: {
        type: String,
        trim: true,
        required: [true, "description is required"],
        minLength: [10, "Name must be at least 2 characters"],
      },
      slug: {
        type: String,
        unique: true,
        trim: true,
        minLength: [2, "Name must be at least 2 characters"],
        maxLength: [60, "Name must be at most 20 characters"],
      },
      createdBy: {
        type: Types.ObjectId,
        ref: "user",
        required: [true, "User is required"],
      },
      category: {
        type: Types.ObjectId,
        ref: "category",
        required: [true, "Category is required"],
      },
      subCategory: {
        type: Types.ObjectId,
        ref: "subCategory",
        required: [true, "subCategory is required"],
      },
      brand: {
        type: Types.ObjectId,
        ref: "brand",
        required: [true, "brand is required"],
      },
      image: {
        secure_url: String,
        public_id: String,
      },
      coverImages: [
        {
          secure_url: String,
          public_id: String,
        },
      ],
      price: {
        type: Number,
        default: 1,
        required: [true, "Price is required"],
      },
      discount: {
        type: Number, 
        default: 1,
        min: [1, "Discount must be at least 1%"],
        max: [100, "Discount must be at most 100%"],
      },
      subPrice: {
        type: Number,
        default: 1,
      },
      stock: {
        type: Number,
        required: [true, "Quantity is required"],
        default: 0,
      },
      rateAvg: {
        type: Number,
        default: 0,
      },
      rateNum: {
        type: Number,
        default: 0,
      },
      customID: String,
    },
    { timestamps: true, versionKey: false }
  );

  export default mongoose.model("product", productSchema);
