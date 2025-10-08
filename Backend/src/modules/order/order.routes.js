import express from "express";
import { protectedRoutes } from "../auth/auth.controller.js";
import { createOrder, orderCancel, orderSuccess,getAllOrders ,deleteOrder,updateOrderStatus} from "./order.controllers.js";

const orderRouter = express.Router();

orderRouter.post("/api/orders", protectedRoutes, createOrder);

orderRouter.get("/api/orders/success", orderSuccess);
orderRouter.get("/api/orders/cancel",  orderCancel);
orderRouter.get("/api/orders", protectedRoutes, getAllOrders);

orderRouter.patch("/api/orders/:orderId", protectedRoutes, updateOrderStatus);
orderRouter.delete("/api/orders/:orderId", protectedRoutes, deleteOrder);
export default orderRouter;