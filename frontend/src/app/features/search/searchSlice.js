import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchTerm: "",
  selectedCategory: "",
  promoDiscount: 0,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearSearch: (state) => {
      state.searchTerm = "";
      state.selectedCategory = "";
    },
    setPromoDiscount: (state, action) => {
      state.promoDiscount = action.payload;
    },
    clearPromoDiscount: (state) => {
      state.promoDiscount = 0;
    },
  },
});

export const { setSearchTerm, setSelectedCategory, clearSearch, setPromoDiscount, clearPromoDiscount } = searchSlice.actions;
export default searchSlice.reducer;
