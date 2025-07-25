import api from "@/utils/refreshtoken";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
  token: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        formdata,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const checkauth = createAsyncThunk("/auth/check-auth", async (token) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control":
          "no-store , no-cache ,must-revalidate ,proxy-revalidate",
      },
    }
  );

  return response.data;
});
// export const checkauth = createAsyncThunk("/auth/check-auth", async () => {
//   const response = await axios.get(
//     `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
//     {
//       withCredentials: true,
//       headers: {
//         "Cache-Control":
//           "no-store , no-cache ,must-revalidate ,proxy-revalidate",
//       },
//     }
//   );
//   return response.data;
// });

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", formData);

      // Only store what's needed from the response
      // if (response.data.accessToken) {
      //   localStorage.setItem("accessToken", response.data.accessToken);
      // }

      return response.data;
    } catch (err) {
      console.error("Login failed:", err);
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);
export const logout = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout `,

        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Logout failed" }
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
    resetToken: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },
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
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data;
        state.token = action.payload.token;
        sessionStorage.setItem("token", JSON.stringify(action.payload.token));
      })
      .addCase(loginUser.rejected, (state, action) => {
        {
          state.isAuthenticated = false;
          state.isLoading = false;
          state.user = action.payload;
          state.token = null;
        }
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
      }) //log out
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { setUser, resetToken } = authSlice.actions;
export default authSlice.reducer;
