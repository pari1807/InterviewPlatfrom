import React from "react";

export function Progress({ value = 0, max = 100, className = "", variant = "emerald" }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantClasses = {
    emerald: "bg-emerald-500",
    gradient: "bg-gradient-to-r from-emerald-500 to-teal-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };

  return (
    <div className={`w-full bg-slate-100 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className={`h-full transition-all duration-500 ease-out rounded-full ${
          variantClasses[variant] || variantClasses.emerald
        }`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
