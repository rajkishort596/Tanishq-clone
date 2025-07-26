import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  isAuthenticated: false,
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
    },
  },
});
export const { setCredentials, logout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
