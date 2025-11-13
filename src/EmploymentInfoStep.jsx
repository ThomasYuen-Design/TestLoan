import React, { useState } from "react";
import ProgressHeader from "./components/ProgressHeader.jsx";
import ContinueButton from "./components/ContinueButton.jsx";
import { Lock, MessageCircle } from "lucide-react";

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
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10">
          <ProgressHeader currentStep={1} totalSteps={6} onBack={onBack} />

          <p className="text-xs tracking-wide text-gray-500 mb-8">
            STEP 1 OF 6 – EMPLOYMENT INFO
          </p>

          <div className="max-w-3xl">
            <h2 className="text-lg font-semibold mb-6">
              EMPLOYMENT INFO / SOURCE OF INCOME
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm mb-1 font-medium text-gray-700">EMPLOYER NAME</label>
                <input
                  type="text"
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                  placeholder="Type here..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              <div className="md:grid md:grid-cols-2 md:gap-4 space-y-4 md:space-y-0">
                <div>
                  <label className="block text-sm mb-1 font-medium text-gray-700">EMPLOYER PHONE</label>
                  <input
                    type="tel"
                    value={employerPhone}
                    onChange={(e) => setEmployerPhone(e.target.value)}
                    placeholder="e.g. (555) 123-4567"
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1 font-medium text-gray-700">EXTENSION (OPTIONAL)</label>
                  <input
                    type="text"
                    value={extension}
                    onChange={(e) => setExtension(e.target.value)}
                    placeholder="e.g. 101"
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleContinue}
              disabled={!isComplete}
              className={`w-full rounded-lg py-4 font-semibold transition-colors ${
                !isComplete
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              CONTINUE
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-6 md:px-8 lg:px-10">
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

