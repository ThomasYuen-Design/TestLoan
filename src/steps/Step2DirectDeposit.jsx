import React, { useState } from "react";
import ProgressHeader from "../components/ProgressHeader.jsx";
import ContinueButton from "../components/ContinueButton.jsx";

export default function Step2DirectDeposit({ onContinue, onBack, initialData = {} }) {
  const [directDeposit, setDirectDeposit] = useState(initialData.directDeposit || "");

  const isComplete = directDeposit !== "";

  const handleContinue = () => {
    if (isComplete) {
      onContinue({ directDeposit });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col p-6 pb-24">
      <ProgressHeader currentStep={2} totalSteps={7} onBack={onBack} />

      <p className="text-xs tracking-wide text-gray-500 mb-8">
        STEP 2 OF 7 – PAYMENT METHOD
      </p>

      <h2 className="text-lg font-semibold mb-6">
        DO YOU GET PAID VIA DIRECT DEPOSIT?
      </h2>

      <div className="space-y-3">
        <label 
          className={`flex items-center justify-between px-4 py-4 rounded-lg cursor-pointer transition-colors ${
            directDeposit === "yes" ? "bg-black text-white" : "bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <span className="text-lg">Yes</span>
          <input
            type="radio"
            name="directDeposit"
            value="yes"
            checked={directDeposit === "yes"}
            onChange={(e) => setDirectDeposit(e.target.value)}
            className="w-5 h-5"
          />
        </label>
        <label 
          className={`flex items-center justify-between px-4 py-4 rounded-lg cursor-pointer transition-colors ${
            directDeposit === "no" ? "bg-black text-white" : "bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <span className="text-lg">No</span>
          <input
            type="radio"
            name="directDeposit"
            value="no"
            checked={directDeposit === "no"}
            onChange={(e) => setDirectDeposit(e.target.value)}
            className="w-5 h-5"
          />
        </label>
      </div>

      <ContinueButton onClick={handleContinue} disabled={!isComplete} />
    </div>
  );
}

