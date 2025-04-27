import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice/index";
import adminProductSlice from "./admin/product";
import shoppingProductSlice from "./shop/product-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProduct: adminProductSlice,
    shoppingProduct: shoppingProductSlice,
  },
});

export default store;
