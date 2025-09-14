import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "../features/authSlice.js";
import loadingReducer from "../features/loadingSlice.js";
import authModalReducer from "../features/authModalSlice.js";
export const store = configureStore({
  reducer: {
    auth: userAuthReducer,
    loading: loadingReducer,
    authModal: authModalReducer,
  },
});
export default store;
