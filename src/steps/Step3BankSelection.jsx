import React, { useState } from "react";
import ProgressHeader from "../components/ProgressHeader.jsx";
import ContinueButton from "../components/ContinueButton.jsx";

export default function Step3BankSelection({ onContinue, onBack, initialData = {} }) {
  const [bank, setBank] = useState(initialData.bank || "");

  const banks = [
    "RBC",
    "TD",
    "Scotiabank",
    "BMO",
    "CIBC",
    "National Bank",
    "Other",
  ];

  const isComplete = bank !== "";

  const handleContinue = () => {
    if (isComplete) {
      onContinue({ bank });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col p-6 pb-24">
      <ProgressHeader currentStep={3} totalSteps={6} onBack={onBack} />

      <p className="text-xs tracking-wide text-gray-500 mb-8">
        STEP 3 OF 6 – BANK INFORMATION
      </p>

      <h2 className="text-lg font-semibold mb-6">
        WHERE IS YOUR PAYROLL/INCOME DEPOSITED?
      </h2>

      <div className="space-y-3">
        {banks.map((b) => (
          <label 
            key={b}
            className={`flex items-center justify-between px-4 py-4 rounded-lg cursor-pointer transition-colors ${
              bank === b ? "bg-black text-white" : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <span className="text-lg">{b}</span>
            <input
              type="radio"
              name="bank"
              value={b}
              checked={bank === b}
              onChange={(e) => setBank(e.target.value)}
              className="w-5 h-5"
            />
          </label>
        ))}
      </div>

      <ContinueButton onClick={handleContinue} disabled={!isComplete} />
    </div>
  );
}

