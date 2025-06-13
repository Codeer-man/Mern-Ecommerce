import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  pageProductList: [],
};

export const addNewProduct = createAsyncThunk(
  "/product/addNewProduct",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/admin/product/add",
        formdata,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || {
          message: "Failed to add new Product",
        }
      );
    }
  }
);
export const fetchAllProduct = createAsyncThunk(
  "/product/fetchProduct",
  async ({ page = 1, limit = 6 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/product/getProdct?page=${page}&limit=${limit}`
      );

      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || {
          message: "No Oeiduct fund",
        }
      );
    }
  }
);
export const editProduct = createAsyncThunk(
  "/product/editProduct",
  async ({ formdata, id }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/admin/product/edit/${id}`,
        formdata,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error.response || { message: "Failed to add new Product" }
      );
    }
  }
);
export const deleteProduct = createAsyncThunk(
  "/product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/admin/product/delete/${id}`
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(
        error.response || { message: "Failed to add new Product" }
      );
    }
  }
);

export const updateLabel = createAsyncThunk(
  "product/updateLabel",
  async ({ id, list }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/admin/product/update/${id}/label`,
        { list },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update label"
      );
    }
  }
);

const AdminProductSlice = createSlice({
  name: "adminProductSlice",
  initialState,
  reducers: { setUser: (state, action) => {} },
  extraReducers: (builder) =>
    builder
      .addCase(fetchAllProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data || [];
        state.pageProductList = action.payload;
      })
      .addCase(fetchAllProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload?.error;
      })
      .addCase(updateLabel.fulfilled, (state, action) => {
        const updatedProduct = action.payload.product;
        const index = state.productList.findIndex(
          (p) => p._id === updatedProduct._id
        );
        if (index !== -1) {
          state.productList[index] = updatedProduct;
        }
      }),
});

export const { setUser } = AdminProductSlice.actions;
export default AdminProductSlice.reducer;
