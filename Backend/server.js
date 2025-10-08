process.on('uncaughtException', (err) => {
  console.error("error in code:", err);
});
import path from 'path';
import express from 'express'
import { dbConnection } from './database/dbConnection.js';
import categoryRouter from './src/modules/category/category.route.js';
import { globalError } from './src/Middleware/globalError.js';
import { AppError } from './utils/appErorr.js';
import productRouter from './src/modules/product/product.route.js';
import cartRouter from './src/modules/cart/cart.route.js';
import userRouter from './src/modules/user/user.route.js';
import authRouter from './src/modules/auth/auth.routes.js';
import orderRouter from './src/modules/order/order.routes.js';
import wishlistRouter from './src/modules/wishlist/wishlist.route.js';
// import webhookRouter from './src/modules/order/webhook.routes.js';
import dotenv from "dotenv";
import { webhookCheckout } from './src/modules/order/order.controllers.js';
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config({ path: path.resolve("./.env") });

const app = express()
const port = 3001
dbConnection

app.post(
  "/api/orders/webhook",
  bodyParser.raw({ type: "application/json" }),
  webhookCheckout
);
app.use(cors());
app.use(express.json());
app.use(userRouter)
app.use(authRouter);
app.use(categoryRouter);
app.use(productRouter);
app.use(cartRouter);
app.use(orderRouter)
app.use(wishlistRouter);

// Handle  errors when route not found
app.use((req, res, next) => {
  next(new AppError(`Route not found ${req.originalUrl}`, 404));
});

app.use(globalError); // Global Error Handler

process.on('unhandledRejection', (err) => {
  console.error("error:", err);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});