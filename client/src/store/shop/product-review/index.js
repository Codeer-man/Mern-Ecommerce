import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  review: [],
  userReview: null,
};

export const createProductReview = createAsyncThunk(
  "/createProductReview",
  async (
    { productId, userId, userName, reviewMessage, reviewValue },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/product/review/create",
        { productId, userId, userName, reviewMessage, reviewValue },
        { withCredentials: true }
      );
      console.log(response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response.data);
    }
  }
);

export const getProductReview = createAsyncThunk(
  "/getProductReview",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/product/review/get/${productId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const userReviewfetch = createAsyncThunk(
  "/user/review",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/product/review/${productId}/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.message);
    }
  }
);

const ProductReviewSlice = createSlice({
  name: "Product",
  initialState,
  reducers: {
    resetReview: (state) => {
      state.review = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createProductReview.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createProductReview.fulfilled, (state, action) => {
      state.isLoading = false;
      state.review = action.payload?.data;
    });
    builder
      .addCase(createProductReview.rejected, (state, action) => {
        state.isLoading = false;
        state.review = action.payload?.data;
      })
      .addCase(getProductReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.review = action.payload.data;
      })
      .addCase(userReviewfetch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userReviewfetch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userReview = action.payload.data;
      })
      .addCase(userReviewfetch.rejected, (state) => {
        {
          state.isLoading = false;
          state.userReview = null;
        }
      });
  },
});

export const { resetReview } = ProductReviewSlice.actions;
export default ProductReviewSlice.reducer;
