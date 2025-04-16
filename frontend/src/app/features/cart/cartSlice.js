import { createSlice } from '@reduxjs/toolkit';
import { fetchCart, addToCart, removeFromCart, updateCartItem } from '../../api/cartAPI';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { 
    cartItems: [],
    status: 'idle',
    error: null,
    isLoading: false,
   },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoading = false;
        state.cartItems = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoading = false;
        const existingItem = state.cartItems?.find(item => item?.productId === action.payload?.productId);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.cartItems = Array.isArray(state.cartItems) ? [...state.cartItems, action.payload] : [action.payload];
        }
      })
      .addCase(removeFromCart.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.cartItems?.findIndex(item => item?.productId === action.payload?.productId);
        if (index !== -1) {
          state.cartItems[index] = action?.payload;
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoading = false;
        state.cartItems = Array?.isArray(state?.cartItems) ? state.cartItems?.filter(item => item?.productId !== action.payload) : [];
      });
  }
});
export const { clearCart } = cartSlice?.actions;
export const selectCartItems = (state) => state?.cart;
export const selectCartTotal = (state) => 
  Array?.isArray(state?.cart?.cartItems) 
    ? state.cart?.cartItems?.reduce((total, item) => total + (item?.price * item?.quantity), 0)
    : 0;
export const selectCartItemCount = (state) => 
  Array?.isArray(state.cart?.cartItems) 
    ? state.cart?.cartItems?.reduce((count, item) => count + item?.quantity, 0)
    : 0;

export default cartSlice.reducer;
