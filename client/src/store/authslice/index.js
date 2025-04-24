import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        formdata,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const checkauth = createAsyncThunk("/auth/check-auth", async () => {
  const response = await axios.get(
    "http://localhost:8080/api/auth/check-auth",
    {
      withCredentials: true,
      headers: {
        "Cache-Control":
          "no-store , no-cache ,must-revalidate ,proxy-revalidate",
      },
    }
  );
  return response.data;
});

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
  },
  extraReducers: (builder) => {
    builder //register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = action.payload;
      }) //login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.isAuthenticated = true),
          (state.user = action.payload.data);
      })
      .addCase(loginUser.rejected, (state, action) => {
        (state.isAuthenticated = false),
          (state.isLoading = false),
          (state.user = action.payload);
      }) //check auth
      .addCase(checkauth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkauth.fulfilled, (state, action) => {
        (state.isLoading = false),
          (state.user = action.payload.user),
          (state.isAuthenticated = true);
      })
      .addCase(checkauth.rejected, (state, action) => {
        (state.isAuthenticated = false),
          (state.isLoading = false),
          (state.user = null);
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
