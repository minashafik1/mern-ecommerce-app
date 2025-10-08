import Joi from "joi";

const addToCartValidation = {
  body: Joi.object({
    product: Joi.string().hex().length(24).required().messages({
      "any.required": "Product ID is required",
      "string.hex": "Product ID must be a valid ObjectId",
    }),
    quantity: Joi.number().integer().min(1).default(1).messages({
      "number.base": "Quantity must be a number",
      "number.min": "Quantity must be at least 1",
    }),
  }).options({ stripUnknown: true }),
};

const updateQuantityValidation = {
  body: Joi.object({
    quantity: Joi.number().integer().min(1).required().messages({
      "any.required": "Quantity is required",
      "number.min": "Quantity must be at least 1",
    }),
  }).options({ stripUnknown: true })
};

export { addToCartValidation, updateQuantityValidation };
