import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

const OtpForm = ({
  onVerify,
  onResend,
  timer,
  email,
  error,
  setError,
  attemptsLeft,
  resendLoading,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const loading = useSelector((state) => state.loading.isLoading);

  console.log("Resend Loading:", resendLoading);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const verifyOtp = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 6) {
      onVerify(enteredOtp);
      setError("");
    } else {
      setError("Please enter the complete OTP.");
    }
  };

  const handleResendOTP = () => {
    onResend();
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0].focus();
  };

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-primary font-nunito mb-1">
          Verify with OTP
        </h2>
        <p className="text-sm text-gray-600 font-IBM-Plex">Sent to {email}</p>
      </div>
      <div className="flex justify-center gap-3 mb-4">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
            disabled={attemptsLeft <= 0}
            className={`w-10 h-12 text-center text-lg font-bold border-2 rounded-md
                        ${error ? "border-red-500" : "border-gray-300"}
                        focus:outline-none focus:border-[#631517] transition-colors
                        disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-gray-300
                     `}
          />
        ))}
      </div>
      {(error || attemptsLeft <= 0) && (
        <p className="text-red-500 text-sm text-center mb-4">
          {attemptsLeft <= 0
            ? "Maximum OTP attempts reached. Please resend OTP."
            : error}
        </p>
      )}
      <div className="flex flex-col items-center mb-6">
        {timer > 0 ? (
          <p className="text-sm text-gray-600 text-center">
            Resend OTP in 0{Math.floor(timer / 60)}:
            {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendOTP}
            className="text-[#631517] underline text-sm mb-2 cursor-pointer disabled:cursor-not-allowed"
            disabled={resendLoading}
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={verifyOtp}
        className={`btn-primary w-full rounded-full ${
          attemptsLeft <= 0 ? "opacity-60 cursor-not-allowed" : ""
        }`}
        disabled={loading || attemptsLeft <= 0}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
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
};

export default OtpForm;
