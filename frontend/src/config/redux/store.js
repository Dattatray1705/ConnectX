/**
 * steps for state management
 * Submit Action 
 * Handle action  in its reducer
 * register here > Reducer
 */
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";
import notificationReducer from "./reducer/notificationReducer";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    notification: notificationReducer,
    
  },
});

