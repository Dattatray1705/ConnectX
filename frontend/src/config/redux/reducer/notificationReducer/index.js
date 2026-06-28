import { createSlice } from "@reduxjs/toolkit";
import { getNotifications } from "../../action/notificationAction";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},

  extraReducers: (builder) => {

    builder

      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
      })

      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })

      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export default notificationSlice.reducer;