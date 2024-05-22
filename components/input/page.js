import React from "react";

const Input = ({
  label = " ",
  name = " ",
  type = "text",
  placeholder = " ",
  className = " ",
  inputClassName = " ",
  isRequired = true,
  value = "",
  onChange = () => {},
}) => {
  return (
    <div className={`w-1/2 ${className}`}>
      <label htmlFor={name} className="block mb-0 text-sm font-medium text-gray-800">
        {label}
      </label>
      <input
        type={type}
        id={name}
        className={`bg-gray-50 border border-gray-300 focus:border-blue-500 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2 ${inputClassName}`}
        placeholder={placeholder}
        required={isRequired}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;





