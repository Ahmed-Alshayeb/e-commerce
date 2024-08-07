import AppError from "../../utils/errorClass.js";
import productModel from "../../../DB/models/product.model.js";
import orderModel from "../../../DB/models/order.model.js";
import reviewModel from "../../../DB/models/review.model.js";
import { asyncHandler } from "../../middleware/error.js";

// @desc    create order
// @route   POST /orders
// @access  public
export const createReview = asyncHandler(async (req, res, next) => {
  const { comment, rate } = req.body;
  const { productId } = req.params;

  //check product
  const product = await productModel.findOne({ _id: productId });
  if (!product) {
    return next(new AppError(404, "product not found"));
  }

  // check review
  const review = await reviewModel.findOne({ createdBy: req.user._id, productId });
  if (review) {
    return next(new AppError(400, "you already reviewed this product"));
  }

  // check order
  const order = await orderModel.findOne({
    user: req.user._id,
    "products.productId": productId,
    status: "delivered",
  });
  if (!order) {
    return next(new AppError(400, "you did not order this product"));
  }

  // create review
  const newReview = await reviewModel.create({
    comment,
    rate,
    productId,
    createdBy: req.user._id,
  });

  let sum = product.rateAvg * product.rateNum;
  sum = sum + rate;

  product.rateAvg = sum / (product.rateNum + 1);
  product.rateNum += 1;
  await product.save();

  res.status(201).json({ msg: "success", review: newReview });
});

// @desc    delete review
// @route   DELETE /reviews
// @access  public
export const deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await reviewModel.findOneAndDelete({ _id: id, createdBy: req.user._id });

  if (!review) {
    return next(new AppError(404, "review not found"));
  }

  const product = await productModel.findById(review.productId);

  if (product.rateNum === 1) {
    // If there's only one review, reset the rateAvg and rateNum
    product.rateAvg = 0;
    product.rateNum = 0;
  } else {
    let sum = product.rateAvg * product.rateNum;
    sum = sum - review.rate;

    product.rateAvg = sum / (product.rateNum - 1);
    product.rateNum -= 1;
  }

  await product.save();

  res.status(200).json({ msg: "delete success" });
});
