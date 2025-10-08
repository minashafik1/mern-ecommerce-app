import Joi from "joi";

export const createOrderValidation = Joi.object({
  products: Joi.array().items(
    Joi.object({
      productId: Joi.string().length(24).required(),
      quantity: Joi.number().integer().min(1).required(),
    })
  ).min(1).required(),
  paymentMethod: Joi.string().valid("cash", "card").required(),
});