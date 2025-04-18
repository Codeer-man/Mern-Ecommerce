import { authCheck } from "@/types/types";
import { Navigate, useLocation } from "react-router-dom";

export default function CheckAuth({
  isAuthenticated,
  user,
  children,
}: authCheck) {
  const location = useLocation();
  const path = location.pathname;

  // Redirect unauthenticated users trying to access protected routes
  const isAuthPage = path.includes("/login") || path.includes("/register");
  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/auth/login" />;
  }

  //  Redirect authenticated users away from login/register
  if (isAuthenticated && isAuthPage) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  //  Block user role from accessing /admin routes
  if (isAuthenticated && user?.role !== "admin" && path.startsWith("/admin")) {
    return <Navigate to="/unauth-page" />;
  }

  //  Block admin role from accessing /shop routes
  if (isAuthenticated && user?.role === "admin" && path.startsWith("/shop")) {
    return <Navigate to="/admin/dashboard" />;
  }

  // If all checks pass, allow children to render
  return <>{children}</>;
}
