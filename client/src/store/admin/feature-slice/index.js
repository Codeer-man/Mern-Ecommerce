import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImage: [],
};

export const addFeatuerImage = createAsyncThunk(
  "/feature/image/add",
  async (image, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/admin/feature/post",
        { image }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getFeatuerImage = createAsyncThunk(
  "/feature/image/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/feature/get"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const featureSlice = createSlice({
  name: "feature",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addFeatuerImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addFeatuerImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImage = action.payload.data;
      })
      .addCase(addFeatuerImage.rejected, (state) => {
        state.isLoading = false;
        state.featureImage = [];
      })
      .addCase(getFeatuerImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImage = action.payload.data;
      });
  },
});

export default featureSlice.reducer;
