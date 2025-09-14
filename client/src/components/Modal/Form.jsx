import { X, Mail, Lock } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Input from "../Input/Input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  completeUserRegistration,
  loginUser,
  registerUser,
  verifyUserOTP,
} from "../../api/auth.Api";
import { setAuthStatus, setCredentials } from "../../features/authSlice.js";
import { startLoading, stopLoading } from "../../features/loadingSlice.js";
import OtpForm from "./OtpForm";
import RegisterForm from "./RegisterForm";

const Form = ({ isLogin, onClose, setIsLogin }) => {
  const [step, setStep] = useState(isLogin ? "login" : "email");
  const [timer, setTimer] = useState(180);
  const [email, setEmail] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpAttemptsLeft, setOtpAttemptsLeft] = useState(5);
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    let interval;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async (data) => {
    dispatch(startLoading());
    try {
      setEmail(data.email);
      setTimer(180);
      const res = await registerUser(data);
      console.log(res);
      if (typeof res?.attemptsLeft === "number") {
        setOtpAttemptsLeft(res.attemptsLeft);
      }
      toast.success(`OTP Sent to ${data.email}`);
      reset();
      setStep("otp");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "OTP failed. Please try again.";
      console.error("OTP error:", err);
      toast.error(errorMsg);
    } finally {
      dispatch(stopLoading());
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const res = await registerUser({ email });
      if (typeof res?.attemptsLeft === "number") {
        setOtpAttemptsLeft(res.attemptsLeft);
      }
      toast.success(`OTP resent to ${email}`);
      setOtpError("");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Resend OTP failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setResendLoading(false);
      setTimer(180);
    }
  };

  const handleVerifyOtp = async (enteredOtp) => {
    dispatch(startLoading());
    try {
      const res = await verifyUserOTP({ email, otp: enteredOtp });
      console.log(res);
      if (typeof res?.attemptsLeft === "number") {
        setOtpAttemptsLeft(res.attemptsLeft);
      }
      toast.success("OTP verified! Please complete your registration.");
      setStep("register");
      setOtpError("");
      reset();
    } catch (err) {
      // Prefer backend error and attemptsLeft
      const errorMsg =
        err?.response?.data?.message ||
        "OTP verification failed. Please try again.";
      const attemptsLeft = err?.response?.data?.errors?.attemptsLeft;
      console.log(attemptsLeft);
      if (typeof attemptsLeft === "number") {
        setOtpAttemptsLeft(attemptsLeft);
      }
      setOtpError(errorMsg);
      toast.error(errorMsg);
    } finally {
      dispatch(stopLoading());
    }
  };

  const handleRegister = async (data) => {
    dispatch(startLoading());
    try {
      const res = await completeUserRegistration(data);
      onClose();
      dispatch(setCredentials({ user: res.user, isAuthenticated: true }));
      toast.success(`Welcome to Tanishq ${res.user.firstName || "User"}`);
      navigate("/");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      dispatch(stopLoading());
    }
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setStep(!isLogin ? "login" : "email");
    reset();
  };

  const handleLogin = async (data) => {
    dispatch(startLoading());
    try {
      console.log("Login data:", data);
      const res = await loginUser(data);
      console.log(res);
      dispatch(setCredentials({ user: res.user, isAuthenticated: true }));
      dispatch(setAuthStatus("succeeded"));
      toast.success(`Welcome back ${res.user.firstName || "User"}`);
      reset();
      onClose();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Login failed. Please try again.";
      console.error("Login error:", err);
      toast.error(errorMsg);
      dispatch(setAuthStatus("failed"));
    } finally {
      dispatch(stopLoading());
    }
  };

  console.log(otpAttemptsLeft);

  const renderContent = () => {
    switch (step) {
      case "otp":
        return (
          <OtpForm
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            timer={timer}
            email={email}
            error={otpError}
            setError={setOtpError}
            attemptsLeft={otpAttemptsLeft}
            resendLoading={resendLoading}
          />
        );
      case "register":
        return (
          <RegisterForm
            onRegister={handleSubmit(handleRegister)}
            onClose={onClose}
            errors={errors}
            email={email}
            register={register}
          />
        );
      case "login":
      case "email":
      default:
        return (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-primary font-nunito mb-2">
                {isLogin ? "Welcome Back!" : "Welcome to Tanishq!"}
              </h2>
              <p className="text-sm text-gray-600 text-center font-IBM-Plex">
                {isLogin
                  ? "Login to access your account"
                  : "Signup to get exclusive Tanishq privileges"}
              </p>
            </div>
            {step === "login" ? (
              <form
                onSubmit={handleSubmit(handleLogin)}
                className="flex flex-col gap-4"
              >
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your Email"
                  icon={<Mail size={18} />}
                  error={errors.email?.message}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Enter a valid email",
                    },
                  })}
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your Password"
                  icon={<Lock size={18} />}
                  error={errors.password?.message}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="submit"
                  className="btn-primary w-1/2 mx-auto rounded-full mt-4"
                  disabled={loading}
                >
                  {loading ? "Logging..." : "Login"}
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleSubmit(handleSendOtp)}
                className="flex flex-col gap-4"
              >
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your Email"
                  icon={<Mail size={18} />}
                  error={errors.email?.message}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Enter a valid email",
                    },
                  })}
                />
                <button
                  type="submit"
                  className="btn-primary w-1/2 mx-auto rounded-full mt-4"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}
            <p className="mt-4 text-sm text-gray-600 text-center">
              {isLogin
                ? "Don’t have an account? "
                : "Already have an account? "}
              <button
                onClick={handleToggle}
                className="text-[#631517] font-medium underline cursor-pointer"
              >
                {isLogin ? "Register now" : "Login"}
              </button>
            </p>
            <p className="mt-4 text-xs text-gray-500 text-center">
              By continuing, I agree to{" "}
              <a href="#" className="text-[#631517] underline">
                Terms of Use
              </a>{" "}
              &{" "}
              <a href="#" className="text-[#631517] underline">
                Privacy Policy
              </a>
            </p>
          </>
        );
    }
  };

  return (
    <div className="w-full relative flex-1 p-8 bg-white flex flex-col justify-center rounded-xl shadow-2xl">
      <button
        onClick={onClose}
        className="absolute lg:hidden top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <X size={20} />
      </button>
      {renderContent()}
    </div>
  );
};

export default Form;
