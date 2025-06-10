import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  cartItem: [],
};

export const addToCart = createAsyncThunk(
  "/cart/addProduct",
  async ({ userId, ProductId, quantity, size }, { rejectWithValue }) => {
    try {

      const response = await axios.post(
        "http://localhost:8080/api/cart/add",
        { userId, ProductId, quantity, size },
        {
          withCredentials: true,
        }
      );
      console.log(response, "index");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Problem in the slice add to Product"
      );
    }
  }
);

export const fetchUserItems = createAsyncThunk(
  "/cart/fetchProduct",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/cart/get/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Problem in the slice add to Product"
      );
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "/cart/deleteProduct",
  async ({ userId, ProductId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/cart/delete/${userId}/Product/${ProductId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Problem in the slice add to Product"
      );
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "/cart/updateProduct",
  async ({ userId, ProductId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        "http://localhost:8080/api/cart/update-cart",
        { userId, ProductId, quantity }
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Problem in the slice add to Product"
      );
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shopCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder //add product
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItem = action.payload;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItem = [];
      }) //get Product
      .addCase(fetchUserItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItem = action.payload.data;
      })
      .addCase(fetchUserItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItem = [];
      }) //delete items
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItem = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItem = [];
      }) // update
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItem = action.payload;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItem = [];
      });
  },
});

export default shoppingCartSlice.reducer;
