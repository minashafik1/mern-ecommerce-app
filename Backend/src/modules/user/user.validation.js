import Joi from "joi";

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  username: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  age: Joi.number().min(18).max(60)
}).min(1); 