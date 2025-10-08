export const validateEmailOrPhone = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  return emailRegex.test(value) || phoneRegex.test(value);
};

export const validateAdminCredentials = (email, password) => {
  const errors = {};
  if (!email || email.trim() === '') errors.email = 'Email is required';
  else if (!validateEmailOrPhone(email)) errors.email = 'Invalid email format';
  if (!password || password.trim() === '') errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
  return errors;
};

export const validateProduct = (product) => {
  if (!product.name || product.name.trim() === '') return 'Product name is required';
  if (!product.price || isNaN(product.price) || product.price <= 0) return 'Valid price is required';
  return null;
};

export const validateCategory = (category) => {
  if (!category.name || category.name.trim() === '') return 'Category name is required';
  return null;
};