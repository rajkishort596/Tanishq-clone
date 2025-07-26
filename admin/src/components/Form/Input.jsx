import React from "react";

const Input = ({
  id,
  type = "text",
  icon: Icon,
  placeholder,
  error,
  register,
  label,
  ...rest
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-[var(--color-grey3)] mb-2"
    >
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold h-5 w-5" />
      )}
      <input
        id={id}
        type={type}
        autoComplete="off"
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-3 rounded-md bg-[#160c05] text-grey1 border ${
          error ? "border-red-500" : "border-[#160c05]"
        } focus:outline-none focus:ring-1 focus:ring-gold`}
        {...register}
        {...rest}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
  </div>
);

export default Input;
