import { X, Mail, Lock } from "lucide-react";
import React, { useState, useEffect } from "react";
import Input from "../Input/Input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import OtpForm from "./OtpForm";
import RegisterForm from "./RegisterForm";
import { useAuth } from "../../hooks/useAuth.js";
import { Link } from "react-router-dom";

const Form = ({ isLogin, onClose, setIsLogin }) => {
  const [step, setStep] = useState(isLogin ? "login" : "email");
  const [timer, setTimer] = useState(180);
  const [email, setEmail] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpAttemptsLeft, setOtpAttemptsLeft] = useState(5);

  const navigate = useNavigate();
  const loading = useSelector((state) => state.loading.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const {
    loginUser,
    isLogging,
    sendOtp,
    isSendingOtp,
    resendOtp,
    isResendingOtp,
    verifyOtp,
    isVerifyingOtp,
    completeRegistration,
    isCompletingRegistration,
  } = useAuth();

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

  // Send OTP
  const handleSendOtp = async (data) => {
    setEmail(data.email);
    setTimer(180);

    const res = await sendOtp(data);
    if (typeof res?.attemptsLeft === "number") {
      setOtpAttemptsLeft(res.attemptsLeft);
    }

    reset();
    setStep("otp");
  };

  // Resend OTP
  const handleResendOtp = async () => {
    const res = await resendOtp({ email });
    if (typeof res?.attemptsLeft === "number") {
      setOtpAttemptsLeft(res.attemptsLeft);
    }

    setOtpError("");
    setTimer(180);
  };

  // Verify OTP
  const handleVerifyOtp = async (enteredOtp) => {
    try {
      const res = await verifyOtp({ email, otp: enteredOtp });
      if (typeof res?.attemptsLeft === "number") {
        setOtpAttemptsLeft(res.attemptsLeft);
      }

      setOtpError("");
      reset();
      setStep("register");
    } catch (err) {
      const attemptsLeft = err?.response?.data?.errors?.attemptsLeft;
      if (typeof attemptsLeft === "number") {
        setOtpAttemptsLeft(attemptsLeft);
      }
      const errorMsg =
        err?.response?.data?.message ||
        "OTP verification failed. Please try again.";
      setOtpError(errorMsg);
    }
  };

  // Complete registration
  const handleRegister = async (data) => {
    await completeRegistration(data);
    onClose();
    navigate("/");
  };

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setStep(!isLogin ? "login" : "email");
    reset();
  };
  // Login User
  const handleLogin = async (data) => {
    await loginUser(data);
    reset();
    onClose();
  };

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
            resending={isResendingOtp}
            verifying={isVerifyingOtp}
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
            registering={isCompletingRegistration}
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
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-primary hover:underline text-sm"
                  >
                    Forgot password?
                  </Link>
                </div>
                <button
                  type="submit"
                  className="btn-primary w-1/2 mx-auto rounded-full mt-4"
                  disabled={loading}
                >
                  {isLogging ? "Logging..." : "Login"}
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
                  {isSendingOtp ? "Sending..." : "Send OTP"}
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
