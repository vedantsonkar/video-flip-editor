import React, { useCallback } from "react";
import { twMerge } from "tailwind-merge";

interface DropDownProps {
  options: { label: string; value: string }[];
  selectedValue: string;
  onOptionSelect: (selectedValue: string) => void;
  className?: string;
  activeClassName?: string;
  prefixText?: string;
}

const DropDown: React.FC<DropDownProps> = ({
  options,
  selectedValue,
  onOptionSelect,
  className = "bg-darkgrey hover:bg-gray-300 text-sm px-2 py-1 rounded-sm text-white",
  activeClassName = "bg-blue-300 text-white",
  prefixText,
}) => {
  const handleClick = useCallback(
    (value: string) => {
      onOptionSelect(value);
    },
    [onOptionSelect]
  );

  return (
    <div className="relative flex items-center bg-darkgrey border border-[#45474E] py-[0.438rem] px-[0.625rem] rounded-md">
      {prefixText && (
        <span className="text-sm text-white mr-2" title={prefixText}>
          {prefixText}
        </span>
      )}
      <select
        className="bg-transparent text-sm appearance-none focus:outline-none text-gray-500 px-4"
        value={selectedValue}
        onChange={(e) => handleClick(e.target.value)}
      >
        {options?.map((item) => (
          <option
            key={item.value}
            value={item.value}
            className={twMerge(
              className,
              selectedValue === item.value && activeClassName
            )}
            title={item?.label}
          >
            {item?.label}
          </option>
        ))}
      </select>
      <div className="absolute right-2 pointer-events-none">
        <svg
          className="w-4 h-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default DropDown;
