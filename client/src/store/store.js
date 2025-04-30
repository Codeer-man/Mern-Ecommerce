import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice/index";
import adminProductSlice from "./admin/product";
import shoppingProductSlice from "./shop/product-slice";
import shoppingCartSlice from "./shop/cart-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProduct: adminProductSlice,
    shoppingProduct: shoppingProductSlice,
    shopCart: shoppingCartSlice,
  },
});

export default store;
