// src/redux/slices/admin/adminCategorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategories, addCategory, updateCategory, deleteCategory } from "../../../services/adminApi";

// ============================ ASYNC THUNKS ============================

// Fetch all categories
export const fetchCategoriesAsync = createAsyncThunk(
  "adminCategory/fetchCategories",
  async () => {
    const response = await getCategories();
    return response.categories || response; // handle API shape
  }
);

// Add new category
export const createCategoryAsync = createAsyncThunk(
  "adminCategory/createCategory",
  async (categoryData) => {
    const response = await addCategory(categoryData);
    return response.category; 
  }
);

// Update category
export const updateCategoryAsync = createAsyncThunk(
  "adminCategory/updateCategory",
  async ({ categoryId, categoryData }) => {
    const response = await updateCategory(categoryId, categoryData);
    return response.category;
  }
);

// Delete category
export const deleteCategoryAsync = createAsyncThunk(
  "adminCategory/deleteCategory",
  async (categoryId) => {
    await deleteCategory(categoryId);
    return categoryId;
  }
);

// ============================ SLICE ============================
const adminCategorySlice = createSlice({
  name: "adminCategory",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // CREATE
      .addCase(createCategoryAsync.fulfilled, (state, action) => {
        if (action.payload) state.categories.push(action.payload);
      })
      // UPDATE
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        if (!action.payload || !action.payload._id) return;
        const index = state.categories.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.categories[index] = action.payload;
      })
      // DELETE
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c._id !== action.payload);
      });
  },
});

export default adminCategorySlice.reducer;
