import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  approveUrl: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetail: null,
};

export const createNewOrder = createAsyncThunk(
  "/create/createNewOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/shop/order/payWithEsewa",
        orderData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const capturePayment = createAsyncThunk(
  "/capture/capturePayment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/shop/order/complete-payment?data=${data}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);
export const getAllOrderByUser = createAsyncThunk(
  "/order/getAllOrderByUser",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/shop/order/list/${orderId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);
export const getOrderDetail = createAsyncThunk(
  "/order/getOrderDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/shop/order/detail/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

export const cashOndelivery = createAsyncThunk(
  "/cashOn/payment",
  async (
    { cartId, deliveryCharge, totalPrice, addressId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/shop/order/cash_on_delivbery",
        {
          cartId,
          deliveryCharge,
          totalPrice,
          addressId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  }
);

const orderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetail: (state) => {
      state.orderDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approveUrl = action.payload.approve_Url;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approveUrl = null;
        state.orderId = null;
      })
      .addCase(getAllOrderByUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrderByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrderByUser.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetail = action.payload.data;
      })
      .addCase(getOrderDetail.rejected, (state) => {
        state.isLoading = false;
        state.orderList = null;
      });
  },
});
export const { resetOrderDetail } = orderSlice.actions;
export default orderSlice.reducer;
