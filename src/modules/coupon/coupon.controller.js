import AppError from "../../utils/errorClass.js";
import couponModel from "../../../DB/models/coupon.model.js";
import { asyncHandler } from "../../middleware/error.js";
import ApiFeatures from "../../utils/apiFeatures.js";

// @desc    create coupon
// @route   POST /coupons
// @access  Private
export const createCoupon = asyncHandler(async (req, res, next) => {
  const { code, amount, fromDate, toDate } = req.body;

  const coupon = await couponModel.findOne({ code });
  if (coupon) {
    return next(new AppError(400, "Coupon already exists"));
  }

  const newCoupon = await couponModel.create({
    code,
    amount,
    fromDate,
    toDate,
    createdBy: req.user._id,
  });

  // role back DB
  req.data = {
    model: "coupon",
    id: coupon._id,
  };

  res.status(201).json({ msg: "success", newCoupon });
});

// @desc    update coupon
// @route   PATCH coupons/:id
// @access  Private
export const updateCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { code, amount, fromDate, toDate } = req.body;

  const coupon = await couponModel.findOneAndUpdate(
    {
      _id: id,
      createdBy: req.user._id,
    },
    {
      code,
      amount,
      fromDate,
      toDate,
      createdBy: req.user._id,
    },
    { new: true }
  );
  if (!coupon) {
    return next(new AppError(400, "Coupon not exists or you not have permission.."));
  }

  res.status(201).json({ msg: "update success", coupon });
});

// @desc    get all coupons
// @route   GET coupons
// @access  Private
export const getCoupons = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(couponModel.find(), req.query)
    .pagination()
    .sort()
    .select()
    .filter()
    .search();

  const coupons = await apiFeatures.mongooseQuery;

  res.status(200).json({ msg: "success", page: apiFeatures.page, count: coupons.length, coupons });
});

// @desc    delete coupon
// @route   DELETE coupons/:id
// @access  Private
export const deleteCoupon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Coupon = await couponModel.findByIdAndDelete({
    _id: id,
    createdBy: req.user._id,
  });

  if (!Coupon) {
    return next(new AppError(404, "Coupon not found or you not have permission"));
  }

  res.status(200).json({ msg: "delete success" });
});
