import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetail: null,
};

export const getAllOrderForAdmin = createAsyncThunk(
  "/order/getAllOrderByUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/order/get`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const getOrderDetailForAdmin = createAsyncThunk(
  "/order/getOrderDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/order/details/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderstatus }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/order/update/${id}`,
        {
          orderstatus,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);
const AdminOrderSlice = createSlice({
  name: "AdminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetail: (state) => {
      state.orderDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrderForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrderForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrderForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetailForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetail = action.payload.data;
      })
      .addCase(getOrderDetailForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = null;
      });
  },
});

export const { resetOrderDetail } = AdminOrderSlice.actions;
export default AdminOrderSlice.reducer;
