import catchError from "../../Middleware/catchError.js";
import orderModel from "../../../database/models/order.model.js";
import productModel from "../../../database/models/product.model.js";
import Cart from "../../../database/models/cart.model.js";
import { AppError } from "../../../utils/appErorr.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("./.env") });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const createOrder = catchError(async (req, res, next) => {
  const { paymentMethod, shippingAddress } = req.body;

  // 1. Find user cart
  const cart = await Cart.findOne({ user: req.user._id })
    .populate("cartItems.product", "name price quantity");

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }

  let orderProducts = [];
  let totalPrice = 0;

  // 2. Validate stock + prepare order products
  for (const item of cart.cartItems) {
    const product = item.product;
    if (!product) return next(new AppError("Product not found", 404));
    if (item.quantity > product.quantity) {
      return next(new AppError("Quantity exceeds stock", 400));
    }

    orderProducts.push({
      productId: product._id,
      quantity: item.quantity,
      name: product.name,
      productPrice: product.price,
      finalPrice: product.price * item.quantity,
    });

    totalPrice += product.price * item.quantity;
  }

  // 3. Create order
  let order = new orderModel({
    userId: req.user._id,
    products: orderProducts,
    totalPrice,
    paymentMethod,
    orderStatus: paymentMethod === "card" ? "pending" : "confirmed",
  });

  // 4. Stripe Payment
  if (paymentMethod === "card") {
    const session = await stripe.checkout.sessions.create({
      line_items: orderProducts.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: item.productPrice * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/api/orders/success?orderId=${order._id}`,
      cancel_url: `${req.protocol}://${req.get("host")}/api/orders/cancel?orderId=${order._id}`,
      customer_email: req.user.email,
      client_reference_id: order._id.toString(),
      metadata: shippingAddress || {},
    });

    order.paymentIntentId = session.id;
    await order.save();

    return res.status(201).json({
      message: "Order created, complete payment with Stripe",
      order,
      sessionUrl: session.url,
    });
  }

  // 5. Cash Payment → reduce stock immediately
  for (const item of orderProducts) {
    await productModel.findByIdAndUpdate(item.productId, {
      $inc: { quantity: -item.quantity },
    });
  }

  await order.save();
  await Cart.findOneAndUpdate({ user: req.user._id }, { cartItems: [] });

  res.status(201).json({
    message: "Order created successfully (Cash)",
    order,
  });
});


export const webhookCheckout = catchError(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return next(new AppError(`Webhook Error: ${err.message}`, 400));
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Find order using paymentIntentId (or session.id depending on what you store)
    const order = await orderModel.findOneAndUpdate(
      { paymentIntentId: session.id },
      { orderStatus: "confirmed" },
      { new: true }
    );

    if (order) {
      // Reduce stock
      for (const item of order.products) {
        await productModel.findByIdAndUpdate(item.productId, {
          $inc: { quantity: -item.quantity },
        });
      }
    }
      await Cart.findOneAndUpdate({ user: order.userId }, { cartItems: [] });
  }

  res.status(200).json({ received: true });
});




// SUCCESS route
export const orderSuccess = catchError(async (req, res, next) => {
  const { orderId } = req.query;
  const order = await orderModel.findById(orderId).populate("products.productId");

  if (!order) return next(new AppError("Order not found", 404));

  res.status(200).json({
    message: "Payment successful",
    order,
  });
});

// CANCEL route
export const orderCancel = catchError(async (req, res, next) => {
  const { orderId } = req.query;
  res.status(200).json({
    message: "Payment canceled by user",
    orderId,
  });
});


export const getAllOrders = catchError(async (req,res,next) => {
  const orders = await orderModel.find().populate("userId", "name email").populate("products.productId", "name price");
  res.status(200).json({message: "success", orders});
})


export const updateOrderStatus = catchError(async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const order = await orderModel.findById(orderId);
  if (!order) return next(new AppError("Order not found", 404));
  order.orderStatus = status;
  await order.save();
  res.status(200).json({ message: "Order status updated successfully", order });
})

export const deleteOrder = catchError(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await orderModel.findById(orderId); 
  if (!order) return next(new AppError("Order not found", 404));
  await orderModel.findByIdAndDelete(orderId);
  res.status(200).json({ message: "Order deleted successfully" });
})