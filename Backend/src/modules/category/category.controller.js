import catchError from "../../Middleware/catchError.js";
import { AppError } from "../../../utils/appErorr.js";
import Category from "../../../database/models/category.model.js";
import Product from "../../../database/models/product.model.js";
import slugify from "slugify";
import { ApiFeatures } from "../../../utils/apiFeatures.js";

const createCategory = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  const category = new Category({
    ...req.body,
    createdBy: req.user._id, 
  });
  await category.save();
  res.status(201).json({ message: "Category created successfully", category });
});

const getAllCategories = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Category.find(), req.query)
  let categories = await apiFeatures.mongooseQuery;
  res
    .status(200)
    .json({
      message: "All Categories",
      categories,
    });
});

const getCategory = catchError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  res.status(200).json({ message: "Category found", category });
});

const updateCategory = catchError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }
  if (req.body.name) req.body.slug = slugify(req.body.name);

  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res
    .status(200)
    .json({ message: "Category updated successfully", updatedCategory });
});

const deleteCategory = catchError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) return next(new AppError("Category not found", 404));

  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "Category deleted successfully" });
});


const deleteCategory2 = catchError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) return next(new AppError("Category not found", 404));

  await Product.deleteMany({ category: req.params.id });

  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: `Category and all related products deleted successfully`,
  });
});


export {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteCategory2
};
