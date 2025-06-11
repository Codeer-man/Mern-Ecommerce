import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  offer: null,
  isLoading: false,
};

export const createOffer = createAsyncThunk(
  "create/offer",
  async ({ formdata, image, productId }, { rejectWithValue }) => {
    console.log(formdata, image, productId, "index");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/admin/offer/create",
        { ...formdata, image, productId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response);
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
          console.log(action);
          state.isLoading = false;
          state.offer = action.payload.data;
        }
      });
  },
});

export default offerSlice.reducer;
