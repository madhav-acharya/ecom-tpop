import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import favoriteReducer from '../features/favorite/favoriteSlice';
import { productAPI } from '../api/productAPI';
import { categoryAPI } from '../api/categoryAPI';
import { authAPI } from '../api/authAPI';
import { cartAPI } from '../api/cartAPI';
import searchReducer from '../features/search/searchSlice';
import { orderApi } from '../api/orderAPI';
import { reviewApi } from '../api/reviewAPI';
import { adminApi } from '../api/adminAPI';
import { vendorAPI } from '../api/vendorAPI';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    favorites: favoriteReducer,
    search: searchReducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [categoryAPI.reducerPath]: categoryAPI.reducer,
    [cartAPI.reducerPath]: cartAPI.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [vendorAPI.reducerPath]: vendorAPI.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .concat(productAPI.middleware)
    .concat(authAPI.middleware)
    .concat(categoryAPI.middleware)
    .concat(orderApi.middleware)
    .concat(reviewApi.middleware)
    .concat(adminApi.middleware)
    .concat(vendorAPI.middleware)
    .concat(cartAPI.middleware),
});
