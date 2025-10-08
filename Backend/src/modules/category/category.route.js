import express from 'express';
import { createCategory, deleteCategory, getAllCategories, getCategory, updateCategory , deleteCategory2} from './category.controller.js';
import { validationMiddleware } from '../../Middleware/validate.js';
import { addCategoryValidation, updateCategoryValidation } from './category.validation.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';


const categoryRouter = express.Router();
categoryRouter.post('/api/categories',protectedRoutes,allowedTo('admin'),validationMiddleware(addCategoryValidation), createCategory);
categoryRouter.get('/api/categories', getAllCategories);
categoryRouter.get('/api/categories/:id', protectedRoutes, getCategory);
categoryRouter.put('/api/categories/:id',protectedRoutes,allowedTo('admin'), validationMiddleware(updateCategoryValidation), updateCategory);
// categoryRouter.delete('/api/categories/:id',protectedRoutes,allowedTo('admin'), deleteCategory);
categoryRouter.delete('/api/categories/:id',protectedRoutes,allowedTo('admin'), deleteCategory2);


export default categoryRouter;