import React from "react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5 font-semibold",
    icon: "p-2 text-sm",
  };

  const variantClasses = {
    primary:
      "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
    emeraldGradient:
      "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
    secondary:
      "bg-slate-900 hover:bg-slate-800 text-white shadow-sm hover:-translate-y-0.5",
    outline:
      "bg-white hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 shadow-sm",
    ghost:
      "bg-transparent hover:bg-slate-100/80 text-slate-600 hover:text-slate-900",
    emeraldGhost:
      "bg-emerald-50/60 hover:bg-emerald-100/80 text-emerald-700 border border-emerald-200/50",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:-translate-y-0.5",
  };

  return (
    <button
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
        variantClasses[variant] || variantClasses.primary
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
