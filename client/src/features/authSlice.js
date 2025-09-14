import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const userAuthSlice = createSlice({
  name: "auth",
  initialState,
  // This reducer handles user authentication state
  reducers: {
    // This action sets the user credentials and authentication status
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    // This action logs out the user by resetting the state
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "failed";
    },
    setAuthStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setCredentials, logout, setAuthStatus } = userAuthSlice.actions;
export default userAuthSlice.reducer;
