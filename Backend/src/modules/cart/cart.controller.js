import catchError from "../../Middleware/catchError.js";
import { AppError } from "../../../utils/appErorr.js";
import Cart from "../../../database/models/cart.model.js";
import productModel from "../../../database/models/product.model.js";

function calcTotalCartPrice(isCartExist) {
  isCartExist.totalCartPrice = 
  isCartExist.cartItems.reduce((prev, item) =>  prev += item.price * item.quantity, 0);
}


const addToCart = catchError(async (req, res, next) => {
  let isCartExist =await Cart.findOne({user:req.user._id});
  let product = await productModel.findById(req.body.product); 
  if(!product) return next(new AppError("Product not found", 404));
  req.body.price = product.price;
  if(req.body.quantity > product.quantity) return next(new AppError("Quantity exceeds available stock", 400));
  
  if(!isCartExist) {
    let cart = new Cart({
      user: req.user._id,
      cartItems: [req.body]
    });
    calcTotalCartPrice(cart);
    await cart.save();
    cart = await Cart.findById(cart._id).populate("cartItems.product", "name price Images");
    return res.status(201).json({message: "success", cart});
  }else{
    let item = isCartExist.cartItems.find(item => item.product == req.body.product);
    if(item) {
      item.quantity += req.body.quantity || 1;
      if(item.quantity > product.quantity) return next(new AppError("Quantity exceeds available stock", 400));
    } else {
      isCartExist.cartItems.push(req.body);
    }
    calcTotalCartPrice(isCartExist);
    await isCartExist.save();
    isCartExist = await Cart.findById(isCartExist._id).populate("cartItems.product", "name price Images");
  }
  res.status(200).json({message: "success", cart: isCartExist});
});



const updateQuantity = catchError(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new AppError("Cart not found", 404));

  let item = cart.cartItems.find(item => item.product == req.params.id);
  if (!item) return next(new AppError("Product not found", 404));
    
  const product = await productModel.findById(item.product);
  if (!product) return next(new AppError("Product not found", 404));

  item.quantity = req.body.quantity;

  if (item.quantity > product.quantity) {
    return res.status(400).json({
      message: `  Quantity exceeds available stock ${product.quantity}`
    });
  }

  if (item.quantity < 1) {
    return res.status(400).json({
      message: "Quantity must be at least 1"
    });
  }

  calcTotalCartPrice(cart);
  await cart.save();
  await cart.populate("cartItems.product", "name price Images ");

  res.status(200).json({ message: "success", cart });
});


const removeItemFromCart = catchError(async (req, res, next) => {
  let cart = await Cart.findOneAndUpdate({ user: req.user._id },
    { $pull: { cartItems: { _id: req.params.id } } }, { new: true });
  if(!cart) return next(new AppError("Cart not found", 404));
  calcTotalCartPrice(cart);
  await cart.save();
  await cart.populate("cartItems.product", "name price Images ");
  res.status(200).json({ message: "success", cart });
});

// Get cart for logged user
const getLoggedUserCart = catchError(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id })
   .populate("cartItems.product", "name price Images ");
  if (!cart) {
    return res.status(200).json({
      message: "success",
      cart: { user: req.user._id, cartItems: [], totalCartPrice: 0 },
  });
  }
  res.status(200).json({ message: "success", cart });
});

const clearUserCart = catchError(async (req, res, next) => {
  let cart = await Cart.findOneAndDelete({ user: req.user._id });
  if (!cart) return next(new AppError("Cart not found", 404));
  res.status(200).json({ message: "Cart cleared successfully" });
});

const getAllCarts = catchError(async (req, res, next) => {
  let carts = await Cart.find().populate("user", "name email").populate("cartItems.product", "name price Images");
  res.status(200).json({ message: "success", carts });
});

const deleteCart = catchError(async (req,re,next) => {
  let cart = await Cart.findByIdAndDelete(req.params.id);
  if(!cart) return next(new AppError("Cart not found", 404));
  res.status(200).json({message: "Cart deleted successfully"});
})

export {
  addToCart,
  updateQuantity,
  removeItemFromCart,
  clearUserCart,
  getLoggedUserCart,
  getAllCarts,
  deleteCart
};