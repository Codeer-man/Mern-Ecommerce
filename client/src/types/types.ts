import { ReactNode } from "react";

//? redux auth
export interface authState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: string | null;
}

//? user role
type role = "admin" | "user";

//? user data
interface user {
  username: string;
  email: string;
  role: role;
}
//? check auth
export interface authCheck {
  isAuthenticated: boolean;
  user: user | null;
  children: ReactNode;
}

// common form
export interface form {}

//? register formData
export interface RegisterData {
  email: string;
  password: string;
  username: string;
}

//? login formData
export interface LoginData {
  password: string;
  email: string;
}
