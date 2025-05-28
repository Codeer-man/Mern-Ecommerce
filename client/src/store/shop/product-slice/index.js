import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  products: [],
  productDetail: null,
};

export const getShopProduct = createAsyncThunk(
  "/shop/product",
  async (
    { filterParams = {}, sortParams = "createdAt", page = 1, limit = 12 } = {},
    thunkAPI
  ) => {
    try {
      const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams,
      });

      const result = await axios.get(
        `http://localhost:8080/api/shop/product/filteredProduct?${query}&page=${page}&limit=${limit}`
      );

      return result.data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getSingleProduct = createAsyncThunk(
  "/product/detail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/shop/product/productData/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message || "Product not found");
    }
  }
);

const ShopProductSlicer = createSlice({
  name: "shoppingProduct",
  initialState,
  reducers: {
    setProductDetail: (state) => {
      state.productDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getShopProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getShopProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(getShopProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.products = [];
      }) //single Product
      .addCase(getSingleProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetail = action.payload.data;
      })
      .addCase(getSingleProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetail = null;
      });
  },
});
export const { setProductDetail } = ShopProductSlicer.actions;
export default ShopProductSlicer.reducer;
