import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice/index";
import adminProductSlice from "./admin/product";
import shoppingProductSlice from "./shop/product-slice";
import AdminOrderSlice from "./admin/order-slice";
import shoppingCartSlice from "./shop/cart-slice";
import addressSlice from "./shop/address-slice/";
import shoppingOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";
import shopProductReview from "./shop/product-review";
import featureSlice from "./admin/feature-slice";
import advertisementSlice from "./admin/advertisement";
import reviewReplySlice from "./admin/replyReview";

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProduct: adminProductSlice,
    adminOrder: AdminOrderSlice,
    adminAdvertisement: advertisementSlice,
    adminReview: reviewReplySlice,

    featureSlice: featureSlice,
    shoppingProduct: shoppingProductSlice,
    shopCart: shoppingCartSlice,
    shopAddress: addressSlice,
    shopOrder: shoppingOrderSlice,
    shopSearch: shopSearchSlice,
    productReview: shopProductReview,
  },
});

export default store;
