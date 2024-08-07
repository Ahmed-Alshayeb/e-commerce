import asyncHandler from "express-async-handler";
import { nanoid } from "nanoid";
import slugify from "slugify";

import AppError from "../../utils/errorClass.js";
import cloudinary from "../../utils/cloudinary.js";
import ApiFeatures from "../../utils/apiFeatures.js";
import brandModel from "../../../DB/models/brand.model.js";

// @desc    create brand
// @route   POST brands
// @access  Private
export const createBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const brandExist = await brandModel.findOne({ name });
  if (brandExist) {
    return next(new AppError(400, "Brand already exists"));
  }

  if (!req.file) {
    return next(new AppError(400, "image is required"));
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
    folder: `Ecommerce/Brands/${name}`,
  });

  // role back Cloudinary
  req.filePath = `Ecommerce/Brands/${name}`;

  const brand = await brandModel.create({
    name,
    slug: slugify(name),
    image: {
      secure_url,
      public_id,
    },
    createdBy: req.user._id,
  });

  // role back DB
  req.data = {
    model: "brand",
    id: brand._id,
  };

  res.status(201).json({ msg: "success", brand });
});

// @desc    get all brands
// @route   GET brands
// @access  Private
export const getbrands = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(brandModel.find(), req.query)
    .pagination()
    .sort()
    .select()
    .filter()
    .search();

  const brands = await apiFeatures.mongooseQuery;

  res.status(200).json({ msg: "success", page: apiFeatures.page, count: brands.length, brands });
});

// @desc    update brand
// @route   PATCH brands/:id
// @access  Private
export const updateBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  const brand = await brandModel.findById(id);

  if (name) {
    if (name === brand.name) {
      return next(new AppError(400, "name should be different"));
    }
    if (await brandModel.findOne({ name })) {
      return next(new AppError(400, "brand already exists"));
    }

    brand.name = name;
    brand.slug = slugify(name);
  }

  if (req.file) {
    await cloudinary.uploader.destroy(brand.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: `Ecommerce/brands/${brand.name}`,
    });

    brand.image = {
      secure_url,
      public_id,
    };
  }

  await brand.save();
  res.status(200).json({ msg: "success", brand });
});

// @desc    delete brand
// @route   DELETE brands/:id
// @access  Private
export const deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await brandModel.findByIdAndDelete(req.params.id);

  if (!brand) {
    return next(new AppError(404, "brand not found"));
  }

  await cloudinary.uploader.destroy(brand.image.public_id);

  res.status(200).json({ msg: "success" });
});
