import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createOrder, orderSuccess, orderCancel } from "../../services/api";

// Create Order
export const createOrderAsync = createAsyncThunk(
  "orders/create",
  async (orderData, { rejectWithValue }) => {
    try {
      return await createOrder(orderData);
    } catch (err) {
      return rejectWithValue(err.message || "Order failed");
    }
  }
);

// Success
export const fetchOrderSuccessAsync = createAsyncThunk(
  "orders/success",
  async (orderId, { rejectWithValue }) => {
    try {
      return await orderSuccess(orderId);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch order success");
    }
  }
);

// Cancel
export const fetchOrderCancelAsync = createAsyncThunk(
  "orders/cancel",
  async (orderId, { rejectWithValue }) => {
    try {
      return await orderCancel(orderId);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch order cancel");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    currentOrder: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetOrder: (state) => {
      state.currentOrder = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // create order
      .addCase(createOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
        state.success = true;

        // If Stripe session → redirect
        if (action.payload.sessionUrl) {
          window.location.href = action.payload.sessionUrl;
        }
      })
      .addCase(createOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // success
      .addCase(fetchOrderSuccessAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
        state.success = true;
      })

      // cancel
      .addCase(fetchOrderCancelAsync.fulfilled, (state) => {
        state.loading = false;
        state.currentOrder = null;
        state.success = false;
      });
  },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
