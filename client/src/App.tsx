import { Route, Routes } from "react-router-dom";
// auth
import AuthLayout from "./components/auth/layout";
import Login from "./pages/auth/login";
import Register from "./pages/auth/Register";
// admin
import AdminLayout from "./components/admin/layout";
import AdminDashboard from "./pages/admin/dashboard";
import AdminOrder from "./pages/admin/order";
import AdminProduct from "./pages/admin/product";
// shopping
import ShoppingLayout from "./components/shopping/layout";
import ShoppingHome from "./pages/shopping/Home";
import ShoppingAccount from "./pages/shopping/Account";
import ShoppingCheckOut from "./pages/shopping/CheckOut";
import ShoppingList from "./pages/shopping/list";
// check auth
import CheckAuth from "./components/common/auth-check";
// not found page
import NotFound from "./pages/NotFound";
// unauth page
import UnauthPage from "./pages/unauth-age";

export default function App() {
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* auth routes  */}
        <Route
          path="/auth"
          element={
            <CheckAuth>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* admin routes  */}
        <Route
          path="/admin"
          element={
            <CheckAuth>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="order" element={<AdminOrder />} />
          <Route path="product" element={<AdminProduct />} />
        </Route>

        {/* shopping routes  */}
        <Route
          path="/shop"
          element={
            <CheckAuth>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="checkout" element={<ShoppingCheckOut />} />
          <Route path="list" element={<ShoppingList />} />
        </Route>

        {/* unauth page  */}
        <Route path="/unauth-page" element={<UnauthPage />} />
        {/* page not found  */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
