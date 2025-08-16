import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
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
    },
  },
});

export const { setCredentials, logout } = userAuthSlice.actions;
export default userAuthSlice.reducer;
