import Joi  from "joi";

const addCategoryValidation = Joi.object({
  name: Joi.string().trim().min(2).max(60).required(),
  image: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required(),
    size: Joi.number().max(5 * 1024 * 1024).required(), // max 5MB
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required()
  }).required(),
  description: Joi.string().trim().min(2).max(300).required()
});

const updateCategoryValidation = Joi.object({
  name: Joi.string().trim().min(2).max(60).optional(),
  image: Joi.object().optional(),
  description: Joi.string().trim().max(300).optional()
}).unknown(true); // ✅ يسمح بأي حقول اضافية بدون error

export { addCategoryValidation, updateCategoryValidation };