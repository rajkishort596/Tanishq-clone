import React from "react";
import { useForm } from "react-hook-form";
import Input from "../Input/Input";
import { useDispatch, useSelector } from "react-redux";
import Select from "../Input/Select";
import { updateProfile } from "../../api/profile.Api";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import { setCredentials } from "../../features/authSlice";
import { toast } from "react-toastify";
import { formatInputDate } from "../../utils/formatters";
const EditDetailsForm = ({ onClose, user }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      gender: user?.gender || "",
      dob: formatInputDate(user?.dob) || "",
      anniversary: formatInputDate(user?.anniversary) || "",
      phone: user?.phone || "",
      email: user?.email || "",
    },
  });

  const loading = useSelector((state) => state.loading.isLoading);

  const onSubmit = async (data) => {
    dispatch(startLoading());
    try {
      const user = await updateProfile(data);
      dispatch(setCredentials({ user: user, isAuthenticated: true }));
      toast.success("Profile Update Successfully");
      onClose();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Failed to update profile";
      toast.error(errorMsg);
    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-semibold text-primary font-nunito mb-6">
        Personal Information
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            id="firstName"
            label="First Name"
            placeholder="Enter your First Name"
            error={errors.firstName?.message}
            {...register("firstName", {
              required: "First Name is required",
            })}
          />
          <Input
            id="lastName"
            label="Last Name"
            placeholder="Enter your Last Name"
            error={errors.lastName?.message}
            {...register("lastName", {
              required: "Last Name is required",
            })}
          />
          <Input
            id="dob"
            label="Date of Birth"
            type="date"
            error={errors.dob?.message}
            {...register("dob")}
          />
          <Input
            id="anniversary"
            label="Anniversary Date"
            type="date"
            error={errors.anniversary?.message}
            {...register("anniversary")}
          />
          <div className="md:col-span-2">
            {/* Gender Select */}
            <Select
              label="Gender"
              id="gender"
              {...register("gender")}
              error={errors.gender?.message}
            >
              <option value="">-- Select Gender --</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </div>

          <h2 className="col-span-1 md:col-span-2 text-2xl font-semibold text-primary font-nunito">
            Contact Details
          </h2>
          <Input
            id="phone"
            label="Phone No"
            type="tel"
            placeholder="Enter Mobile Number"
            error={errors.phone?.message}
            {...register("phone", {
              required: "Mobile number is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Enter a valid 10-digit number",
              },
            })}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your Email"
            disabled
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Enter a valid email",
              },
            })}
          />

          <div className="mt-4 ml-auto flex gap-4 col-span-1 md:col-span-2">
            <button
              type="button"
              className="px-8 border border-primary rounded-sm text-primary bg-white cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-8 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditDetailsForm;
