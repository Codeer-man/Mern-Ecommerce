import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import Login from "./pages/auth/login";
import Register from "./pages/auth/Register";
import ShoppingLayout from "./components/shopping/layout";
import AdminLayout from "./components/admin/layout";
import AdmindashboardLayout from "./pages/admin/dashboard";
import AdminOrders from "./pages/admin/orders";
import Adminproduct from "./pages/admin/product";
import NotFound from "./pages/not-found";
import ShoppingAccount from "./pages/shopping/account";
import ShoppingListing from "./pages/shopping/listing";
import ShoppingCheckout from "./pages/shopping/checkout";
import ShoppingHome from "./pages/shopping/home";
import CheckAuth from "./components/common/check-auth";
import Unauth from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { checkauth } from "./store/authslice";
import { Skeleton } from "./components/ui/skeleton";
import PaypalReturn from "./pages/shopping/paypal-return";
import PaymentSuccess from "./components/shopping/payment-success";
import SearchProduct from "./pages/shopping/searhc";
import ImageUploadDashBaord from "./pages/admin/ImageUpload";
import Advertisement from "./pages/admin/Advertisement";
import AdsForShowing from "./components/Advertisement/ads";
import AdminReview from "./pages/admin/Review";
import VerifyEmail from "./pages/auth/verifyEmail";
import ProductDetail from "./pages/shopping/Product-detail";

export default function App() {
  const { isLoading, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkauth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="w-[800px] h-[600px]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {user?.role === "user" && <AdsForShowing />}
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        {/* auth  */}
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        {/* admin  */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdmindashboardLayout />} />
          <Route path="imageUpload" element={<ImageUploadDashBaord />} />
          <Route path="ads" element={<Advertisement />} />
          <Route path="order" element={<AdminOrders />} />
          <Route path="product" element={<Adminproduct />} />
          <Route path="review" element={<AdminReview />} />
        </Route>
        {/* shopping  */}
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="paypal-return" element={<PaypalReturn />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="product-detail/:id" element={<ProductDetail />} />
          <Route path="search" element={<SearchProduct />} />
        </Route>
        <Route
          path="/verify/email"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <VerifyEmail />
            </CheckAuth>
          }
        />

        <Route path="/unauth-page" element={<Unauth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
