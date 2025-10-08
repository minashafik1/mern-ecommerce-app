
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import { loginUser } from '../../services/api';
import { validateEmailOrPhone } from '../../utils/validation';
import { fetchWishlist } from '../../redux/slices/wishlistSlice'; 

const Login = () => {
  const [formData, setFormData] = useState({ emailOrPhone: '', password: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const currentLang = useSelector((state) => state.myLang.lang);
  const myContent = useSelector((state) => state.myLang.content).loginPage;
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.emailOrPhone) newErrors.emailOrPhone = myContent.emailOrPhoneRequired;
    else if (!validateEmailOrPhone(formData.emailOrPhone))
      newErrors.emailOrPhone = myContent.invalidEmailOrPhone;

    if (!formData.password) newErrors.password = myContent.passwordRequired;
    else if (formData.password.length < 6)
      newErrors.password = myContent.passwordMinLength;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(loginStart());
    try {
      const response = await loginUser({
        email: formData.emailOrPhone,
        password: formData.password,
      });

    
      dispatch(loginSuccess(response));

      
      dispatch(fetchWishlist());

      
      navigate('/home');
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || myContent.loginFailed));
    }
  };

  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f4f8',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '50%',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          direction: currentLang === 'ar' ? 'rtl' : 'ltr',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          {myContent.login}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth
          label={myContent.emailOrPhone}
          name="emailOrPhone"
          value={formData.emailOrPhone}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          error={!!errors.emailOrPhone}
          helperText={errors.emailOrPhone}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label={myContent.password}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          error={!!errors.password}
          helperText={errors.password}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          color="error"
          fullWidth
          type="submit"
          disabled={loading}
          sx={{ mt: 2, py: 1.5 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : myContent.login}
        </Button>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            {myContent.dontHaveAccount}{' '}
            <Link component={RouterLink} to="/register" color="primary">
              {myContent.register}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
