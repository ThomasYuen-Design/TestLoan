import React, { useState } from "react";
import { Lock, MessageCircle, Edit, Info, Clock } from "lucide-react";
import ProgressHeader from "./components/ProgressHeader.jsx";

export default function CheckoutStep({ onContinue, onBack, loanData, fundingData }) {
  const [consent, setConsent] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const amount = loanData?.amount || 300;
  const firstPaymentDate = "Apr 03";
  const firstPaymentAmount = 30.16;
  const fundingMethod = fundingData?.method === "etransfer" ? "INTERAC E-TRANSFER" : "DIRECT DEPOSIT";
  const deliveryTime = fundingData?.method === "etransfer" ? "Same day" : "1-3 business days";

  const handleCheckout = () => {
    if (consent && onContinue) {
      onContinue({ consent });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10">
          <ProgressHeader currentStep={6} totalSteps={6} onBack={onBack} />

          <p className="text-xs tracking-wide text-gray-500 mb-8">
            STEP 6 OF 6 – CHECK OUT
          </p>

          <div className="grid lg:grid-cols-[1fr,450px] gap-8">
            {/* Left Column - Line of Credit Details */}
            <div className="space-y-6">
              {/* Approval Banner */}
              <div className="bg-gray-100 border-l-4 border-green-500 p-4 rounded-r-lg">
                <p className="text-base font-semibold text-gray-900">
                  You're approved! Bank account verified.
                </p>
              </div>

              {/* Review Instructions */}
              <p className="text-base text-gray-900">
                Please review your line of credit details below.
              </p>

              {/* Mini Line of Credit Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold tracking-wide">
                  MINI LINE OF CREDIT
                </h2>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Your line of credit amount:</p>
                  <div className="flex items-center gap-3">
                    <span className="text-5xl font-bold text-gray-900">
                      ${amount}
                    </span>
                    <button 
                      onClick={() => setShowEditModal(true)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">First minimum payment</p>
                    <p className="text-lg font-semibold">{firstPaymentDate}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold">${firstPaymentAmount.toFixed(2)}</p>
                      <Info className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>
                </div>

                {/* Payment Type */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-600 mb-2 tracking-wide">
                    PAYMENT TYPE
                  </p>
                  <p className="text-base font-semibold mb-1">{fundingMethod}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{deliveryTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Consent & Checkout */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="border border-gray-300 rounded-lg p-6 space-y-6">
                {/* Statements Info */}
                <div className="bg-gray-100 rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-bold tracking-wide">
                    STATEMENTS & MINIMUM PAYMENTS
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-900">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-600 mt-1">•</span>
                      <span>
                        You'll get your Mini Line of Credit statement about one week before your due date.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-600 mt-1">•</span>
                      <span>
                        Minimum payments are automatically withdrawn from your bank account, no action needed.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Consent Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-5 w-5 accent-black cursor-pointer"
                  />
                  <span className="text-sm text-gray-900">
                    I CONSENT to Mogo using my personal information to obtain a credit score or report from a credit reporting agency for this credit application.
                  </span>
                </label>

                {/* Privacy Statement */}
                <p className="text-xs text-gray-700">
                  Your privacy and security are important to us.{' '}
                  <a href="#" className="text-blue-600 underline hover:text-blue-800">
                    Privacy Policy
                  </a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 underline hover:text-blue-800">
                    Terms of Use
                  </a>.
                </p>

                {/* Important Notice */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">IMPORTANT</h4>
                  <p className="text-xs text-gray-700">
                    Previously, Mogo performed a soft credit check. At this stage, we will perform a hard credit check. This hard credit check will not change your pre-approval amount.
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={!consent}
                  className={`w-full rounded-lg py-4 font-semibold transition-colors ${
                    !consent
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  CHECKOUT
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

