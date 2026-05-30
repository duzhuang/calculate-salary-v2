"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Record<string, string>;
  excludeKeys?: string[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, options, excludeKeys = ["0"], className = "", id, ...props },
    ref
  ) => {
    const selectId = id || label?.replace(/\s/g, "-").toLowerCase();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full px-3 py-2.5 min-h-[44px] text-base border rounded-md appearance-none bg-white
            transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${error ? "border-red-500" : "border-gray-300"}
            ${className}`}
          {...props}
        >
          {Object.entries(options)
            .filter(([key]) => !excludeKeys.includes(key))
            .map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
