import React, { useState } from "react";
import ProgressHeader from "./components/ProgressHeader.jsx";

export default function EmploymentInfoStep({ onContinue, onBack }) {
  const [employerName, setEmployerName] = useState("");
  const [employerPhone, setEmployerPhone] = useState("");
  const [extension, setExtension] = useState("");
  const [directDeposit, setDirectDeposit] = useState("");
  const [bank, setBank] = useState("");

  const banks = [
    "RBC",
    "TD",
    "Scotiabank",
    "BMO",
    "CIBC",
    "National Bank",
    "Other",
  ];

  // Check if form is complete
  const isComplete = employerName && employerPhone && directDeposit && bank;

  const handleContinue = () => {
    if (isComplete && onContinue) {
      onContinue({
        employerName,
        employerPhone,
        extension,
        directDeposit,
        bank,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col p-6">
      <ProgressHeader currentStep={1} totalSteps={6} onBack={onBack} />

      <p className="text-xs tracking-wide text-gray-500 mb-8">
        STEP 1 OF 6 – ADDITIONAL INFO
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

        <div>
          <label className="block text-sm mb-2 font-medium">
            DO YOU GET PAID VIA DIRECT DEPOSIT?
          </label>
          <div className="space-y-2">
            <label 
              className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                directDeposit === "yes" ? "bg-gray-200" : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <span>Yes</span>
              <input
                type="radio"
                name="directDeposit"
                value="yes"
                checked={directDeposit === "yes"}
                onChange={(e) => setDirectDeposit(e.target.value)}
                className="w-4 h-4"
              />
            </label>
            <label 
              className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                directDeposit === "no" ? "bg-gray-200" : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <span>No</span>
              <input
                type="radio"
                name="directDeposit"
                value="no"
                checked={directDeposit === "no"}
                onChange={(e) => setDirectDeposit(e.target.value)}
                className="w-4 h-4"
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium">
            WHERE IS YOUR PAYROLL/INCOME DEPOSITED?
          </label>
          <select
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="">Select your bank</option>
            {banks.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
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

