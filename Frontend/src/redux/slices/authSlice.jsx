import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  token: localStorage.getItem('token') || null,
  user: null,
  loading: false,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token); 
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      state.success = false;
      
      localStorage.clear();
      
      window.location.reload();
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  resetSuccess,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
