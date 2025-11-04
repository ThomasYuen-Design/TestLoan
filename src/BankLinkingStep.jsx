import React, { useState } from "react";
import { Lock, MessageCircle, AlertCircle, Plus, Minus } from "lucide-react";
import ProgressHeader from "./components/ProgressHeader.jsx";

export default function BankLinkingStep({ onContinue, onBack }) {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleContinue = () => {
    if (onContinue) {
      onContinue({});
    }
  };

  const faqs = [
    {
      question: "Is Flinks secure?",
      answer: "Yes, Flinks uses bank-level encryption and security standards. Your data is protected with the same 256-bit encryption that Canadian banks use."
    },
    {
      question: "Is my data private?",
      answer: "Absolutely. Flinks never stores or shares your banking credentials. We only receive read-only access to verify your account and transactions. Your login details remain completely private."
    },
    {
      question: "How does it work?",
      answer: "Flinks securely connects to your bank using your credentials. It retrieves the information we need to verify your account and income, then the connection is closed. The entire process takes just a few minutes."
    }
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10">
          <ProgressHeader currentStep={6} totalSteps={7} onBack={onBack} />

          <p className="text-xs tracking-wide text-gray-500 mb-8">
            STEP 6 OF 7 – BANK ACCOUNT INFO
          </p>

          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Left Column - Main Content */}
            <div className="space-y-6">
              <h1 className="text-2xl font-bold tracking-wide">
                SECURELY LINK YOUR BANK
              </h1>

              <p className="text-base text-gray-900">
                To finalize your line of credit, securely link your bank to confirm your income and account details. Select the account where your payroll/income is deposited.
              </p>

              {/* Flinks Info Box */}
              <div className="bg-gray-100 rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Bank linking powered by</span>
                  <svg width="60" height="20" viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10Z" fill="#0066FF"/>
                    <path d="M25 4H28V16H25V4ZM31 7H34V16H31V7ZM37 4H40V16H37V4ZM43 10H46V16H43V10Z" fill="#0066FF"/>
                    <text x="50" y="14" fontSize="10" fill="#0066FF" fontWeight="600">flinks</text>
                  </svg>
                </div>

                <p className="text-sm text-gray-900">
                  To complete your application, we use Flinks, a Canadian company trusted by banks and lenders across North America, to verify your account.
                </p>

                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Lock className="w-4 h-4 text-gray-700 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-900">
                      <strong>Temporary, read-only access</strong> — we only receive the information needed to verify your account and transactions
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Lock className="w-4 h-4 text-gray-700 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-900">
                      <strong>No transactions possible</strong> — neither Mogo nor Flinks can move or change money in your bank account
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Lock className="w-4 h-4 text-gray-700 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-900">
                      <strong>Bank-level encryption</strong> — your information is protected with 256-bit encryption, the same security standard Canadian banks use
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Lock className="w-4 h-4 text-gray-700 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-900">
                      <strong>Your credentials are never stored or shared</strong> — login details remain private to you
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Lock className="w-4 h-4 text-gray-700 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-900">
                      <strong>Trusted across Canada</strong> — Flinks is Canadian-owned, backed by National Bank of Canada, and used by 1 in 3 adult Canadians to securely link their bank
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-gray-700 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-900">
                      <strong>This just takes a few quick minutes.</strong>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Mobile: Continue Button */}
              <div className="lg:hidden">
                <button
                  onClick={handleContinue}
                  className="w-full rounded-lg py-4 font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
                >
                  CONTINUE
                </button>
                <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-600">
                  <Lock className="w-4 h-4" />
                  <span>You'll securely connect your bank with Flinks next.</span>
                </div>
              </div>

              {/* Desktop: Trust Statement and FAQ */}
              <div className="hidden lg:block space-y-6 mt-8">
                <p className="text-sm text-gray-700">
                  Since 2003, more than 2M Canadians have joined Mogo. Your privacy and security come first — every step of the way.
                </p>

                {/* FAQ Section */}
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedFaq === index ? (
                          <Minus className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        ) : (
                          <Plus className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        )}
                      </button>
                      {expandedFaq === index && (
                        <div className="px-4 pb-4 text-sm text-gray-700">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Desktop Continue Panel */}
            <div className="hidden lg:block lg:sticky lg:top-8 lg:self-start">
              <div className="border border-gray-300 rounded-lg p-6 space-y-4">
                <button
                  onClick={handleContinue}
                  className="w-full rounded-lg py-4 font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
                >
                  CONTINUE
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="w-4 h-4 flex-shrink-0" />
                  <span>You'll securely connect your bank with Flinks next.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Trust Statement and FAQ */}
          <div className="lg:hidden space-y-6 mt-8">
            <p className="text-sm text-gray-700">
              Since 2003, more than 2M Canadians have joined Mogo. Your privacy and security come first — every step of the way.
            </p>

            {/* FAQ Section */}
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-300 rounded-lg">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {expandedFaq === index ? (
                      <Minus className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4 text-sm text-gray-700">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
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

