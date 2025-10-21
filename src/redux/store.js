import { configureStore } from "@reduxjs/toolkit";
import layoutReducer from './layoutSlice';
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    layout: layoutReducer,
    user: userReducer,
  },
});

export default store;
