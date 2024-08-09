import asyncHandler from "express-async-handler";

import AppError from "../../utils/errorClass.js";
import cartModel from "../../../DB/models/cart.model.js";
import productModel from "../../../DB/models/product.model.js";
import couponModel from "../../../DB/models/coupon.model.js";
import orderModel from "../../../DB/models/order.model.js";
import { createInvoice } from "../../utils/pdf.js";
import sendEmail from "../../service/sendEmail.service.js";
import { payment } from "../../utils/payment.js";
import Stripe from "stripe";

// @desc    create order
// @route   POST /orders
// @access  public
export const createOrder = asyncHandler(async (req, res, next) => {
  const { productId, quantity, couponCode, address, phone, paymentMethod } = req.body;

  // check if coupon exists or expired
  if (couponCode) {
    const coupon = await couponModel.findOne({
      code: couponCode,
      //  usedBy: { $nin: [req.user._id] }
    });
    if (!coupon || coupon.toDate < Date.now()) {
      return next(new AppError(400, "coupon not found or code aleady used or expired"));
    }
    req.body.coupon = coupon;
  }

  // check order from cart or single product
  let products = [];
  let falg = false;
  if (productId) {
    products = [{ productId, quantity }];
  } else {
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart.products.length) {
      return next(new AppError(400, "cart is empty"));
    }
    products = cart.products;
    falg = true;
  }

  // check if products exist
  let finalProducts = [];
  let subPrice = 0;
  for (let product of products) {
    const checkProduct = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
    });
    if (!checkProduct) {
      return next(new AppError(400, "product not exists or out of stock"));
    }
    if (falg) {
      product = product.toObject();
    }
    product.name = checkProduct.name;
    product.price = checkProduct.price;
    product.finalPrice = checkProduct.subPrice * product.quantity;
    subPrice += product.finalPrice;

    finalProducts.push(product);
  }

  // create order
  const order = await orderModel.create({
    user: req.user._id,
    products: finalProducts,
    subPrice,
    couponId: req.body?.coupon?._id,
    totalPrice: subPrice - (subPrice * (req.body?.coupon?.amount || 0)) / 100,
    address,
    phone,
    paymentMethod,
    status: paymentMethod === "cash" ? "placed" : "waitPayment",
  });

  if (req.body?.coupon) {
    await couponModel.findOneAndUpdate({ _id: req.body.coupon._id }, { $push: { usedBy: req.user._id } });
  }

  for (const product of finalProducts) {
    await productModel.findOneAndUpdate({ _id: product.productId }, { $inc: { stock: -product.quantity } });
  }

  if (falg) {
    await cartModel.findOneAndUpdate({ user: req.user._id }, { products: [] });
  }

  // // create invoice
  // const invoice = {
  //   shipping: {
  //     name: req.user.name,
  //     address: req.user.address,
  //     phone: req.user.phone,
  //   },
  //   items: order.products,
  //   unitCost: order.subPrice * 100,
  //   paid: order.totalPrice * 100,
  //   invoice_nr: order._id,
  //   subtotal: order.subPrice * 100,
  // };

  // await createInvoice(invoice, "invoice.pdf");

  // // send invoice to email
  // await sendEmail(req.user.email, "invoice", `<h1>Your Orde</h1>`, [
  //   {
  //     path: "invoice.pdf",
  //     contentType: "application/pdf",
  //   },
  // ]);

  // payment
  if (paymentMethod == "card") {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    if (req.body?.coupon) {
      const coupon = await stripe.coupons.create({
        percent_off: req.body.coupon.amount,
        duration: "once",
      });
      req.body.couponId = coupon.id;
    }
    const session = await payment({
      stripe,
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,
      line_items: order.products.map((product) => {
        return {
          price_data: {
            currency: "egp",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price * 100,
          },
          quantity: product.quantity,
        };
      }),
      metadata: {
        orderId: order._id.toString(),
      },
      success_url: `${req.protocol}://${req.headers.host}/orders/success/${order._id}`,
      cancel_url: `${req.protocol}://${req.headers.host}/orders/canceled/${order._id}`,
      discounts: req.body?.coupon ? [{ coupon: req.body.couponId }] : [],
    });

    return res.status(200).json({ url: session.url, order });
  }
  // role back DB
  req.data = {
    model: "order",
    id: order._id,
  };

  res.status(201).json({ msg: "success", order });
});

// @desc    cancele order
// @route   POST /orders
// @access  public
export const canceleOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { reason } = req.body;
  const order = await orderModel.findOne({ _id: id, user: req.user._id });

  if (!order) {
    return next(new AppError(404, "order not found"));
  }

  if (
    (order.paymentMethod === "cash" && order.status != "placed") ||
    (order.paymentMethod === "card" && order.status != "waitPayment")
  ) {
    return next(new AppError(400, "cancele not allowed"));
  }

  await orderModel.updateOne({ _id: id }, { status: "canceled", canceledBy: req.user._id, reason });

  if (order?.couponId) {
    await couponModel.updateOne({ _id: order?.couponId }, { $pull: { usedBy: req.user._id } });
  }

  for (const product of order.products) {
    await productModel.updateOne({ _id: product.productId }, { $inc: { stock: product.quantity } });
  }

  res.status(201).json({ msg: "order canceled" });
});

// @desc    webhook
// @route   POST /orders/webhook
// @access  private
export const webhook = asyncHandler(async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.WEBHOOKS_ENDPOINT_SECRET);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  const { orderId } = event.data.object.metadata;
  if (event.type !== "checkout.session.completed") {
    await orderModel.findByIdAndUpdate(orderId, { status: "rejected" });
    return res.status(400).json({ msg: "order rejected" });
  }

  await orderModel.findByIdAndUpdate(orderId, { status: "placed" });
  return res.status(200).json({ msg: "success" });
});
