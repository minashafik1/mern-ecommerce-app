import Joi from "joi";
// ================================================ Signup Schema ==================================================
export const signupSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  username: Joi.string().alphanum().min(3).max(20).required()
    .messages({ "string.alphanum": "Username must only contain letters and numbers" }),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$"))
    .required()
    .messages({
      "string.pattern.base": "Password must contain uppercase, lowercase, number and be at least 6 chars long"
    }),
  age: Joi.number().min(12).max(100).required()
});

// ================================================ Login Schema ==================================================
export const loginSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({ "string.email": "Please enter a valid email" }),
  password: Joi.string().min(6).required()
    .messages({ "string.min": "Password must be at least 6 characters long" })
});
