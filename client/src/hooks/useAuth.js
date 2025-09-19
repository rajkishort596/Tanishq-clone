import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyUserOTP,
  completeUserRegistration,
} from "../api/auth.Api";
import { setAuthStatus, setCredentials, logout } from "../features/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export const useAuth = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  /* --------------------
            Login
     -------------------- */
  const loginUserMutation = useMutation({
    mutationFn: (userData) => loginUser(userData),
    onSuccess: (res) => {
      dispatch(setCredentials({ user: res.user, isAuthenticated: true }));
      dispatch(setAuthStatus("succeeded"));
      toast.success(`Welcome back ${res.user.firstName || "User"}`);
    },
    onError: (err) => {
      const errorMsg =
        err?.response?.data?.message || "Login failed. Please try again.";
      console.error("Login error:", err);
      toast.error(errorMsg);
      dispatch(setAuthStatus("failed"));
    },
  });

  /* --------------------
            Logout
     -------------------- */
  const logoutUserMutation = useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["cart"] });
      queryClient.removeQueries({ queryKey: ["wishlist"] });
      queryClient.removeQueries({ queryKey: ["addresses"] });
      queryClient.removeQueries({ queryKey: ["userProfile"] });

      toast.success("User Logged out successfully");
      dispatch(logout());
    },
    onError: (err) => {
      console.error("Logout error:", err);
      toast.error("Failed to logout. Please try again.");
    },
  });

  /* --------------------
            Send OTP (Register User)
     -------------------- */
  const sendOtpMutation = useMutation({
    mutationFn: (payload) => registerUser(payload),
    onSuccess: (res, variables) => {
      // variables contains the data passed to mutate (e.g. { email })
      const emailForToast = variables?.email || res?.email;
      toast.success(`OTP sent to ${emailForToast}`);
    },
    onError: (err) => {
      const errorMsg =
        err?.response?.data?.message || "OTP send failed. Please try again.";
      console.error("Send OTP error:", err);
      toast.error(errorMsg);
    },
  });

  /* --------------------
            Resend OTP
     -------------------- */
  const resendOtpMutation = useMutation({
    mutationFn: (payload) => registerUser(payload),
    onSuccess: (res, variables) => {
      const emailForToast = variables?.email || res?.email;
      toast.success(`OTP resent to ${emailForToast}`);
    },
    onError: (err) => {
      const errorMsg =
        err?.response?.data?.message || "Resend OTP failed. Please try again.";
      console.error("Resend OTP error:", err);
      toast.error(errorMsg);
    },
  });

  /* --------------------
            Verify OTP
     -------------------- */
  const verifyOtpMutation = useMutation({
    mutationFn: ({ email, otp }) => verifyUserOTP({ email, otp }),
    onSuccess: (res) => {
      toast.success("OTP verified! Please complete your registration.");
    },
    onError: (err) => {
      const errorMsg =
        err?.response?.data?.message ||
        "OTP verification failed. Please try again.";
      console.error("Verify OTP error:", err);
      toast.error(errorMsg);
    },
  });

  /* --------------------
    Complete Registration
     -------------------- */
  const completeRegistrationMutation = useMutation({
    mutationFn: (payload) => completeUserRegistration(payload),
    onSuccess: (res) => {
      dispatch(setCredentials({ user: res.user, isAuthenticated: true }));
      dispatch(setAuthStatus("succeeded"));
      toast.success(`Welcome to Tanishq ${res.user.firstName || "User"}`);
    },
    onError: (err) => {
      const errorMsg =
        err?.response?.data?.message ||
        "Registration failed. Please try again.";
      console.error("Complete registration error:", err);
      toast.error(errorMsg);
    },
  });

  return {
    // login/logout
    loginUser: loginUserMutation.mutateAsync,
    isLogging: loginUserMutation.isPending,

    logoutUser: logoutUserMutation.mutateAsync,
    isLoggingOut: logoutUserMutation.isPending,

    // otp flow
    sendOtp: sendOtpMutation.mutateAsync,
    isSendingOtp: sendOtpMutation.isPending,

    resendOtp: resendOtpMutation.mutateAsync,
    isResendingOtp: resendOtpMutation.isPending,

    verifyOtp: verifyOtpMutation.mutateAsync,
    isVerifyingOtp: verifyOtpMutation.isPending,

    // complete registration
    completeRegistration: completeRegistrationMutation.mutateAsync,
    isCompletingRegistration: completeRegistrationMutation.isPending,
  };
};
