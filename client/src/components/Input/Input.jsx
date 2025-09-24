import React from "react";

const Input = ({
  label,
  placeholder = "",
  type = "text",
  className = "",
  labelColor = "",
  readonly = false,
  error,
  id,
  disabled = false,
  icon, // left icon
  rightIcon, // NEW right icon (for eye toggle etc.)
  prefix,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full relative">
      {label && (
        <label
          htmlFor={id}
          className={`font-IBM-Plex text-black text-sm mb-1 ${labelColor}`}
        >
          {label}
        </label>
      )}

      <div
        className={`flex items-center rounded-md border transition-all duration-300 relative
        ${
          error
            ? "border-red-500"
            : disabled
            ? "border-gray-200"
            : "border-gray-300 focus-within:ring-primary"
        }
        ${
          readonly || disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "focus-within:ring-2 focus-within:border-transparent shadow-sm hover:shadow-md bg-white"
        }`}
      >
        {/* Left Icon */}
        {icon && (
          <span
            className={`pl-3 flex items-center ${
              disabled ? "text-gray-400" : "text-primary"
            }`}
          >
            {icon}
          </span>
        )}

        {/* Prefix */}
        {prefix && <span className="pl-2 pr-1 text-gray-500">{prefix}</span>}

        {/* Input Field */}
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          autoComplete="off"
          readOnly={readonly || disabled}
          disabled={disabled}
          className={`flex-1 px-4 py-2 rounded-md outline-none bg-transparent text-gray-800
            ${
              disabled
                ? "cursor-not-allowed placeholder-gray-400 text-gray-500"
                : ""
            }
            ${className}`}
          {...props}
        />

        {/* Right Icon (like Eye toggle) */}
        {rightIcon && (
          <span className="absolute right-3 flex items-center cursor-pointer">
            {rightIcon}
          </span>
        )}
      </div>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
