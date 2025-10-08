import express from "express";
import { protectedRoutes } from "../auth/auth.controller.js";
import {
  addToCart,
  updateQuantity,
  removeItemFromCart,
  clearUserCart,
  getLoggedUserCart,
  getAllCarts,
  deleteCart
} from "./cart.controller.js";

const router = express.Router();

router.post("/api/cart", protectedRoutes, addToCart);
router.get("/api/cart", protectedRoutes, getLoggedUserCart);
router.patch("/api/cart/:id", protectedRoutes, updateQuantity);
router.delete("/api/cart/:id", protectedRoutes, removeItemFromCart);
router.delete("/api/cart", protectedRoutes, clearUserCart);
router.get("/api/carts", protectedRoutes, getAllCarts);
router.delete("/api/carts/:id", protectedRoutes, deleteCart);
export default router;