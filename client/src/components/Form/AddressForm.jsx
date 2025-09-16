import React from "react";
import { useForm } from "react-hook-form";
import Select from "../Input/Select";
import Input from "../Input/Input";

const AddressForm = ({ onClose, address, onSubmitAddress }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      addressLine: address?.addressLine || "",
      landmark: address?.landmark || "",
      city: address?.city || "",
      state: address?.state || "",
      pincode: address?.pincode || "",
      type: address?.type || "home",
    },
  });

  const onSubmit = (data) => {
    if (onSubmitAddress) {
      onSubmitAddress(data);
    }
    onClose();
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-semibold text-primary font-nunito mb-6">
        {address ? "Edit Address" : "Add New Address"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="md:col-span-2">
            <Input
              id="addressLine"
              label="Address Line"
              placeholder="Enter your Address Line"
              error={errors.addressLine?.message}
              {...register("addressLine", {
                required: "Address Line is required",
                minLength: {
                  value: 5,
                  message: "Address line must be at least 5 characters.",
                },
                maxLength: {
                  value: 200,
                  message: "Address line must be at most 200 characters.",
                },
              })}
            />
          </div>
          <Input
            id="landmark"
            label="Landmark"
            placeholder="Enter your Landmark"
            error={errors.landmark?.message}
            {...register("landmark", {
              maxLength: {
                value: 100,
                message: "Landmark can be at most 100 characters.",
              },
            })}
          />
          <Input
            id="city"
            label="City"
            placeholder="Enter your City"
            error={errors.city?.message}
            {...register("city", {
              required: "City is required",
              minLength: {
                value: 2,
                message: "City must be at least 2 characters.",
              },
              maxLength: {
                value: 50,
                message: "City must be at most 50 characters.",
              },
            })}
          />
          <Input
            id="state"
            label="State"
            placeholder="Enter your State"
            error={errors.state?.message}
            {...register("state", {
              required: "State is required",
              minLength: {
                value: 2,
                message: "State must be at least 2 characters.",
              },
              maxLength: {
                value: 50,
                message: "State must be at most 50 characters.",
              },
            })}
          />
          <Input
            id="pincode"
            label="Pincode"
            placeholder="Enter your Pincode"
            error={errors.pincode?.message}
            {...register("pincode", {
              required: "Pincode is required",
              minLength: {
                value: 6,
                message: "Pincode must be 6 digits.",
              },
              maxLength: {
                value: 6,
                message: "Pincode must be 6 digits.",
              },
              pattern: {
                value: /^\d{6}$/,
                message: "Pincode must contain only numbers.",
              },
            })}
          />
          <div className="md:col-span-2">
            {/* Address Type Select */}
            <Select
              label="Address Type"
              id="type"
              {...register("type", {
                required: "Address type is required",
                validate: (value) =>
                  ["home", "work", "other"].includes(value) ||
                  "Invalid address type. Must be 'home', 'work', or 'other'.",
              })}
              error={errors.type?.message}
            >
              <option value="">-- Select Address Type --</option>
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </Select>
          </div>
        </div>
        <div className="mt-8 justify-end flex gap-4 col-span-1 md:col-span-2">
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
            // disabled={loading}
          >
            {address ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
