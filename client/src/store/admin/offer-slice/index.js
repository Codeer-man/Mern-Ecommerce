import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  offer: null,
  isLoading: false,
};

export const createOffer = createAsyncThunk(
  "create/offer",
  async ({ formdata, image, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/offer/create`,
        { ...formdata, image, productId },
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
        error?.response?.data?.message ||
          "Error while creating offer or invalid server error"
      );
    }
  }
);

const offerSlice = createSlice({
  name: "Offer-Slice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOffer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        {
          state.isLoading = false;
          state.offer = action.payload.data;
        }
      });
  },
});

export default offerSlice.reducer;
