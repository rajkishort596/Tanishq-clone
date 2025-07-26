import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import images from "../constants/images";
import LoginHeroImg from "../assets/images/Login-HeroImg.png";
import Input from "../components/Form/Input";
import { loginAdmin } from "../api/auth.Api";
import { setCredentials } from "../features/authSlice.js";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log("Login data:", data);
      const res = await loginAdmin(data);
      console.log(res);
      dispatch(setCredentials({ admin: res.user }));
      toast.success(`Welcome back ${res.user.fullName || "Admin"}`);
      reset();
      navigate("/");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-nunito bg-tanishq-gradient">
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden rounded-tr-[3rem] rounded-br-[3rem]">
        <img
          src={LoginHeroImg}
          alt="Tanishq Jewellery"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <img src={images.logo} alt="Tanishq Logo" className="h-25 w-auto" />
          </div>

          <h1 className="text-4xl font-fraunces text-gold-accent text-center mb-2">
            Admin Login
          </h1>
          <p className="text-[var(--color-grey3)] text-center mb-8">
            Login to your dashboard
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
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
            </div>

            <div>
              <Input
                id="password"
                type="password"
                icon={Lock}
                label={"Password"}
                placeholder="Password"
                error={errors.password}
                register={register("password", {
                  required: "Password is required",
                })}
              />
            </div>

            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-[var(--color-gold)] hover:underline text-sm"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-3 text-lg font-bold rounded-md hover:scale-105 transition-transform duration-200"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
