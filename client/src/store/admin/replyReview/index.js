import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviewList: [],
  isLoading: false,
};

export const getReview = createAsyncThunk(
  "/getReview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/review/get/all"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.message?.error);
    }
  }
);
export const replyProduct = createAsyncThunk(
  "/replyReview",
  async ({ id, reply }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/admin/review/update/${id}`,
        { reply },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.message?.error);
    }
  }
);
export const deleteReply = createAsyncThunk(
  "/deleteReplyReview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios();
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.message?.error);
    }
  }
);

const reviewReplySlice = createSlice({
  name: "reviewReply",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviewList = action.payload.data;
      })
      .addCase(getReview.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default reviewReplySlice.reducer;
