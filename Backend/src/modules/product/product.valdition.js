import Joi from "joi";

const productValidationSchema = Joi.object({
  name: Joi.string().trim().min(1).required().messages({
    "string.base": "Name must be a string",
    "string.min": "Name must be at least 1 character long",
    "string.empty": "Name cannot be empty",
    "any.required": "Name is required",
  }),

  description: Joi.string().trim().min(20).required().messages({
    "string.base": "Description must be a string",
    "string.min": "Description must be at least 20 characters long",
    "string.empty": "Description cannot be empty",
    "any.required": "Description is required",
  }),

  price: Joi.number().positive().precision(2).required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be a positive number",
    "number.precision": "Price must have at most 2 decimal places",
    "any.required": "Price is required",
  }),

  quantity: Joi.number().integer().min(0).required().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.min": "Quantity must be at least 0",
    "any.required": "Quantity is required",
  }),

  image: Joi.string().default("images/another-default-product-image.png").messages({
    "string.base": "Image must be a string",
  }),
});

export default productValidationSchema;