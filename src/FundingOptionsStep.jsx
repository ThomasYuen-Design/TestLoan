import React, { useState } from "react";
import { Check, ChevronRight, Lock, MessageCircle } from "lucide-react";
import ProgressHeader from "./components/ProgressHeader.jsx";

export default function FundingOptionsStep({ onContinue, onBack, initialData = {} }) {
  const [method, setMethod] = useState(initialData.method || null);
  const [bundle, setBundle] = useState(initialData.bundle || false);
  const [showError, setShowError] = useState(false);

  const handleContinue = () => {
    if (method === null) {
      setShowError(true);
      return;
    }
    
    if (onContinue) {
      onContinue({ method, bundle });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10">
          <ProgressHeader currentStep={4} totalSteps={6} onBack={onBack} />

          <p className="text-xs tracking-wide text-gray-500 mb-2">
            STEP 4 OF 6 – FUNDING OPTIONS
          </p>

          <p className="text-sm text-gray-700 mb-8">
            Your line of credit advance won't be funded until your agreements are signed.
          </p>

          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Left Column - Funding Options */}
            <div className="space-y-6">
              <h2 className="text-xs font-semibold tracking-widest text-gray-600">
                SELECT A FUNDING OPTION BELOW
              </h2>

              {showError && method === null && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
                  Please select a funding method to continue.
                </div>
              )}

              <div className="space-y-3">
                <FundingCard
                  label="INTERAC E-TRANSFER"
                  subtitle1="Delivery: Same day"
                  selected={method === "etransfer"}
                  tag="GET YOUR MONEY TODAY"
                  onClick={() => {
                    setMethod("etransfer");
                    setBundle(true);
                    setShowError(false);
                  }}
                />

                <FundingCard
                  label="DIRECT DEPOSIT"
                  subtitle1="to your BMO/Bank of Montreal account"
                  subtitle2="Delivery: 1-3 business days"
                  selected={method === "deposit"}
                  onClick={() => {
                    setMethod("deposit");
                    setShowError(false);
                  }}
                />
              </div>

              {/* Mobile: Bundle Card */}
              <div className="lg:hidden">
                <MogoMoneyBundleCard 
                  bundle={bundle} 
                  setBundle={setBundle} 
                  setMethod={setMethod}
                />
              </div>

              {/* Mobile: Continue Button */}
              <div className="lg:hidden">
                <button
                  onClick={handleContinue}
                  disabled={method === null}
                  className={`w-full rounded-lg py-4 font-semibold transition-colors ${
                    method === null
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  CONTINUE
                </button>
              </div>
            </div>

            {/* Right Column - Desktop Bundle Panel */}
            <div className="hidden lg:block lg:sticky lg:top-8 lg:self-start">
              <div className="bg-black text-white rounded-lg p-6 space-y-6">
                {/* Title & Price */}
                <div className="flex items-start justify-between gap-4">
                  <div className="text-xs font-semibold tracking-wide">
                    <span className="mr-2">//</span>SAME-DAY FUNDING, PAYMENT FLEXIBILITY & INVESTING POWER
                  </div>
                  <div className="text-lg font-semibold whitespace-nowrap">$23.99</div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300">
                  Our Mogo Money Bundle includes exclusive features in a $23.99 per pay period package:
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  <FeatureItem text="Same day funding on all advances." />
                  <FeatureItem 
                    text="The ability to skip your Mini Line of Credit payment (great for when the unexpected happens)" 
                  />
                  <FeatureItem 
                    text="Access to Intelligent Investing-a powerful wealth-building platform where even small steps can lead to big outcomes." 
                  />
                </ul>

                {/* Divider */}
                <div className="h-px bg-white/20" />

                {/* Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={bundle}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setBundle(checked);
                        if (!checked) {
                          setMethod(null);
                        }
                      }}
                      className="h-5 w-5 rounded border-2 border-white bg-transparent appearance-none checked:bg-white checked:border-white cursor-pointer"
                    />
                    {bundle && (
                      <Check className="absolute top-0.5 left-0.5 h-4 w-4 text-black pointer-events-none" />
                    )}
                  </div>
                  <div className="text-sm">
                    <div>Add Mogo Money Bundle <span className="text-gray-400">(Optional)</span></div>
                    <button className="mt-1 inline-flex items-center gap-1 text-xs font-medium underline hover:text-gray-300">
                      Learn more <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </label>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  disabled={method === null}
                  className={`w-full rounded-lg py-4 font-semibold transition-colors ${
                    method === null
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-white text-black hover:bg-gray-100"
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

function FundingCard({ label, subtitle1, subtitle2, selected, onClick, tag, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left transition-all ${
        selected ? "border-black bg-gray-50" : "border-gray-300 hover:bg-gray-50"
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {tag && (
            <span className="mb-2 inline-flex items-center rounded-full border border-gray-300 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-gray-700">
              {tag}
            </span>
          )}
          <div className="text-sm font-semibold tracking-wide mt-2">{label}</div>
          {subtitle1 && <div className="mt-2 text-sm text-gray-700">{subtitle1}</div>}
          {subtitle2 && (
            <div className="mt-1 text-sm text-gray-700">{subtitle2}</div>
          )}
        </div>
        <div
          className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 flex-shrink-0 ml-4 ${
            selected ? "border-black" : "border-gray-400"
          }`}
        >
          {selected && <div className="h-2.5 w-2.5 rounded-full bg-black" />}
        </div>
      </div>
    </button>
  );
}

function MogoMoneyBundleCard({ bundle, setBundle, setMethod }) {
  return (
    <div className="bg-black text-white rounded-lg p-6 space-y-4">
      {/* Title & Price */}
      <div className="flex items-start justify-between gap-4">
        <div className="text-xs font-semibold tracking-wide">
          <span className="mr-2">//</span>SAME-DAY FUNDING, PAYMENT FLEXIBILITY & INVESTING POWER
        </div>
        <div className="text-lg font-semibold whitespace-nowrap">$23.99</div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300">
        Our Mogo Money Bundle includes exclusive features in a $23.99 per pay period package:
      </p>

      {/* Features */}
      <ul className="space-y-3">
        <FeatureItem text="Same day funding on all advances." />
        <FeatureItem 
          text="The ability to skip your Mini Line of Credit payment (great for when the unexpected happens)" 
        />
        <FeatureItem 
          text="Access to Intelligent Investing-a powerful wealth-building platform where even small steps can lead to big outcomes." 
        />
      </ul>

      {/* Checkbox */}
      <label className="flex items-start gap-3 cursor-pointer pt-2">
        <div className="relative mt-1">
          <input
            type="checkbox"
            checked={bundle}
            onChange={(e) => {
              const checked = e.target.checked;
              setBundle(checked);
              if (!checked) {
                setMethod(null);
              }
            }}
            className="h-5 w-5 rounded border-2 border-white bg-transparent appearance-none checked:bg-white checked:border-white cursor-pointer"
          />
          {bundle && (
            <Check className="absolute top-0.5 left-0.5 h-4 w-4 text-black pointer-events-none" />
          )}
        </div>
        <div className="text-sm">
          <div>Add Mogo Money Bundle <span className="text-gray-400">(Optional)</span></div>
          <button className="mt-1 inline-flex items-center gap-1 text-xs font-medium underline hover:text-gray-300">
            Learn more <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </label>
    </div>
  );
}

function FeatureItem({ text }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/30 flex-shrink-0">
        <Check className="h-3 w-3" />
      </span>
      <span className="text-gray-100">{text}</span>
    </li>
  );
}

