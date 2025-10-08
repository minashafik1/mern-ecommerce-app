import { configureStore } from '@reduxjs/toolkit';
import CombineReducers from './slices/CombineReducers';

const store = configureStore({
  reducer: CombineReducers,
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

export default store;