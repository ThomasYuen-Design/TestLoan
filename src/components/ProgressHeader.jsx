import React from "react";
import { ChevronLeft } from "lucide-react";

export default function ProgressHeader({ currentStep, totalSteps, onBack }) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-sm text-gray-600 font-medium min-w-[60px] text-right">
          {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  );
}

