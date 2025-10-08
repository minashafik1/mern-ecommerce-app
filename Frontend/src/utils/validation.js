export const validateEmailOrPhone = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) 
};

export const validatePassword = (value) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(value);
};

export const validateName = (value) => value && value.length >= 2 && value.length <= 50;
export const validateUsername = (value) => value && value.length >= 3 && value.length <= 20;
export const validateAge = (value) => {
  const age = parseInt(value);
  return !isNaN(age) && age >= 18 && age <= 100;
};