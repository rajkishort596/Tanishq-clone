import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { GemIcon, Lock, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../api/auth.Api";
import Input from "../components/Form/Input/IconInput";
import Spinner from "../components/Spinner";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  // Mutation with TanStack Query
  const PasswordResetMutation = useMutation({
    mutationFn: ({ password }) => resetPassword({ token, password }),
    onSuccess: () => {
      toast.success("Password reset successful! Please login.");
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Reset failed");
    },
  });

  const onSubmit = async (data) => {
    await PasswordResetMutation.mutateAsync({ password: data.password });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#6b0f1a] to-[#1a0d0d] px-4 relative">
      {/* Decorative Background Gems */}
      <div className="absolute top-10 left-10 opacity-10 scale-150">
        <GemIcon size={200} className="text-yellow-500" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10 scale-150">
        <GemIcon size={200} className="text-yellow-500" />
      </div>

      {/* Form Container */}
      <div className="w-full max-w-lg bg-[#1f0f0f]/90 border border-yellow-700 shadow-2xl rounded-xl p-8 z-10 backdrop-blur-sm">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <GemIcon size={48} className="text-yellow-500 drop-shadow-lg" />
        </div>
        <h2 className="text-3xl text-center font-bold text-yellow-500 mb-2">
          Reset Password
        </h2>
        <p className="text-gray-300 text-center mb-6 text-sm">
          Enter and confirm your new password to regain access.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <Input
              id="password"
              label="New Password"
              type={showPassword ? "text" : "password"}
              icon={Lock}
              placeholder="Enter new password"
              register={register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              error={errors.password}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />
          </div>

          <div className="relative">
            <Input
              label="Confirm Password"
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              icon={Lock}
              placeholder="Re-enter new password"
              register={register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === getValues("password") || "Passwords do not match",
              })}
              error={errors.confirmPassword}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className=" text-gray-400 hover:text-gray-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              }
            />
          </div>

          <button
            type="submit"
            disabled={PasswordResetMutation.isPending}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {PasswordResetMutation.isPending
              ? "Reseting...."
              : "Reset Password"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
