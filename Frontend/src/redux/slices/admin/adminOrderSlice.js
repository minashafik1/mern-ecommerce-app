import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getOrders, updateOrderStatus, deleteOrder } from "../../../services/adminApi";

// fetch all orders
export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const response = await getOrders();
  return response?.orders || []; // fallback if response.orders is undefined
});

// update order status
export const changeOrderStatus = createAsyncThunk(
  "orders/changeOrderStatus",
  async ({ orderId, status }) => {
    const response = await updateOrderStatus(orderId, status);
    return response?.order || null; // fallback in case response.order is missing
  }
);

// delete order
export const removeOrder = createAsyncThunk("orders/removeOrder", async (orderId) => {
  await deleteOrder(orderId);
  return orderId;
});

const adminOrderSlice = createSlice({
  name: "orders",
  initialState: { 
    orders: [], // make sure it's always an array
    loading: false, 
    error: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to fetch orders";
      })

      // update order
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        if (!action.payload) return; // safety check
        const index = state.orders.findIndex((o) => o?._id === action.payload?._id);
        if (index !== -1) state.orders[index] = action.payload;
      })

      // remove order
      .addCase(removeOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o?._id !== action.payload);
      });
  },
});

export default adminOrderSlice.reducer;
