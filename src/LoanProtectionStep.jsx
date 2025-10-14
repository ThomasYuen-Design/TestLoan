import React, { useState } from "react";
import ProgressHeader from "./components/ProgressHeader.jsx";
import ContinueButton from "./components/ContinueButton.jsx";

export default function LoanProtectionStep({ onContinue, onBack, employmentData, paydateData, loanData, initialData = {} }) {
  const [loanProtection, setLoanProtection] = useState(initialData.loanProtection || false);

  const handleContinue = () => {
    const protectionData = {
      loanProtection
    };
    
    // Complete application
    const completeApplicationData = {
      employment: employmentData,
      paydate: paydateData,
      loan: { ...loanData, ...protectionData }
    };
    
    console.log("Complete application data:", completeApplicationData);
    alert("Application complete! " + JSON.stringify(completeApplicationData, null, 2));
    
    if (onContinue) {
      onContinue(protectionData);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col p-6 pb-24">
      <ProgressHeader currentStep={4} totalSteps={4} onBack={onBack} />

      <p className="text-xs tracking-wide text-gray-500 mb-8">
        STEP 4 OF 4 – LOAN PROTECTION
      </p>

      <h2 className="text-lg font-semibold mb-6">
        FINALIZE YOUR APPLICATION
      </h2>

      <div className="space-y-6">
        {/* Repayment Info */}
        <div>
          <h3 className="text-sm font-bold tracking-wide text-gray-900 mb-3">YOUR REPAYMENT PAYMENTS</h3>
          <p className="text-sm text-gray-600">
            Mini Money is recommended for short‑term use but you have the flexibility to pay it back whenever you like. Just contact us when you're ready to make a payment. After it's paid back you can re‑access it on demand.
          </p>
        </div>

        {/* Loan Protection */}
        <div>
          <h3 className="text-sm font-bold tracking-wide text-gray-900 mb-3">LOAN PROTECTION</h3>
          <label className="flex cursor-pointer items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 accent-black"
              checked={loanProtection}
              onChange={(e) => setLoanProtection(e.target.checked)}
            />
            <div>
              <div className="font-medium text-gray-900">I want to participate in the loan balance protection plan.</div>
              <p className="mt-1 text-sm text-gray-600">
                We strongly recommend loan protection. Protect yourself and your loved ones from damaged credit in the event that you are laid off, injured, critically ill or pass away and can't repay your loan.{' '}
                <button className="underline text-blue-600 hover:text-blue-800">Learn more</button>
              </p>
            </div>
          </label>
        </div>

        {/* Usage Info */}
        <div>
          <h3 className="text-sm font-bold tracking-wide text-gray-900 mb-3">WHEN TO USE MINI MONEY</h3>
          <p className="text-sm text-gray-600">
            When used short‑term, Mini Money is a cost effective alternative to overspending on a credit card, bouncing a cheque, going into overdraft or using a payday loan.
          </p>
        </div>
      </div>

      <ContinueButton onClick={handleContinue}>COMPLETE APPLICATION</ContinueButton>
    </div>
  );
}
