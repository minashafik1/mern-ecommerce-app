import catchError from "../../Middleware/catchError.js";
import { AppError } from "../../../utils/appErorr.js";
import Wishlist from "../../../database/models/wishlist.model.js";
import Product from "../../../database/models/product.model.js";

export const addToWishlist = catchError(async (req, res, next) => {
  const product = await Product.findById(req.body.productId);
  if (!product) return next(new AppError("Product not found", 404));

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: [req.body.productId],
    });
  } else {
    if (wishlist.products.includes(req.body.productId)) {
      return next(new AppError("Product already in wishlist", 400));
    }
    wishlist.products.push(req.body.productId);
    await wishlist.save();
  }

  await wishlist.populate("products", "name price Images");
  res.status(200).json({ message: "Product added", wishlist });
});

export const removeFromWishlist = catchError(async (req, res, next) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { products: req.params.productId } },
    { new: true }
  ).populate("products", "name price Images");

  if (!wishlist) return next(new AppError("Wishlist not found", 404));

  res.status(200).json({ message: "Product removed", wishlist });
});

export const getWishlist = catchError(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate("products", "name price Images");

  res.status(200).json({ message: "success", wishlist: wishlist || { products: [] } });
});
