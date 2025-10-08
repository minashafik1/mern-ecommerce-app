import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWishlist, addToWishlist, removeFromWishlist } from "../../services/api";

//  Get Wishlist
export const fetchWishlist = createAsyncThunk("wishlist/fetch", async () => {
  const { data } = await getWishlist();
  return data.wishlist;
});

//  Add
export const addProductToWishlist = createAsyncThunk("wishlist/add", async (productId) => {
  const { data } = await addToWishlist(productId);
  return data.wishlist;
});

//  Remove
export const removeProductFromWishlist = createAsyncThunk("wishlist/remove", async (productId) => {
  const { data } = await removeFromWishlist(productId);
  return data.wishlist;
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], loading: false },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload?.products || [];
      })
      .addCase(addProductToWishlist.fulfilled, (state, action) => {
        state.items = action.payload?.products || [];
      })
      .addCase(removeProductFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload?.products || [];
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;


export { addProductToWishlist as addToWishlist };
export { removeProductFromWishlist as removeFromWishlist };

export default wishlistSlice.reducer;
