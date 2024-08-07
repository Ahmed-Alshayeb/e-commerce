import { nanoid } from "nanoid";
import slugify from "slugify";

import AppError from "../../utils/errorClass.js";
import cloudinary from "../../utils/cloudinary.js";
import { asyncHandler } from "../../middleware/error.js";
import categoryModel from "../../../DB/models/category.model.js";
import subCategoryModel from "../../../DB/models/subCategory.model.js";
import ApiFeatures from "../../utils/apiFeatures.js";

// @desc    create category
// @route   POST categories
// @access  Private
export const createCategory = asyncHandler(async (req, res, next) => {
  const { title } = req.body;

  const categoryExist = await categoryModel.findOne({ title });
  if (categoryExist) {
    return next(new AppError(400, "category already exists"));
  }

  if (!req.file) {
    return next(new AppError(400, "image is required"));
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
    folder: `Ecommerce/categories/${title}`,
  });

  // role back Cloudinary
  req.filePath = `Ecommerce/categories/${title}`;

  // create category
  const category = await categoryModel.create({
    title,
    slug: slugify(title),
    image: {
      secure_url,
      public_id,
    },
    createdBy: req.user._id,
  });

  // role back DB
  req.data = {
    model: "category",
    id: category._id,
  };

  res.status(201).json({ msg: "success", category });
});

// @desc    get Categories
// @route   GET categories
// @access  Private
export const getCategories = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(categoryModel.find(), req.query)
    .pagination()
    .sort()
    .select()
    .filter()
    .search();

  const categories = await apiFeatures.mongooseQuery;

  res.status(200).json({ msg: "success", page: apiFeatures.page, count: categories.length, categories });
});

// @desc    update Category
// @route   PATCH categories/:id
// @access  Private
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { title } = req.body;
  const { id } = req.params;

  const category = await categoryModel.findById(id);

  if (title) {
    if (title === category.title) {
      return next(new AppError(400, "title should be different"));
    }
    if (await categoryModel.findOne({ title })) {
      return next(new AppError(400, "category already exists"));
    }

    category.title = title;
    category.slug = slugify(title);
  }

  if (req.file) {
    await cloudinary.uploader.destroy(category.image.public_id);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
      folder: `Ecommerce/categories/${category.title}`,
    });

    category.image = {
      secure_url,
      public_id,
    };
  }

  await category.save();
  res.status(200).json({ msg: "success", category });
});

// @desc    delete category
// @route   DELETE categories/:id
// @access  Private
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel.findByIdAndDelete({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!category) {
    return next(new AppError(404, "category not found or not have permission"));
  }

  // delete subCategories of this category
  await subCategoryModel.deleteMany({ category: category._id });

  // delete image from cloudinary
  await cloudinary.uploader.destroy(category.image.public_id);

  res.status(200).json({ msg: "success" });
});
