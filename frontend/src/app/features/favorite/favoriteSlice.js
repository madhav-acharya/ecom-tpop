import { createSlice } from '@reduxjs/toolkit';
import { addToFavorites, removeFromFavorites, fetchFavorites } from '../../api/favoriteAPI';

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: { 
    favoriteItems: [],
    status: 'idle',
    error: null,
    isLoading: false
   },
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoading = false;
        state.favoriteItems = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addToFavorites.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoading = false;
        if (!state.favoriteItems.find(item => item.productId === action.payload.productId)) {
          state.favoriteItems.push(action.payload);
        }
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed"
        state.error = action.error.message;
      }
      )
      .addCase(removeFromFavorites.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.isLoading = false;
        state.favoriteItems = state.favoriteItems.filter(item => item.productId !== action.payload._id);
      });
  }
});
export const { clearFavorites } = favoriteSlice.actions;
export const selectFavoriteItems = (state) => state.favorites;
export const isProductInFavorites = (state, productId) => 
  state?.favorites?.favoriteItems.some(item => item.productId === productId);
export default favoriteSlice.reducer;
