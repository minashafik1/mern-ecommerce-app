import express from "express";
import {getAllProducts, getCategoryProducts, getOneProduct, addProduct, updateProduct, deleteProduct ,searchProducts, getProducts} from "../product/product.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import productModel from "../../../database/models/product.model.js";
import { paginatedResults } from "../../Middleware/paginatedResults.js";
import { paginatedCategoryProducts } from "../../Middleware/paginatedCategoryProducts.js";
import { validationMiddleware } from "../../Middleware/validate.js";
import productValidationSchema from '../product/product.valdition.js'
import { myMulterCloud } from "../../../utils/multer.js";
import { validationObject } from "../../../utils/multer.js";

const productRouter = express.Router();

productRouter.get("/api/products", paginatedResults(productModel), getAllProducts);
productRouter.get('/api/productss',getProducts)
productRouter.get("/api/products/:categoryId", paginatedCategoryProducts, getCategoryProducts);
productRouter.get("/api/products/product/:productId", getOneProduct);
productRouter.post("/api/products/searchProduct", searchProducts);

// productRouter.post("/api/products/:categoryId",protectedRoutes , allowedTo("admin"), validationMiddleware(productValidationSchema), upload.single("image"), addProduct);
// productRouter.put("/api/products/:productId", protectedRoutes, allowedTo("admin"), validationMiddleware(productValidationSchema), updateProduct);
// productRouter.delete("/api/products/:productId", protectedRoutes, allowedTo("admin"), deleteProduct);
// productRouter.use(multerErrorHandler);



productRouter.post("/api/products/:categoryId", protectedRoutes, allowedTo("admin"), validationMiddleware(productValidationSchema), myMulterCloud({customValidtion:validationObject.image}).array("Photo",2), addProduct);
productRouter.put("/api/products/:productId", protectedRoutes, allowedTo("admin"), validationMiddleware(productValidationSchema), myMulterCloud({customValidtion:validationObject.image}).array("Photo",2), updateProduct);
productRouter.delete("/api/products/:productId", protectedRoutes, allowedTo("admin"), deleteProduct);


export default productRouter;