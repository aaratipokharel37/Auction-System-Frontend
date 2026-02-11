// components/PrimaryButton.jsx
import React from "react";
import { Loader2 } from "lucide-react";

const PrimaryButton = ({
  children,
  isPending = false,
  disabled = false,
  rightIcon,
  className = "",
  ...props
}) => {
  return (
    <button
      disabled={disabled || isPending}
      className={[
        "group w-full py-3.5 rounded-xl font-semibold text-white text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-200",
        "bg-gradient-to-r from-yellow-500 to-yellow-700 shadow-lg shadow-yellow-500/30",
        "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-yellow-500/40 active:translate-y-0",
        isPending || disabled ? "opacity-50 cursor-not-allowed" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {isPending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {children}
          {rightIcon && rightIcon}
        </>
      )}
    </button>
  );
};

export default PrimaryButton;
