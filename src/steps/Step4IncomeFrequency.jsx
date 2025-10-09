import React, { useState } from "react";
import ProgressHeader from "../components/ProgressHeader.jsx";

export default function Step4IncomeFrequency({ onContinue, onBack, initialData = {} }) {
  const [frequency, setFrequency] = useState(initialData.frequency || "");

  const FREQUENCIES = ["Weekly", "Bi-weekly", "Semi-monthly", "Monthly"];

  const isComplete = frequency !== "";

  const handleContinue = () => {
    if (isComplete) {
      onContinue({ frequency });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col p-6">
      <ProgressHeader currentStep={4} totalSteps={6} onBack={onBack} />

      <p className="text-xs tracking-wide text-gray-500 mb-8">
        STEP 4 OF 6 – INCOME FREQUENCY
      </p>

      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-2">
          What's your income frequency?
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          To set your payment schedule, tell us how you get paid.
        </p>

        <div className="grid grid-cols-1 gap-3">
          {FREQUENCIES.map((f) => (
            <button
              key={f}
              onClick={() => setFrequency(f)}
              className={`text-left rounded-xl px-4 py-4 border hover:bg-neutral-50 transition-colors ${
                frequency === f ? "border-black bg-gray-50" : "border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-lg">{f}</div>
                <div className={`h-5 w-5 rounded-full border-2 ${frequency === f ? "bg-black border-black" : "border-gray-400"}`} />
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {f === "Weekly" && "You're paid once a week on the same weekday."}
                {f === "Bi-weekly" && "You're paid every two weeks on the same weekday."}
                {f === "Semi-monthly" && "You're paid twice a month on fixed dates (e.g., 15th & last day)."}
                {f === "Monthly" && "You're paid once a month on a specific date."}
              </p>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!isComplete}
        className={`mt-8 w-full rounded-lg py-3 font-semibold transition-colors ${
          isComplete
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        CONTINUE
      </button>
    </div>
  );
}

