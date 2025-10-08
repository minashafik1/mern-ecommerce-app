import { createSlice } from '@reduxjs/toolkit';
import { getProducts, getCategories, searchProducts } from '../../services/api';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    categories: [],
    cart: [],
    wishlist: [],
    loading: false,
    error: null,
    searchResults: [], 
  },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
      state.loading = false;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
      state.loading = false;
    },
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.cart.find(item => item._id === product._id);
      if (!existingProduct) {
        state.cart.push({ ...product, quantity: 1 });
      } else {
        existingProduct.quantity += 1;
      }
    },
    addToWishlist: (state, action) => {
      const product = action.payload;
      if (!state.wishlist.find(item => item._id === product._id)) {
        state.wishlist.push(product);
      }
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const fetchProductsAsync = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const products = await getProducts();
    dispatch(setProducts(products));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const fetchCategoriesAsync = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const categories = await getCategories();
    dispatch(setCategories(categories));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// <-- Search thunk
export const searchProductsAsync = (query) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const results = await searchProducts(query);
    dispatch(setSearchResults(results));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const { 
  setProducts, 
  setCategories, 
  addToCart, 
  addToWishlist, 
  setLoading, 
  setError,
  setSearchResults
} = productSlice.actions;

export default productSlice.reducer;
