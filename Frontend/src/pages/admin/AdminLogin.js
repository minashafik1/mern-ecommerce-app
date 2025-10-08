import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert ,CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginAdminStart, loginAdminSuccess, loginAdminFailure } from '../../redux/slices/admin/adminAuthSlice';
import { loginUser } from '../../services/adminApi';
import { validateAdminCredentials } from '../../utils/validationAdmin';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.adminAuth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const validationErrors = validateAdminCredentials(formData.email, formData.password);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    dispatch(loginAdminStart());
    try {
      const credentials = { email: formData.email, password: formData.password };
      const response = await loginUser(credentials);
      console.log('API Response:', response); // إضافة log عشان نشوف الـ response
      if (response.message === 'Login successful' && response.user.role === 'admin') {
        localStorage.setItem('adminToken', response.token); // حفظ الـ token في localStorage
        dispatch(loginAdminSuccess({
          email: response.user.email,
          token: response.token,
          role: response.user.role,
        }));
        navigate('/admin/dashboard');
      } else {
        throw new Error('Only admins can log in to this panel');
      }
    } catch (err) {
      console.log('API Error:', err); // إضافة log عشان نشوف الـ error
      dispatch(loginAdminFailure(err.response?.data?.message || 'Invalid email or password'));
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f4f8',
        padding: { xs: 2, sm: 3 },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: { xs: '90%', sm: '70%', md: '50%' },
          padding: { xs: 2, sm: 3 },
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: '#1e1e1e',
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          Admin Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: { xs: 1.5, sm: 2 }, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            {error}
          </Alert>
        )}
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          error={!!errors.email}
          helperText={errors.email}
          sx={{ mb: 2, '& .MuiInputBase-root': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
          error={!!errors.password}
          helperText={errors.password}
          sx={{ mb: 2, '& .MuiInputBase-root': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          disabled={loading}
          sx={{
            mt: 2,
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            borderRadius: '8px',
            backgroundColor: '#4a90e2',
            '&:hover': { backgroundColor: '#357abd' },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
        </Button>
      </Box>
    </Box>
  );
};

export default AdminLogin;