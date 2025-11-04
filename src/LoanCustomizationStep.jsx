import React, { useMemo, useState } from "react";
import ProgressHeader from "./components/ProgressHeader.jsx";
import ContinueButton from "./components/ContinueButton.jsx";
import { Lock, MessageCircle, Edit } from "lucide-react";

/**
 * Loan Customization Step - Responsive Design
 * - Desktop: Direct input with keyboard
 * - Mobile: Interactive number pad for selecting loan amount
 * - Minimum amount selectable is $100, maximum = pre-approval
 */

// Utility helpers
const currency = (n) => {
  const clamped = isNaN(n) ? 0 : n;
  return `$${clamped.toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;
};


export default function LoanCustomizationStep({ onContinue, onBack, employmentData, paydateData, initialData = {} }) {
  const preapprovedMax = initialData.preapprovedMax || 300; // example cap
  const minDraw = 100;

  const [amount, setAmount] = useState(initialData.amount || preapprovedMax);
  const [inputValue, setInputValue] = useState(String(initialData.amount || preapprovedMax));
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const apr = 47.42;

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(value);
    const numValue = parseInt(value) || 0;
    if (numValue <= preapprovedMax) {
      setAmount(numValue);
    } else {
      setAmount(preapprovedMax);
      setInputValue(String(preapprovedMax));
    }
    setHasUserInteracted(true);
  };

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
      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10">
          <ProgressHeader currentStep={3} totalSteps={6} onBack={onBack} />

          <p className="text-xs tracking-wide text-gray-500 mb-8">
            STEP 3 OF 6 – LINE OF CREDIT AMOUNT
          </p>

          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Left Column - Main Form */}
            <div className="space-y-6">
              {/* Pre-approval Info */}
              <div>
                <div className="text-sm text-gray-600 mb-2">You're pre-approved for up to</div>
                <div className="bg-gray-700 rounded-lg p-4 inline-block">
                  <div className="text-3xl font-bold text-white">{currency(preapprovedMax)}</div>
                </div>
              </div>

              {/* MINI LINE OF CREDIT */}
              <div>
                <div className="text-sm text-gray-600 mb-3">MINI LINE OF CREDIT</div>
                
                {/* Desktop: Direct Input */}
                <div className="hidden lg:block">
                  <div className="relative">
                    <input
                      type="text"
                      value={`$${inputValue}`}
                      onChange={handleInputChange}
                      className="w-full text-5xl font-bold border border-gray-300 rounded-lg px-6 py-4 focus:outline-none focus:ring-2 focus:ring-black"
                      style={{ letterSpacing: '-0.02em' }}
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-400">
                      <Edit className="w-5 h-5" />
                      <span className="text-sm">Edit</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    You can also edit this later.
                  </div>
                  {amount < minDraw && (
                    <div className="text-sm text-red-500 mt-2 flex items-center gap-1">
                      <span>•</span>
                      <span>Below minimum of {currency(minDraw)} CAD</span>
                    </div>
                  )}
                </div>

                {/* Mobile: Number Pad */}
                <div className="lg:hidden">
                  <div className="text-center mb-6">
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

                  {/* Number Pad */}
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
                          setInputValue(String(newAmount));
                        }} 
                        className="w-full h-[44px] rounded-lg border border-gray-300 text-gray-900 text-xl font-medium hover:bg-gray-50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-black"
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
                        setInputValue(String(newAmount));
                      }} 
                      className="w-full h-[44px] rounded-lg border border-gray-300 text-gray-900 text-xl font-medium hover:bg-gray-50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      0
                    </button>
                    <button 
                      onClick={() => {
                        setHasUserInteracted(true);
                        const newAmount = Math.floor(amount / 10);
                        setAmount(newAmount);
                        setInputValue(String(newAmount));
                      }} 
                      className="w-full h-[44px] rounded-lg border border-gray-300 text-gray-900 text-xl font-medium hover:bg-gray-50 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      ←
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Summary Panel */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-bold">SUMMARY</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">PRE-APPROVED</span>
                    <span className="font-semibold">{currency(preapprovedMax)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ADVANCE AMOUNT</span>
                    <span className="font-semibold">{currency(amount)}</span>
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  disabled={amount < minDraw}
                  className={`w-full rounded-lg py-4 font-semibold transition-colors mt-6 ${
                    amount < minDraw
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  CONTINUE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-6 md:px-8 lg:px-10 mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            {/* Left Column */}
            <div>
              <div className="mb-4">
                <a href="#" className="text-white hover:underline text-sm">Privacy Policy</a>
                {" | "}
                <a href="#" className="text-white hover:underline text-sm">Terms</a>
              </div>
              <p className="text-xs text-gray-400">
                ©2025 Mogo Finance Technology Inc. All rights reserved.
              </p>
            </div>

            {/* Middle Column - Testimonial */}
            <div>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-green-500">★</span>
                ))}
              </div>
              <p className="text-sm mb-2">
                "Experienced people that are doing an excellent job. Easy quick service."
              </p>
              <p className="text-xs text-gray-400">Heather B</p>
              <p className="text-xs text-gray-500">Jul 18, 2025</p>
            </div>

            {/* Right Column - Security Badge */}
            <div>
              <div className="bg-white text-black rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold mb-1">
                      SINCE 2003, MORE THAN 2M CANADIANS HAVE JOINED MOGO.
                    </p>
                    <p className="text-xs">
                      Your privacy and security come first — every step of the way.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Licensing Info */}
          <div className="text-xs text-gray-500 text-center md:text-left">
            Mogo Financial Inc. holds high-cost credit licences where required: BC 83658 | AB 349152 | MB 66167
          </div>
        </div>

        {/* Chat Button */}
        <button className="fixed bottom-6 right-6 bg-gray-700 hover:bg-gray-600 text-white rounded-full p-3 shadow-lg transition-colors">
          <MessageCircle className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
}
