import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import Login from "./pages/auth/login";
import Register from "./pages/auth/Register";

import ShoppingLayout from "./components/shopping/layout";
import AdminLayout from "./components/admin/layout";
import Admindashboard from "./pages/admin/dashboard";
import AdminOrders from "./pages/admin/orders";
import Adminproduct from "./pages/admin/product";
import NotFound from "./pages/not-found";
import ShoppingAccount from "./pages/shopping/account";
import ShoppingListing from "./pages/shopping/listing";
import ShoppingCheckout from "./pages/shopping/checkout";
import ShoppingHome from "./pages/shopping/home";
import CheckAuth from "./components/common/check-auth";
import Unauth from "./pages/unauth-page";

export default function App() {
  const isAuthenticated = false;
  const user = {
    name: "manisih",
    role: "admin",
  };

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
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
          <Route path="dashboard" element={<Admindashboard />} />
          <Route path="order" element={<AdminOrders />} />
          <Route path="product" element={<Adminproduct />} />
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
          <Route path="list" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
        </Route>

        <Route path="/unauth-page" element={<Unauth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
