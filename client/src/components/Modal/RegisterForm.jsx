import React from "react";
import Input from "../Input/Input";
import "flag-icons/css/flag-icons.min.css";
import { Lock } from "lucide-react";

const RegisterForm = ({
  onRegister,
  errors,
  register,
  email,
  registering = false,
}) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-primary font-nunito mb-1">
          Register user
        </h2>
        <p className="text-sm text-gray-600 font-IBM-Plex">
          Welcome! Please fill the details
        </p>
      </div>
      <form onSubmit={onRegister} className="flex flex-col gap-4">
        <Input
          id="email"
          type="email"
          placeholder="Enter Email ID"
          value={email}
          disabled
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          id="firstName"
          type="text"
          placeholder="Enter First Name"
          error={errors.firstName?.message}
          {...register("firstName", { required: "First name is required" })}
        />
        <Input
          id="lastName"
          type="text"
          placeholder="Enter Last Name ( Optional )"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
        <Input
          id="password"
          type="password"
          placeholder="Enter your Password"
          icon={<Lock size={18} />}
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required.",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long.",
            },
            pattern: {
              value: passwordRegex,
              message:
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
            },
          })}
        />
        <div className="flex gap-2">
          <Input
            id="phone"
            type="tel"
            placeholder="Enter Mobile Number"
            prefix="+91"
            icon={<span className="fi fi-in"></span>}
            error={errors.phone?.message}
            {...register("phone", {
              required: "Mobile number is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Enter a valid 10-digit number",
              },
            })}
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full rounded-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={registering}
        >
          {registering ? "Registering..." : "Continue"}
        </button>
      </form>
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

export default RegisterForm;
