import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchTerm: "",
  selectedCategory: "",
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
  },
});

export const { setSearchTerm, setSelectedCategory, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
