import slugify from "slugify";

import AppError from "../../utils/errorClass.js";
import cloudinary from "../../utils/cloudinary.js";
import ApiFeatures from "../../utils/apiFeatures.js";
import { asyncHandler } from "../../middleware/error.js";
import brandModel from "../../../DB/models/brand.model.js";
import productModel from "../../../DB/models/product.model.js";
import categoryModel from "../../../DB/models/category.model.js";
import subCategoryModel from "../../../DB/models/subCategory.model.js";

// @desc    create product
// @route   POST products
// @access  Private
export const createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, category, subCategory, brand, price, discount, stock, rateAvg } = req.body;

  // check if category exists
  const categoryExist = await categoryModel.findById(category);
  if (!categoryExist) {
    return next(new AppError(404, "Category not found"));
  }

  // check if subCategory exists
  const subCategoryExist = await subCategoryModel.findOne({ _id: subCategory, category });
  if (!subCategoryExist) {
    return next(new AppError(404, "subCategory not found"));
  }

  // check if brand exists
  const brandExist = await brandModel.findById(brand);
  if (!brandExist) {
    return next(new AppError(404, "Brand not found"));
  }

  // check if product exists
  const productExist = await productModel.findOne({ name });
  if (productExist) {
    return next(new AppError(400, "product already exists"));
  }

  // calculate discount
  const subPrice = price - (price * (discount || 0)) / 100;

  if (!req.files) {
    return next(new AppError(400, "image is required"));
  }

  // upload image
  let list = [];
  for (const file of req.files.coverImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
      folder: `Ecommerce/categories/${categoryExist.title}/sunbCategories/${subCategoryExist.name}/products/${name}/coverImages`,
    });
    list.push({ secure_url, public_id });
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
    folder: `Ecommerce/categories/${categoryExist.title}/sunbCategories/${subCategoryExist.name}/products/${name}/image`,
  });

  // role back Cloudinary
  req.filePath = `Ecommerce/categories/${categoryExist.title}/sunbCategories/${subCategoryExist.name}/products/${name}`;

  const product = await productModel.create({
    name,
    slug: slugify(name),
    description,
    createdBy: req.user._id,
    category,
    subCategory,
    brand,
    price,
    discount,
    subPrice: subPrice,
    stock,
    rateAvg,
    image: { secure_url, public_id },
    coverImages: list,
  });

  // role back DB
  req.data = {
    model: "product",
    id: product._id,
  };

  res.status(201).json({ msg: "success", product });
});

// @desc    update product
// @route   PATCH products/:id
// @access  Private
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { name, description, category, subCategory, brand, price, discount, stock, rateAvg } = req.body;
  const { id } = req.params;

  // check if category exists
  const categoryExist = await categoryModel.findById(category);
  if (!categoryExist) {
    return next(new AppError(404, "Category not found"));
  }

  // check if subCategory exists
  const subCategoryExist = await subCategoryModel.findOne({ _id: subCategory, category });
  if (!subCategoryExist) {
    return next(new AppError(404, "subCategory not found"));
  }

  // check if brand exists
  const brandExist = await brandModel.findById(brand);
  if (!brandExist) {
    return next(new AppError(404, "Brand not found"));
  }

  // check if product exists
  const product = await productModel.findOne({ _id: id, createdBy: req.user._id });
  if (!product) {
    return next(new AppError(404, "product not found"));
  }

  // update name
  if (name) {
    if (name == product.name) {
      return next(new AppError(409, "name should be different"));
    }
    if (await productModel.findOne({ name })) {
      return next(new AppError(409, "product already exists"));
    }
    product.name = name;
    product.slug = slugify(name);
  }

  // update description
  if (description) {
    product.description = description;
  }

  // update stock
  if (stock) {
    product.stock = stock;
  }

  // update discount and price
  if (price && discount) {
    product.subPrice = price - price * (discount / 100);
    product.price = price;
    product.discount = discount;
  } else if (price) {
    product.subPrice = price - price * (product.discount / 100);
    product.price = price;
  } else if (discount) {
    product.subPrice = product.price - product.price * (discount / 100);
    product.discount = discount;
  }

  // upload image
  if (req.files) {
    // upload single image
    if (req.files?.image) {
      await cloudinary.uploader.destroy(product.image.public_id);
      const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: `Ecommerce/categories/${categoryExist.title}/sunbCategories/${subCategoryExist.name}/products/${product.name}/image`,
      });
      product.image = { secure_url, public_id };
    }

    // upload coverImages
    if (req.files?.coverImages) {
      await cloudinary.api.delete_resources_by_prefix(
        `Ecommerce/categories/${categoryExist.title}/sunbCategories/${subCategoryExist.name}/products/${product.name}/coverImages`
      );
      const list = [];
      for (const file of req.files.coverImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
          folder: `Ecommerce/categories/${categoryExist.title}/sunbCategories/${subCategoryExist.name}/products/${product.name}/coverImages`,
        });
        list.push({ secure_url, public_id });
      }
      product.coverImages = list;
    }
  }

  await product.save();

  res.status(200).json({ msg: "success", product });
});

// @desc    get products
// @route   GET products/
// @access  Private
export const getProducts = asyncHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .pagination()
    .sort()
    .select()
    .filter()
    .search();

  const products = await apiFeatures.mongooseQuery;

  res.status(200).json({ msg: "success", page: apiFeatures.page, count: products.length, products });
});

// @desc    delete product
// @route   DELETE products/:id
// @access  Private
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find the product by ID
  const product = await productModel.findOne({ _id: id, createdBy: req.user._id });
  if (!product) {
    return next(new AppError(404, "Product not found"));
  }

  // check if category exists
  const category = await categoryModel.findById(product.category);
  if (!category) {
    return next(new AppError(404, "Category not found"));
  }

  // check if subCategory exists
  const subCategory = await subCategoryModel.findOne({ _id: product.subCategory, category });
  if (!subCategory) {
    return next(new AppError(404, "subCategory not found"));
  }

  // delete image from cloudinary
  await cloudinary.api.delete_resources_by_prefix(
    `Ecommerce/categories/${category.title}/sunbCategories/${subCategory.name}/products/${product.name}`
  );

  // delete image folder from cloudinary
  await cloudinary.api.delete_folder(
    `Ecommerce/categories/${category.title}/sunbCategories/${subCategory.name}/products/${product.name}`
  );

  // Delete product from the database
  await productModel.findByIdAndDelete(id);
  res.status(200).json({ msg: "success" });
});
