import React from "react";

export function Badge({ children, variant = "default", size = "md", className = "", ...props }) {
  const baseClasses = "inline-flex items-center font-medium rounded-full transition-colors";
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  };

  const variantClasses = {
    default: "bg-slate-100 text-slate-700 border border-slate-200",
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold",
    primary: "bg-emerald-600 text-white shadow-sm",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    error: "bg-rose-50 text-rose-700 border border-rose-200",
    ghost: "bg-slate-50 text-slate-600 border border-slate-200/50",
    active: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 animate-pulse",
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${
        variantClasses[variant] || variantClasses.default
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export function getDifficultyBadgeVariant(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "emerald";
    case "medium":
      return "warning";
    case "hard":
      return "error";
    default:
      return "ghost";
  }
}
