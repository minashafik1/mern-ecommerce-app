


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "../../services/cartApi";

// Fetch cart
export const fetchCartAsync = createAsyncThunk(
  "cart/fetch",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await getCart(token);
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch cart");
    }
  }
);

// Add item to cart
export const addToCartAsync = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await addToCart(token, productId, quantity);
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add to cart");
    }
  }
);

// Update cart item quantity
export const updateCartItemAsync = createAsyncThunk(
  "cart/update",
  async ({ id, quantity }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await updateCart(token, id, quantity);
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update cart item"
      );
    }
  }
);


// Remove item from cart
export const removeCartItemAsync = createAsyncThunk(
  "cart/remove",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await removeFromCart(token, id);
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove item");
    }
  }
);

// Clear cart
export const clearCartAsync = createAsyncThunk(
  "cart/clear",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await clearCart(token);
      return { cartItems: [], totalCartPrice: 0 };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to clear cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    totalCartPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.cartItems;
        state.totalCartPrice = action.payload.totalCartPrice;
        state.error = null;
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems;
        state.totalCartPrice = action.payload.totalCartPrice;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems;
        state.totalCartPrice = action.payload.totalCartPrice;
      })
      .addCase(removeCartItemAsync.fulfilled, (state, action) => {
        state.cartItems = action.payload.cartItems;
        state.totalCartPrice = action.payload.totalCartPrice;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.cartItems = [];
        state.totalCartPrice = 0;
      });
  },
});

export default cartSlice.reducer;
