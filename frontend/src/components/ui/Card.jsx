import React from "react";

export function Card({ children, className = "", hover = true, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm ${
        hover ? "card-hover-effect" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }) {
  return (
    <div className={`p-6 border-b border-slate-100 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "", ...props }) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }) {
  return (
    <div className={`p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl ${className}`} {...props}>
      {children}
    </div>
  );
}
