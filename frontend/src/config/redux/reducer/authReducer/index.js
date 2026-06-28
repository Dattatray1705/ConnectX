import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  loginUser,
  registerUser,
  getAllUsers,
  sendConnectionRequest,
  getMyConnectionsRequest,
  getConnectionRequest,
    acceptConnection  
} from "@/config/redux/action/authAction";

const initialState = {
  user: null,
  profile: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  loggedIn: false,
  justLoggedIn: false,
  message: "",
  isTokenThere: false,
  profileFetched: false,
  connections: [],
  connectionRequest: [],
  all_users: [],
  All_profiles_fetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    emptyMessage: (state) => {
      state.message = "";
      state.isError = false;
    },

    setTokenIsThere: (state) => {
      state.isTokenThere = true;
    },

    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
    },
    resetJustLoggedIn: (state) => {
  state.justLoggedIn = false;
},

    // ✅ LOGOUT MUST BE HERE
    logout: (state) => {
      state.user = null;
      state.profile = null;
      state.loggedIn = false;
      state.profileFetched = false;
      state.isTokenThere = false;
      state.all_users = [];
      state.All_profiles_fetched = false;
      state.connections = [];
      state.connectionRequest = [];
      state.message = "";
      state.isError = false;
      state.isLoading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "Logging in...";
      })
     .addCase(loginUser.fulfilled, (state, action) => {
  state.isLoading = false;
  state.loggedIn = true;
  state.isTokenThere = true;
  state.user = action.payload.user;
  state.justLoggedIn = true;
  state.message = "Login successful";
})
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "Registering...";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Register successful, please login";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // GET PROFILE
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.loggedIn = true;
        state.isTokenThere = true;
        state.profile = action.payload  // ✅ FIX
        state.user = action.payload.userId;
      })
   .addCase(getAboutUser.rejected, (state, action) => {
  state.isLoading = false;
  state.loggedIn = false;
  state.isTokenThere = false;
  state.profile = null;
  state.profileFetched = true; // ✅ true
  state.message = action.payload;
})

      // GET ALL USERS
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.All_profiles_fetched = true;
        state.all_users = action.payload;
      })
.addCase(getConnectionRequest.fulfilled,(state,action)=>{
    state.connectionRequest = action.payload || [];
})

.addCase(getConnectionRequest.rejected,(state,action)=>{
  state.message = action.payload;
})

.addCase(getMyConnectionsRequest.fulfilled, (state, action) => {
  state.connections = action.payload;
})

.addCase(getMyConnectionsRequest.rejected,(state,action)=>{
  state.message = action.payload;
})
.addCase(acceptConnection.pending,(state)=>{
  state.isLoading = true
})

.addCase(acceptConnection.fulfilled,(state)=>{
  state.isLoading = false
})

.addCase(acceptConnection.rejected,(state,action)=>{
  state.isLoading = false
  state.message = action.payload
})
  },
});

export const {
  emptyMessage,
  setTokenIsThere,
  setTokenIsNotThere,
  logout,
  resetJustLoggedIn,
} = authSlice.actions;

export default authSlice.reducer;