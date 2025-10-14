import React, { useState } from "react";
import ProgressHeader from "./components/ProgressHeader.jsx";
import ContinueButton from "./components/ContinueButton.jsx";

export default function EmploymentInfoStep({ onContinue, onBack }) {
  const [employerName, setEmployerName] = useState("");
  const [employerPhone, setEmployerPhone] = useState("");
  const [extension, setExtension] = useState("");
  // Check if form is complete
  const isComplete = employerName && employerPhone;

  const handleContinue = () => {
    if (isComplete && onContinue) {
      onContinue({
        employerName,
        employerPhone,
        extension,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col p-6 pb-24">
      <ProgressHeader currentStep={1} totalSteps={4} onBack={onBack} />

      <p className="text-xs tracking-wide text-gray-500 mb-8">
        STEP 1 OF 4 – ADDITIONAL INFO
      </p>

      <h2 className="text-lg font-semibold mb-4">
        EMPLOYMENT INFO / SOURCE OF INCOME
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1 font-medium">EMPLOYER NAME</label>
          <input
            type="text"
            value={employerName}
            onChange={(e) => setEmployerName(e.target.value)}
            placeholder="Type here..."
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium">EMPLOYER PHONE</label>
          <input
            type="tel"
            value={employerPhone}
            onChange={(e) => setEmployerPhone(e.target.value)}
            placeholder="e.g. (555) 123-4567"
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium">EXTENSION (OPTIONAL)</label>
          <input
            type="text"
            value={extension}
            onChange={(e) => setExtension(e.target.value)}
            placeholder="e.g. 101"
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

      </div>

      <ContinueButton onClick={handleContinue} disabled={!isComplete} />
    </div>
  );
}

