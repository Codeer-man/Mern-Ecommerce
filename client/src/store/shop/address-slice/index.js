import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  address: [],
};

export const createAddress = createAsyncThunk(
  "/api/createAddress",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/shop/address/add",
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const fetchAddress = createAsyncThunk(
  "/api/fetchAddress",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/shop/address/get/${userId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "/api/deleteAddress",
  async ({ userId, addressId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/shop/address/delete/${addressId}/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const updadateAddress = createAsyncThunk(
  "/api/updateAddress",
  async ({ userId, addressId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/shop/address/update/${addressId}/${userId}`,
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder //create address
      .addCase(createAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAddress.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createAddress.rejected, (state) => {
        state.isLoading = false;
      }) //fetch address
      .addCase(fetchAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.address = action.payload.data;
      })
      .addCase(fetchAddress.rejected, (state) => {
        state.isLoading = false;
        state.address = [];
      });
  },
});

export default addressSlice.reducer;
