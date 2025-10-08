


import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Link, Alert, CircularProgress } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerStart, registerSuccess, registerFailure } from '../../redux/slices/authSlice';
import { registerUser } from '../../services/api';
import { validateEmailOrPhone, validatePassword, validateName, validateUsername, validateAge } from '../../utils/validation';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', name: '', username: '', password: '', age: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const currentLang = useSelector((state) => state.myLang.lang);
  const myContent = useSelector((state) => state.myLang.content).registerPage;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = myContent.emailRequired;
    else if (!validateEmailOrPhone(formData.email)) newErrors.email = myContent.invalidEmail;
    if (!validateName(formData.name)) newErrors.name = myContent.invalidName;
    if (!validateUsername(formData.username)) newErrors.username = myContent.invalidUsername;
    if (!formData.password) newErrors.password = myContent.passwordRequired;
    else if (!validatePassword(formData.password)) newErrors.password = myContent.invalidPassword;
    if (!validateAge(formData.age)) newErrors.age = myContent.invalidAge;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(registerStart());
    try {
      await registerUser(formData);
      dispatch(registerSuccess());
    } catch (err) {
      dispatch(registerFailure(err.response?.data?.message || myContent.registrationFailed));
    }
  };

  const handleGoToLogin = () => navigate('/login');

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
          {myContent.register}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!success ? (
          <>
            <TextField
              fullWidth
              label={myContent.email}
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={myContent.name}
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              error={!!errors.name}
              helperText={errors.name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={myContent.username}
              name="username"
              value={formData.username}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              error={!!errors.username}
              helperText={errors.username}
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
            <TextField
              fullWidth
              label={myContent.age}
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              variant="outlined"
              margin="normal"
              error={!!errors.age}
              helperText={errors.age}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : myContent.register}
            </Button>
          </>
        ) : (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>
              {myContent.confirmationEmail} {formData.email}.
            </Alert>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleGoToLogin}
              sx={{ mt: 2, py: 1.5 }}
            >
              {myContent.goToLogin}
            </Button>
          </>
        )}

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            {myContent.alreadyHaveAccount}{' '}
            <Link component={RouterLink} to="/login" color="primary">
              {myContent.login}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
