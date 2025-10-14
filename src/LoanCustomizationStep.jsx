import React, { useMemo, useState } from "react";
import ProgressHeader from "./components/ProgressHeader.jsx";
import ContinueButton from "./components/ContinueButton.jsx";

/**
 * Loan Customization Step - Responsive Design
 * - Interactive number pad for selecting loan amount
 * - Minimum amount selectable is $100, maximum = pre-approval
 * - Matches existing design system
 */

// Utility helpers
const currency = (n) => {
  const clamped = isNaN(n) ? 0 : n;
  return `$${clamped.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;
};


export default function LoanCustomizationStep({ onContinue, onBack, employmentData, paydateData, initialData = {} }) {
  const preapprovedMax = initialData.preapprovedMax || 1000; // example cap
  const minDraw = 100;

  const [amount, setAmount] = useState(initialData.amount || minDraw);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const apr = 47.42;

  const handleContinue = () => {
    const loanData = {
      amount,
      preapprovedMax,
      apr
    };
    
    if (onContinue) {
      onContinue(loanData);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <ProgressHeader currentStep={3} totalSteps={4} onBack={onBack} />

      <div className="flex-1 p-6">
        <p className="text-xs tracking-wide text-gray-500 mb-8">
          STEP 3 OF 4 – LOAN AMOUNT
        </p>

        <h2 className="text-lg font-semibold mb-6">
          CUSTOMIZE YOUR LINE OF CREDIT
        </h2>

        {/* Pre-approval Info - Static */}
        <div className="mb-8">
          <div className="text-sm text-gray-600 mb-2">You're pre-approved for up to</div>
          <div className="bg-gray-800 rounded-lg p-4 inline-block">
            <div className="text-3xl font-bold text-white">{currency(preapprovedMax)}</div>
          </div>
        </div>

        {/* MINI LINE OF CREDIT - Centered */}
        <div className="text-center mb-8">
          <div className="text-sm font-bold tracking-wide text-gray-900">MINI LINE OF CREDIT</div>
        </div>

        {/* Amount Display - Dynamic */}
        <div className="text-center mb-8">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {amount === 0 ? "0" : currency(amount)}
          </div>
          <div className="text-sm text-gray-500 mb-2">
            You can also edit this later.
          </div>
          <div className="text-sm text-gray-500">
            {currency(minDraw)} minimum • {currency(preapprovedMax)} maximum
          </div>
          {amount < minDraw && amount > 0 && (
            <div className="text-sm text-red-500 mt-2">
              • Below minimum of {currency(minDraw)} CAD
            </div>
          )}
        </div>

        {/* Integrated Number Pad - Compact */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {["1","2","3","4","5","6","7","8","9"].map(d => (
            <button 
              key={d} 
              onClick={() => {
                setHasUserInteracted(true);
                let newAmount;
                if (amount === 0) {
                  newAmount = parseInt(d);
                } else {
                  newAmount = parseInt(String(amount) + d);
                }
                if (newAmount > preapprovedMax) newAmount = preapprovedMax;
                setAmount(newAmount);
              }} 
              className="w-[100px] h-[44px] rounded-lg border border-gray-300 text-gray-900 text-xl font-medium hover:bg-gray-50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-black"
            >
              {d}
            </button>
          ))}
          <div></div>
          <button 
            onClick={() => {
              setHasUserInteracted(true);
              let newAmount;
              if (amount === 0) {
                newAmount = 0;
              } else {
                newAmount = parseInt(String(amount) + "0");
              }
              if (newAmount > preapprovedMax) newAmount = preapprovedMax;
              setAmount(newAmount);
            }} 
            className="w-[100px] h-[44px] rounded-lg border border-gray-300 text-gray-900 text-xl font-medium hover:bg-gray-50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-black"
          >
            0
          </button>
          <button 
            onClick={() => {
              setHasUserInteracted(true);
              const newAmount = Math.floor(amount / 10);
              setAmount(newAmount);
            }} 
            className="w-[100px] h-[44px] rounded-lg border border-gray-300 text-gray-900 text-xl font-medium hover:bg-gray-50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-black"
          >
            ←
          </button>
        </div>
      </div>

      {/* Sticky Continue Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
        <button 
          onClick={handleContinue} 
          disabled={amount < minDraw}
          className={`w-full rounded-lg py-4 font-semibold transition-colors ${
            amount < minDraw
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
