import express from "express";
import { updateProfile } from "./user.controller.js";
import { protectedRoutes } from "../auth/auth.controller.js";
import { validationMiddleware } from "../../Middleware/validate.js";
import { updateProfileSchema } from "./user.validation.js";

const router = express.Router();

router.put("/api/user/updateProfile", protectedRoutes, validationMiddleware(updateProfileSchema), updateProfile);

export default router;
