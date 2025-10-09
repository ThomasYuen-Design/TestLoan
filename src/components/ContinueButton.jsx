import React from "react";

export default function ContinueButton({ onClick, disabled, children = "CONTINUE" }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg border-t border-gray-100">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full rounded-lg py-3 font-semibold transition-colors ${
          disabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {children}
      </button>
    </div>
  );
}
