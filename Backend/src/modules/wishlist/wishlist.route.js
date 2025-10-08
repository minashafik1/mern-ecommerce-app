import express from "express";
import { protectedRoutes } from "../auth/auth.controller.js";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "./wishlist.controller.js";

const router = express.Router();

router.get("/api/wishlist", protectedRoutes, getWishlist);
router.post("/api/wishlist", protectedRoutes, addToWishlist);
router.delete("/api/wishlist/:productId", protectedRoutes, removeFromWishlist);

export default router;
