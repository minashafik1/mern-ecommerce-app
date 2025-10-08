// src/redux/slices/admin/adminDashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProducts,
  getCategories,
  getUsers,
  getCart,
  getOrders,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../../services/adminApi";

// ============================ ASYNC FETCH ============================
export const fetchProducts = createAsyncThunk(
  "adminDashboard/fetchProducts",
  async () => {
    const response = await getProducts();
    console.log("Fetched Products:", response);
    return response;
  }
);

export const fetchCategories = createAsyncThunk(
  "adminDashboard/fetchCategories",
  async () => {
    const response = await getCategories();
    console.log("Fetched Categories:", response);

    return response;
  }
);

export const fetchUsers = createAsyncThunk(
  "adminDashboard/fetchUsers",
  async () => {
    const response = await getUsers();
    console.log("Fetched Users:", response);

    return response;
  }
);

export const fetchCart = createAsyncThunk(
  "adminDashboard/fetchCart",
  async () => {
    const response = await getCart();
    console.log("Fetched Cart:", response);

    return response;
  }
);

export const fetchOrders = createAsyncThunk(
  "adminDashboard/fetchOrders",
  async () => {
    const response = await getOrders();
    console.log("Fetched Orders:", response);

    return response;
  }
);

// ============================ ASYNC CRUD ============================

// CREATE PRODUCT
export const createProduct = createAsyncThunk(
  "adminDashboard/createProduct",
  async ({ productData, categoryId }) => {
    const response = await addProduct(productData, categoryId);
    return response.product; // API returns { product: {...} }
  }
);

// UPDATE PRODUCT
export const updateProductAsync = createAsyncThunk(
  "adminDashboard/updateProduct",
  async ({ productId, productData }) => {
    const response = await updateProduct(productId, productData);
    // Ensure it returns the updated product object
    return response.product || response.data;
  }
);

// DELETE PRODUCT
export const deleteProductAsync = createAsyncThunk(
  "adminDashboard/deleteProduct",
  async (productId) => {
    await deleteProduct(productId);
    return productId;
  }
);

// ============================ SLICE ============================
const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState: {
    products: [],
    categories: [],
    users: [],
    cart: [],
    orders: [],
    activeSection: "products",
    loading: false,
    error: null,
  },
  reducers: {
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== FETCH PRODUCTS =====
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ===== FETCH CATEGORIES =====
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories || [];
      })
      // ===== FETCH USERS =====
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload.users || [];
      })

      // ===== FETCH CART =====
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload.carts || [];
      })

      // ===== FETCH ORDERS =====
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders || [];
      })
      // ===== CRUD PRODUCTS =====
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        if (!action.payload || !action.payload._id) return; // <-- guard

        const index = state.products.findIndex(
          (p) => p._id && p._id === action.payload._id // <-- safe access
        );
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      });
  },
});

export const { setActiveSection } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
