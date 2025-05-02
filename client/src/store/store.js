import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice/index";
import adminProductSlice from "./admin/product";
import shoppingProductSlice from "./shop/product-slice";
import shoppingCartSlice from "./shop/cart-slice";
import addressSlice from "./shop/address-slice/";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProduct: adminProductSlice,
    shoppingProduct: shoppingProductSlice,
    shopCart: shoppingCartSlice,
    shopAddress: addressSlice,
  },
});

export default store;
