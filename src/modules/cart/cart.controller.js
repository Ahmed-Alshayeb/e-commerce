import AppError from "../../utils/errorClass.js";
import cartModel from "../../../DB/models/cart.model.js";
import productModel from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../middleware/error.js";

// @desc    create cart
// @route   POST /cart
// @access  Private
export const createCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  // check if product exists and in stock
  const product = await productModel.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });
  if (!product) {
    return next(new AppError(400, "product not exists or out of stock"));
  }

  // check if cart exists
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    const newCart = await cartModel.create({
      user: req.user._id,
      products: [{ productId, quantity }],
    });
    return res.status(201).json({ msg: "success", cart: newCart });
  }

  // if cart not exists
  let falg = false;
  for (const product of cart.products) {
    if (productId == product.productId) {
      product.quantity = quantity;
      falg = true;
    }
  }

  if (!falg) {
    cart.products.push({ productId, quantity });
  }
  await cart.save();

  // role back DB
  req.data = {
    model: "cart",
    id: cart._id,
  };

  res.status(201).json({ msg: "success", cart });
});

// @desc    remove cart
// @route   PATCH /cart
// @access  Private
export const removeCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  // check if cart exists
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id, "products.productId": productId },
    { $pull: { products: { productId } } },
    {
      new: true,
    }
  );

  res.status(201).json({ msg: "success", cart });
});

// @desc    clear cart
// @route   PATCH /cart
// @access  Private
export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { products: [] },
    {
      new: true,
    }
  );

  res.status(201).json({ msg: "success", cart });
});
