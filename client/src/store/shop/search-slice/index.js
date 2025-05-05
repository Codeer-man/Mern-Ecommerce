import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  searchResult: [],
};

export const searchProduct = createAsyncThunk(
  "/search/product",
  async (keyboard, { rejectWithValue }) => {
    try {
      const response = await axios(
        `http://localhost:8080/api/product/search/${keyboard}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

const shopSearchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    resetSearchResult: (state) => {
      state.searchResult = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResult = action.payload.data;
      })
      .addCase(searchProduct.rejected, (state) => {
        state.isLoading = false;
        state.searchResult = [];
      });
  },
});

export const { resetSearchResult } = shopSearchSlice.actions;
export default shopSearchSlice.reducer;
