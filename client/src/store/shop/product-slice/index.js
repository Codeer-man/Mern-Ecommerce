import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  products: [],
};

export const getShopProduct = createAsyncThunk(
  "/shop/product",
  async (_, thunkAPI) => {
    try {
      const result = await axios.get(
        "http://localhost:8080/api/shop/product/filteredProduct"
      );
      //   console.log(result);
      return result.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data); // send error to rejected case
    }
  }
);
const ShopProductSlicer = createSlice({
  name: "shoppingProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getShopProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getShopProduct.fulfilled, (state, action) => {
        console.log(action.payload);
        state.isLoading = false;
        state.products = action.payload.data;
      })
      .addCase(getShopProduct.rejected, (state, action) => {
        console.log(action.payload);
        state.isLoading = false;
        state.products = [];
      });
  },
});

export default ShopProductSlicer.reducer;
