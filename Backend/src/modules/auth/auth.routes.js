import express from "express";
import { 
    login, 
    signup, 
    confirmEmail, 
    logout, 
    getCurrentUser ,
    getAllusers
} from "./auth.controller.js";
import { protectedRoutes } from "./auth.controller.js";
import { signupSchema, loginSchema } from "./auth.validation.js";
import { validationMiddleware } from "../../Middleware/validate.js";

const authRouter = express.Router();

// Public routes
authRouter.post("/api/signup", validationMiddleware({ body: signupSchema }), signup);
authRouter.post("/api/signin",validationMiddleware(loginSchema), login);
authRouter.get("/api/confirm/:token", confirmEmail);

// Protected routes // Apply authentication middleware
authRouter.post("/api/logout",protectedRoutes, logout);
authRouter.get("/api/me", protectedRoutes,getCurrentUser);
authRouter.get("/api/users", protectedRoutes, getAllusers);
export default authRouter;