import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "../features/authSlice.js";
import loadingReducer from "../features/loadingSlice.js";
export const store = configureStore({
  reducer: {
    auth: adminAuthReducer,
    loading: loadingReducer,
  },
});

export default store;
