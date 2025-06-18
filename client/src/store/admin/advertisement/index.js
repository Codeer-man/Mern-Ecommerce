import axios from "axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  AdvertisementList: [],
  isLoading: false,
  Ads: null,
  error: "",
};

export const createAds = createAsyncThunk(
  "/create/ads",
  async (formdata, { rejewithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/ads/create`,
        formdata,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejewithValue(
        error.response?.data?.message || {
          message: "Something went wrong! Please try again later.",
        }
      );
    }
  }
);

export const getAllAds = createAsyncThunk(
  "/get/all/ads",
  async (_, { rejewithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/ads/get/all`
      );
      return response.data;
    } catch (error) {
      return rejewithValue(
        error.response?.data?.message || {
          message: "Something went wrong! Please try again later.",
        }
      );
    }
  }
);
export const updateAds = createAsyncThunk(
  "/update/ads",
  async ({ id, formdata }, { rejewithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/ads/update/${id}`,
        formdata,
        {
          headers: {
            "content-type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejewithValue(
        error.response?.data?.message || {
          message: "Something went wrong! Please try again later.",
        }
      );
    }
  }
);

export const DeleteAds = createAsyncThunk(
  "/delete/ads",
  async (id, { rejewithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/ads/delete/${id}`
      );
      return response.data;
    } catch (error) {
      return rejewithValue(
        error.response?.data?.message || {
          message: "Something went wrong! Please try again later.",
        }
      );
    }
  }
);

export const updateActive = createAsyncThunk(
  "/update/ads/active",
  async ({ id, isActive }, { rejewithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/ads/isactive/update/${id}`,
        { isActive },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      return rejewithValue(
        error.response?.data?.message || {
          message: "Something went wrong! Please try again later.",
        }
      );
    }
  }
);

const advertisementSlice = createSlice({
  name: "advertisement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.Ads = action.payload.data;
      })
      .addCase(createAds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.Ads = null;
      })
      .addCase(getAllAds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.AdvertisementList = action.payload.ads;
      })
      .addCase(updateActive.fulfilled, (state, action) => {
        const updatedAd = action.payload.data;

        const index = state.AdvertisementList.findIndex(
          (item) => item._id === updatedAd._id
        );

        if (index !== -1) {
          state.AdvertisementList[index] = updatedAd;
        }
      });
  },
});

export default advertisementSlice.reducer;
