import { createSlice } from '@reduxjs/toolkit';

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    isAuthenticated: false,
    email: null,
    token: null,
    role: null,
    loading: false,
    error: null,
  },
  reducers: {
    loginAdminStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginAdminSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    loginAdminFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutAdmin: (state) => {
      state.isAuthenticated = false;
      state.email = null;
      state.token = null;
      state.role = null;
      state.error = null;
    },
  },
});

export const { loginAdminStart, loginAdminSuccess, loginAdminFailure, logoutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;