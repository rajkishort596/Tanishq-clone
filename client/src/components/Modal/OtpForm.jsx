import React, { useState, useRef } from "react";

const OtpForm = ({ onVerify, onResend, timer, email, error, setError }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

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
            className={`w-10 h-12 text-center text-lg font-bold border-2 rounded-md ${
              error ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:border-[#631517] transition-colors`}
            type="text"
            maxLength="1"
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
          />
        ))}
      </div>
      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}
      <p className="text-sm text-gray-600 text-center mb-6">
        Resend OTP in 0{Math.floor(timer / 60)}:
        {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
      </p>
      <button
        type="button"
        onClick={verifyOtp}
        className="btn-primary w-full rounded-full"
      >
        Verify OTP
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
