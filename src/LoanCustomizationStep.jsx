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
  return clamped.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
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
    <div className="min-h-screen bg-white text-black flex flex-col p-6 pb-24">
      <ProgressHeader currentStep={3} totalSteps={4} onBack={onBack} />

      <p className="text-xs tracking-wide text-gray-500 mb-8">
        STEP 3 OF 4 – LOAN AMOUNT
      </p>

      <h2 className="text-lg font-semibold mb-6">
        CUSTOMIZE YOUR LINE OF CREDIT
      </h2>

      {/* Pre-approval Info - Static */}
      <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
        <div className="text-sm text-gray-600">You're pre-approved for up to</div>
        <div className="text-3xl font-bold text-gray-900">{currency(preapprovedMax)}</div>
      </div>

      {/* Amount Display - Dynamic */}
      <div className="mb-8">
        <div className="text-5xl font-bold text-gray-900 mb-2">
          {amount === 0 ? "0" : currency(amount)}
        </div>
        <div className="text-sm text-gray-500">
          {currency(minDraw)} minimum • {currency(preapprovedMax)} maximum
        </div>
        {amount < minDraw && amount > 0 && (
          <div className="text-sm text-red-500 mt-2">
            • Below minimum of {currency(minDraw)}
          </div>
        )}
        {amount === 0 && (
          <div className="text-sm text-gray-400 mt-2">
            • Enter your desired loan amount
          </div>
        )}
      </div>

      {/* APR Info */}
      <div className="mb-8">
        <p className="text-xs text-gray-500">
          Based on bi‑weekly payments, APR of {apr}% not including optional services and fees.
        </p>
      </div>

      {/* Loan Product Info */}
      <div className="border border-gray-200 rounded-lg p-4 mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold tracking-wide text-gray-900">MINI MONEY</h3>
          <span className="text-sm text-gray-500">Everyday Loan</span>
        </div>
        <p className="text-xs text-gray-500">
          You can edit this amount later.
        </p>
      </div>

      {/* Integrated Number Pad */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {["1","2","3","4","5","6","7","8","9","0"].map(d => (
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
            className="aspect-square rounded-lg border border-gray-300 text-gray-900 text-2xl font-medium hover:bg-gray-50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-black"
          >
            {d}
          </button>
        ))}
        <button 
          onClick={() => {
            setHasUserInteracted(true);
            const newAmount = Math.floor(amount / 10);
            setAmount(newAmount);
          }} 
          className="aspect-square rounded-lg border border-gray-300 text-gray-900 text-2xl font-medium hover:bg-gray-50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-black"
        >
          ←
        </button>
        <button 
          onClick={() => {
            setHasUserInteracted(true);
            setAmount(preapprovedMax);
          }} 
          className="aspect-square rounded-lg border border-gray-300 text-gray-900 text-sm font-medium hover:bg-gray-50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-black"
        >
          MAX
        </button>
      </div>

      {/* Quick Amount Buttons */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-3">Quick amounts:</p>
        <div className="grid grid-cols-4 gap-2">
          {[100, 250, 500, 1000].map(quickAmount => (
            <button
              key={quickAmount}
              onClick={() => {
                setHasUserInteracted(true);
                setAmount(quickAmount);
              }}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-black"
            >
              {currency(quickAmount)}
            </button>
          ))}
        </div>
      </div>

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
  );
}
