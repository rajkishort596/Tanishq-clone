import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "../features/authSlice.js";
import loadingReducer from "../features/loadingSlice.js";
export const store = configureStore({
  reducer: {
    auth: userAuthReducer,
    loading: loadingReducer,
  },
});
export default store;
