import { combineReducers } from 'redux';
import authReducer from './authSlice';
import productReducer from './productSlice';
import wishlistReducer from './wishlistSlice';
import cartReducer from './cartSlice'; 
import langSlice from './langSlice'; 
import orderReducer from './orderSlice'; 
import adminDashboardSlice from './admin/adminDashboardSlice';
import adminAuthSlice from './admin/adminAuthSlice';
import adminCategorySlice from './admin/adminCategorySlice';
import adminOrderSlice from './admin/adminOrderSlice';
import adminCartSlice from './admin/adminCartSlice';
const CombineReducers = combineReducers({
  auth: authReducer,
  product : productReducer,
  wishlist : wishlistReducer,
  cart : cartReducer,
  myLang: langSlice,
  orders : orderReducer,
  adminDashboard : adminDashboardSlice,
  adminAuth : adminAuthSlice,
  adminCategory : adminCategorySlice,
  adminOrder : adminOrderSlice,
  adminCart : adminCartSlice,
});

export default CombineReducers;