import AppError from "../../utils/errorClass.js";
import wishListModel from "../../../DB/models/wishList.model.js";
import productModel from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../middleware/error.js";

// @desc    create wishList
// @route   POST wishLists/
// @access  Private
export const createWishList = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const product = await productModel.findById(productId);
  if (!product) {
    return next(new AppError(404, "product not found"));
  }

  const wishList = await wishListModel.findOne({ user: req.user._id });
  if (!wishList) {
    const newWishList = await wishListModel.create({
      user: req.user._id,
      products: [productId],
    });
    return res.status(201).json({ msg: "success", wishList: newWishList });
  }
  const newWishList = await wishListModel.findOneAndUpdate(
    { user: req.user._id },
    { $addToSet: { products: productId } },
    { new: true }
  );

  // role back DB
  req.data = {
    model: "wishList",
    id: wishList._id,
  };

  res.status(201).json({ msg: "success", wishList: newWishList });
});

// @desc    delete wishList
// @route   PATCH wishLists/:id
// @access  public
export const deleteWishList = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const newWishList = await wishListModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { products: productId } },
    { new: true }
  );

  res.status(201).json({ msg: "success", wishList: newWishList });
});
