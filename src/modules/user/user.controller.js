import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { customAlphabet } from "nanoid";
import AppError from "../../utils/errorClass.js";
import { asyncHandler } from "../../middleware/error.js";
import userModel from "../../../DB/models/user.model.js";
import sendEmail from "../../service/sendEmail.service.js";

// @desc    signUp
// @route   POST users/signUp
// @access  public
export const signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password, cPassword, age, phone, address } = req.body;

  const emailExist = await userModel.findOne({ email });
  if (emailExist) {
    return next(new AppError(400, "email already exists"));
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "2m",
  });
  const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`;

  const rfToken = jwt.sign({ email }, process.env.RF_JWT_SECRET);
  const rfLink = `${req.protocol}://${req.headers.host}/users/rfToken/${rfToken}`;

  await sendEmail(
    email,
    "Verify your account",
    `<a href="${link}"> verify your account</a> <br/> <a href="${rfLink}"> resend verification email</a>`
  );

  const hash = bcrypt.hashSync(password, 10);
  const user = await userModel.create({
    name,
    email,
    password: hash,
    age,
    phone,
    address,
  });

  // role back DB
  req.data = {
    model: "user",
    id: user._id,
  };

  user
    ? res.status(201).json({ msg: "success", user })
    : next(new AppError(400, "user not created"));
});

// @desc    Verify Email
// @route   GET users/verifyEmail
// @access  Privet
export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded?.email) return next(new AppError(400, "invald token"));

  const user = await userModel.findOneAndUpdate(
    { email: decoded.email, confirmed: false },
    { confirmed: true }
  );
  if (user) {
    return res.status(200).json({ msg: "Verified Success" });
  }
  next(new AppError(500, "user not found or already verified"));
});

// @desc    Resend Token
// @route   GET users/rfToken
// @access  Privet
export const rfToken = asyncHandler(async (req, res, next) => {
  const { rfToken } = req.params;
  const decoded = jwt.verify(rfToken, process.env.RF_JWT_SECRET);
  if (!decoded?.email) return next(new AppError(400, "invald token"));

  const user = await userModel.findOne({
    email: decoded.email,
    confirmed: true,
  });

  if (user) next(new AppError(400, "user not found or already verified"));

  const token = jwt.sign({ email: decoded.email }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
  const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`;

  await sendEmail(
    decoded.email,
    "Verify your account",
    `<a href="${link}"> verify your account</a>`
  );

  res.status(200).json({ msg: "success" });
});

// @desc    forgetPassword
// @route   PATCH users/forgetPassword
// @access  Privet
export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return next(new AppError(404, "user not exists"));

  const code = customAlphabet("0123456789", 6);
  const OTP = code();

  await sendEmail(email, "Your OTP 👋", `<h3>Your OTP is <h1>${OTP}</h1></h3>`);

  await userModel.findOneAndUpdate({ email }, { OTP });
  res.status(200).json({ msg: "OTP send to your email" });
});

// @desc    resetPassword
// @route   PATCH users/resetPassword
// @access  Privet
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, OTP, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return next(new AppError(404, "user not exists"));

  if (user.OTP !== OTP) return next(new AppError(400, "invalid OTP"));
  4;

  const hash = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);

  await userModel.findOneAndUpdate(
    { email },
    { password: hash, OTP: "", passwordChangedAt: Date.now() }
  );
  res.status(200).json({ msg: "password updated successfully" });
});

// @desc    signIn
// @route   POST users/signIn
// @access  Privet
export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return next(new AppError(400, "invalid email or password"));

  const token = await jwt.sign(
    { email, id: user._id, role: user.role },
    process.env.JWT_SECRET
  );
  await userModel.findOneAndUpdate({ email }, { loggedIn: true });
  res
    .status(200)
    .json({ status: "success", msg: `welcome ${user.name}`, token });
});

// @desc    Get all users
// @route   GET users/
// @access  Privet
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await userModel.find({});
  res.status(200).json({ msg: "success", count: users.length, users });
});

// @desc    Update User
// @route   PATCH /users
// @access  Privet
export const updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, age, phone, address } = req.body;

  if (email) {
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return next(new AppError(400, "email already exists"));
    }
  }

  const user = await userModel.findOneAndUpdate(
    { _id: req.user.id },
    { name, email, age, phone, address },
    { new: true }
  );
  res.status(200).json({ msg: "update success", user });
});

// @desc    Delete User
// @route   DELETE /users
// @access  Privet
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOneAndDelete({ _id: req.user.id });
  res.status(200).json({ msg: "delete success" });
});

// @desc    Update Password
// @route   PATCH /users
// @access  Privet
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, password, cPassword } = req.body;

  const user = await userModel.findById(req.user.id);
  if (!(await bcrypt.compare(oldPassword, user.password))) {
    return next(new AppError(400, "invalid old password"));
  }
  const hash = await bcrypt.hash(password, 10);
  const newUser = await userModel.findOneAndUpdate(
    { _id: req.user.id },
    { password: hash }
  );
  res.status(200).json({ msg: "password updated success" });
});
