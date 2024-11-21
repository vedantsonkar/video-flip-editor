import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonPropTypes {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  customClasses?: string;
  disabled?: boolean;
}

const Button: FC<ButtonPropTypes> = ({
  label,
  onClick,
  variant = "primary",
  customClasses,
  disabled = false,
}) => {
  return (
    <button
      title={label}
      aria-label={label}
      onClick={onClick}
      className={twMerge(
        "md:py-[0.563rem] md:px-[0.625rem] py-[0.250rem] px-[0.350rem] rounded-[0.625rem] text-white text-xs md:text-sm font-medium",
        variant === "primary" ? "bg-brandpurple" : "bg-lightgrey",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "opacity-100 cursor-pointer",
        customClasses
      )}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
