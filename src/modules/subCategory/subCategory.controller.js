import { nanoid } from "nanoid";
import slugify from "slugify";

import asyncHandler from "express-async-handler";
import AppError from "../../utils/errorClass.js";
import cloudinary from "../../utils/cloudinary.js";
import ApiFeatures from "../../utils/apiFeatures.js";
import categoryModel from "../../../DB/models/category.model.js";
import subCategoryModel from "../../../DB/models/subCategory.model.js";

// @desc    create subCategory
// @route   POST subCategories
// @access  Private
export const createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;

  const categoryExist = await categoryModel.findById(category);
  if (!categoryExist) {
    return next(new AppError(404, "subCategory not exists"));
  }

  const subCategoryExist = await subCategoryModel.findOne({ name });
  if (subCategoryExist) {
    return next(new AppError(400, "subCategory already exists"));
  }

  if (!req.file) {
    return next(new AppError(400, "image is required"));
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
    folder: `Ecommerce/categories/${categoryExist.title}/subCategories/${name}`,
  });

  // role back Cloudinary
  req.filePath = `Ecommerce/categories/${categoryExist.title}/subCategories/${name}`;

  const subCategory = await subCategoryModel.create({
    name,
    slug: slugify(name),
    image: {
      secure_url,
      public_id,
    },
    category,
    createdBy: req.user._id,
  });

  // role back DB
  req.data = {
    model: "subCategory",
    id: subCategory._id,
  };

  res.status(201).json({ msg: "success", subCategory });
});

// @desc    get SubCategory
// @route   GET subCategories
// @access  Private
export const getSubCategories = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(subCategoryModel.find(), req.query)
    .pagination()
    .sort()
    .select()
    .filter()
    .search();

  const subCategories = await apiFeatures.mongooseQuery;

  res
    .status(200)
    .json({ msg: "success", page: apiFeatures.page, count: subCategories.length, subCategories });
});

// @desc    update SubCategory
// @route   PATCH subCategories/:id
// @access  Private
export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  const subCategory = await subCategoryModel.findById(id);
  const category = await categoryModel.findById(subCategory.category);

  if (name) {
    if (name === subCategory.name) {
      return next(new AppError(400, "name should be different"));
    }
    if (await subCategoryModel.findOne({ name })) {
      return next(new AppError(400, "subCategory already exists"));
    }

    subCategory.name = name;
    subCategory.slug = slugify(name);
  }

  if (req.file) {
    await cloudinary.uploader.destroy(subCategory.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: `Ecommerce/categories/${category.title}/subCategories/${name}`,
    });

    subCategory.image = {
      secure_url,
      public_id,
    };
  }

  await subCategory.save();
  res.status(200).json({ msg: "success", subCategory });
});

// @desc    delete Subcategory
// @route   DELETE subCategories/:id
// @access  Private
export const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await subCategoryModel.findByIdAndDelete(req.params.id);

  if (!subCategory) {
    return next(new AppError(404, "subCategory not found"));
  }

  await cloudinary.uploader.destroy(subCategory.image.public_id);

  res.status(200).json({ msg: "success" });
});
