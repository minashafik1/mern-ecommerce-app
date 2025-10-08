import catchError from "../../Middleware/catchError.js";
import productModel from "../../../database/models/product.model.js";
import Category from "../../../database/models/category.model.js";
import { AppError } from "../../../utils/appErorr.js";
import cloudinary from '../../../utils/cloudinary.js'
const getAllProducts = catchError(async(req, res) => {
    const products = res.paginatedResults;
    res.status(200).json({message: "Products retrieved successfully", data: products});
});

export const getProducts = catchError(async (req, res, next) => {
  const products = await productModel.find().populate("category");
  res.status(200).json({ message: "success", products });
})

const getCategoryProducts = catchError(async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const category = await Category.findById(categoryId);
  if (!category) return res.status(404).json({ message: "Category not found" });

  const products = await productModel.find({ category: categoryId });
  res.status(200).json({ message: "success", products });
});

const getOneProduct = catchError(async(req, res) => {
    const product = await productModel.findById(req.params.productId).populate("category");
    if(product) return res.status(200).json({message: "Product retrieved successfully", data: product});
    res.status(404).json({message: "Product not found"});
});

// const addProduct = catchError(async(req, res) => {
//     const findCategory = await categoryModel.findOne({_id: req.params.categoryId});
//     if(!findCategory) return res.status(404).json({message: "Category not found"});
//     req.body.category = req.params.categoryId;
//     const product = await product.create(req.body);
//     res.status(201).json({message: "Product added successfully", data: product});
// });

// const updateProduct = catchError(async(req, res) => {
//     const updatedProduct = await productModel.findByIdAndUpdate(req.params.productId, req.body, {new: true});
//     if(updatedProduct) return res.status(200).json({message: "Product updated successfully", data: updatedProduct});
//     res.status(404).json({message: "Product not found"});
// });

// const deleteProduct = catchError(async(req, res) => {
//     const deletedProduct = await productModel.findByIdAndDelete(req.params.productId);
//     if(deletedProduct) return res.status(200).json({message: "Product deleted successfully"});
//     res.status(404).json({message: "Product not found"});
// });



const addProduct = catchError(async (req, res, next) => {
  const { name, description, price, quantity } = req.body;
  const { categoryId } = req.params;
  const { _id, username } = req.user;

  // check required images
  if (!req.files || !req.files.length) {
    return next(new AppError("Please select your images", 400));
  }

  // check category
  const findCategory = await Category.findById(categoryId);
  if (!findCategory) {
    return next(new AppError("Category not found", 404));
  }

  // upload images to cloudinary
  let imageArr = [];
  let publicArr = [];

  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `Product/ByAdmin_${username}/${name}`,
      }
    );
    imageArr.push(secure_url);
    publicArr.push(public_id);
  }

  // create product
  const newProduct = new productModel({
    name,
    description,
    createdBy: _id,
    category: categoryId,
    Images: imageArr,
    publicIds: publicArr,
    price,
    quantity,
  });

  const savedproduct = await newProduct.save();

  res.status(201).json({ message: "Product created successfully", savedproduct });
});

const updateProduct = catchError(async (req, res, next) => {
  const { productId } = req.params;

  // check product exists
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // if new images provided
  if (req.files && req.files.length > 0) {
    // delete old images from cloudinary
    for (const publicId of product.publicIds) {
      await cloudinary.uploader.destroy(publicId);
    }

    // upload new ones
    let imageArr = [];
    let publicArr = [];
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
        folder: `Product/ByAdmin_${username}/${name}`,
       });
      imageArr.push(secure_url);
      publicArr.push(public_id);
    }

    req.body.Images = imageArr;
    req.body.publicIds = publicArr;
  }

  // if updating category, validate
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    if (!category) {
      return next(new AppError("Invalid category", 400));
    }
  }

  const updatedProduct = await productModel.findByIdAndUpdate(productId, req.body, { new: true });
  res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
});

const deleteProduct = catchError(async (req, res, next) => {
  const { productId } = req.params;

  // find product first
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // delete images from cloudinary
  if (product.publicIds && product.publicIds.length > 0) {
    for (const publicId of product.publicIds) {
      await cloudinary.uploader.destroy(publicId);
    }
  }

  // delete product from DB
  await productModel.findByIdAndDelete(productId);

  res.status(200).json({ message: "Product deleted successfully" });
});

const searchProducts = catchError(async (req, res) => {
  const { query } = req.query; // ?query=shirt
  if (!query) return res.status(400).json({ message: 'Query is required' });

  const products = await productModel.find({
    name: { $regex: query, $options: 'i' } // البحث غير حساس لحالة الأحرف
  })

  res.status(200).json({ message: 'Search results', data: products });
});




export {getAllProducts, getCategoryProducts, getOneProduct, addProduct, updateProduct, deleteProduct , searchProducts};