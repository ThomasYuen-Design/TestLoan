import React, { useState } from "react";
import ProgressHeader from "./components/ProgressHeader.jsx";
import ContinueButton from "./components/ContinueButton.jsx";
import { Lock, MessageCircle } from "lucide-react";

export default function LoanProtectionStep({ onContinue, onBack, employmentData, paydateData, loanData, initialData = {} }) {
  const [loanProtection, setLoanProtection] = useState(initialData.loanProtection || false);

  const handleContinue = () => {
    const protectionData = {
      loanProtection
    };
    
    if (onContinue) {
      onContinue(protectionData);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10">
          <ProgressHeader currentStep={4} totalSteps={6} onBack={onBack} />

          <p className="text-xs tracking-wide text-gray-500 mb-8">
            STEP 4 OF 6 – LINE OF CREDIT AMOUNT
          </p>

          <div className="grid lg:grid-cols-[1fr,450px] gap-8">
            {/* Left Column - Features */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold tracking-wide">
                MINI LINE OF CREDIT FEATURES
              </h2>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-black mt-1">•</span>
                  <span className="text-base">Flexible payments, not fixed payments</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-black mt-1">•</span>
                  <span className="text-base">Borrow only what you need</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-black mt-1">•</span>
                  <span className="text-base">Repay anytime without penalties</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-black mt-1">•</span>
                  <span className="text-base">Whatever you pay down becomes available again in your Mogo account</span>
                </li>
              </ul>
            </div>

            {/* Right Column - Protection Plan */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                <h3 className="text-base font-bold tracking-wide">
                  LINE OF CREDIT PROTECTION
                </h3>

                {/* Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 accent-black cursor-pointer"
                    checked={loanProtection}
                    onChange={(e) => setLoanProtection(e.target.checked)}
                  />
                  <div className="text-sm">
                    Please present me with the features & benefits of the optional Line of Credit Balance Protection Plan.
                  </div>
                </label>

                {/* Description */}
                <div className="space-y-3 text-sm text-gray-900">
                  <p>
                    Mogo strongly recommends protecting your line of credit. Protect yourself and your loved ones in the event that you are laid off, injured, critically ill or pass away and can't repay your debt. Coverage also includes Lifetime Milestones and Unpaid Family Leave.{' '}
                    <button className="text-blue-600 underline hover:text-blue-800">
                      Learn more
                    </button>
                  </p>

                  <p className="text-xs text-gray-700">
                    The optional Line of Credit Protection Plan is a Credit Group Insurance Plan Underwritten by Canadian Premier Life Insurance Company and Canadian Premier General Insurance Company.
                  </p>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  className="w-full rounded-lg py-4 font-semibold bg-black text-white hover:bg-gray-800 transition-colors mt-6"
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
