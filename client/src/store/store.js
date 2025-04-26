import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice/index";
import adminProductSlice from "./admin/product";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProduct: adminProductSlice,
  },
});

export default store;
