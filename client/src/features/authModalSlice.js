import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  isLogin: true, // true = login, false = signup
};

const authModalSlice = createSlice({
  name: "authModal",
  initialState,
  reducers: {
    openAuthModal: (state, action) => {
      state.isOpen = true;
      state.isLogin = action.payload === undefined ? true : action.payload;
    },
    closeAuthModal: (state) => {
      state.isOpen = false;
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
  },
});

export const { openAuthModal, closeAuthModal, setIsLogin } =
  authModalSlice.actions;
export default authModalSlice.reducer;
