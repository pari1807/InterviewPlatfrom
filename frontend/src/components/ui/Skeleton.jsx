import React from "react";

export function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-lg ${className}`}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 bg-slate-200 rounded-xl" />
        <div className="w-16 h-6 bg-slate-200 rounded-full" />
      </div>
      <div className="h-6 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
      <div className="pt-4 border-t border-slate-100 flex justify-between">
        <div className="w-20 h-4 bg-slate-200 rounded" />
        <div className="w-16 h-4 bg-slate-200 rounded" />
      </div>
    </div>
  );
}
