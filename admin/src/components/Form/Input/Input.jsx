import React from "react";

const Input = ({
  label,
  placeholder = "",
  type = "text",
  className = "",
  readonly = false,
  error,
  id,
  icon, // new icon prop
  required = false, // new prop
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={id}
          className="font-IBM-Plex text-black text-sm mb-1 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`flex items-center rounded-md border transition-all duration-300 
        ${
          error
            ? "border-red-500 focus-within:ring-red-300"
            : "border-gray-300 focus-within:ring-primary"
        }
        ${
          readonly
            ? "bg-gray-100 cursor-not-allowed"
            : "focus-within:ring-2 focus-within:border-transparent shadow-sm hover:shadow-md"
        }
        bg-white`}
      >
        {icon && (
          <span className="pl-3 text-gray-500 flex items-center">{icon}</span>
        )}

        <input
          type={type}
          id={id}
          placeholder={placeholder}
          autoComplete="off"
          readOnly={readonly}
          required={required}
          className={`flex-1 px-4 py-2 rounded-md outline-none bg-transparent text-gray-800 ${className}`}
          {...props}
        />
      </div>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
