import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { GemIcon, Mail } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import Input from "../components/Form/Input/IconInput";
import { forgotPassword } from "../api/auth.Api";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // TanStack mutation for forgot password
  const ForgotPasswordMutation = useMutation({
    mutationFn: (email) => forgotPassword(email),
    onSuccess: () => {
      toast.success("Password reset link sent! Please check your email.");
      reset();
    },
    onError: (err) => {
      const errorMsg =
        err?.response?.data?.message ||
        "Failed to send reset link. Please try again.";
      toast.error(errorMsg);
    },
  });

  const onSubmit = async (data) => {
    await ForgotPasswordMutation.mutateAsync(data.email);
  };

  return (
    <section className="h-screen relative flex items-center justify-center bg-gradient-to-b from-[#6b0f1a] to-[#1a0d0d] px-4 overflow-hidden">
      {/* Decorative Background Gems */}
      <div className="absolute top-8 left-10 opacity-10 scale-150">
        <GemIcon size={200} className="text-yellow-500" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10 scale-150">
        <GemIcon size={200} className="text-yellow-500" />
      </div>

      {/* Form Container */}
      <div className="w-full max-w-lg bg-[#1f0f0f]/90 border border-yellow-700 shadow-2xl rounded-xl p-8 z-10 backdrop-blur-sm">
        {/* Title */}
        <div className="flex justify-center mb-6">
          <GemIcon size={48} className="text-yellow-500 drop-shadow-lg" />
        </div>
        <h2 className="text-3xl text-center font-bold text-yellow-500 mb-2">
          Forgot Password
        </h2>
        <p className="text-grey3 text-center mb-6 text-sm ">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="email"
            type="email"
            icon={Mail}
            placeholder="Email address"
            label={"Email Address"}
            error={errors.email}
            register={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address",
              },
            })}
          />

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={ForgotPasswordMutation.isPending}
          >
            {ForgotPasswordMutation.isPending
              ? "Sending...."
              : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-sm text-center text-gray-400 mt-4">
          Remember your password?{" "}
          <Link to="/login" className="text-gold hover:underline text-sm">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
