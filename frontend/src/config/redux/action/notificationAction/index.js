import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";

export const getNotifications = createAsyncThunk(
  "notification/getNotifications",
  async (_, thunkAPI) => {
    try {

      const response = await clientServer.get(
        "/api/users/notifications",
        {
          withCredentials: true,
        }
      );

      return response.data;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );

    }
  }
);