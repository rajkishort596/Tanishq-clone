import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  isAuthenticated: false,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
};
const adminAuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.admin = action.payload.admin;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.status = "failed";
    },
    setAuthStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});
export const { setCredentials, logout, setAuthStatus } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
