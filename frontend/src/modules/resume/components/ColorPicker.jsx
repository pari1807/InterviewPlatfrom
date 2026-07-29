import React, { useState } from "react";
import { Check, Palette } from "lucide-react";

const ColorPicker = ({ selectedColor, onChange }) => {
  const colors = [
    { name: "Emerald", value: "#10b981" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Red", value: "#ef4444" },
    { name: "Yellow", value: "#facc15" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Teal", value: "#14b8a6" },
    { name: "Orange", value: "#f97316" },
    { name: "Indigo", value: "#6366f1" },
    { name: "Gray", value: "#6b7280" },
    { name: "Cyan", value: "#06b6d4" },
    { name: "Lime", value: "#84cc16" },
    { name: "Rose", value: "#f43f5e" },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:border-purple-300 transition-all px-3 py-2 rounded-xl"
      >
        <Palette size={16} />
        <span className="max-sm:hidden">Accent Color</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-72 rounded-2xl bg-white border border-gray-200 shadow-xl p-4 z-50">
          <div className="grid grid-cols-4 gap-4">
            {colors.map((color) => (
              <div
                key={color.value}
                onClick={() => {
                  onChange(color.value);
                  setIsOpen(false);
                }}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div
                  className="relative w-12 h-12 rounded-full border-2 border-transparent group-hover:border-gray-400 transition"
                  style={{ backgroundColor: color.value }}
                >
                  {selectedColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>

                <span className="text-[11px] mt-2 text-gray-600">
                  {color.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;