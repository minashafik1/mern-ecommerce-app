// src/redux/slices/admin/adminCartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCarts, deleteCartApi } from "../../../services/adminApi";

// Fetch all carts
export const fetchCarts = createAsyncThunk("adminCart/fetchCarts", async (_, { rejectWithValue }) => {
  try {
    const data = await getCarts();
    return data.carts;
  } catch (error) {
    return rejectWithValue(error.message || "Failed to fetch carts");
  }
});

// Delete a cart
export const removeCart = createAsyncThunk("adminCart/removeCart", async (cartId, { rejectWithValue }) => {
  try {
    const data = await deleteCartApi(cartId);
    return cartId;
  } catch (error) {
    return rejectWithValue(error.message || "Failed to delete cart");
  }
});

const adminCartSlice = createSlice({
  name: "adminCart",
  initialState: {
    carts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch carts
      .addCase(fetchCarts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarts.fulfilled, (state, action) => {
        state.loading = false;
        state.carts = action.payload;
      })
      .addCase(fetchCarts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete cart
      .addCase(removeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.carts = state.carts.filter(cart => cart._id !== action.payload);
      })
      .addCase(removeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminCartSlice.reducer;
