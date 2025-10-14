import React, { useMemo, useState } from "react";
import ProgressHeader from "../components/ProgressHeader.jsx";
import ContinueButton from "../components/ContinueButton.jsx";

/**
 * Loan Customization – Mobile Mock (React + Tailwind)
 * - Restores number pad interaction for selecting loan amount
 * - Minimum amount selectable is $100, maximum = pre-approval
 * - Client copy updates remain (step header, helper text)
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

// NumberPad component
function NumberPad({
  open,
  onClose,
  onChange,
  value,
  min,
  max,
}) {
  const [buffer, setBuffer] = useState(String(value));

  React.useEffect(() => {
    setBuffer(String(value));
  }, [open, value]);

  const commit = () => {
    let n = parseInt(buffer || "0", 10);
    if (isNaN(n)) n = min;
    if (n < min) n = min;
    if (n > max) n = max;
    onChange(n);
    onClose();
  };

  const push = (ch) => {
    if (buffer.length > 5) return;
    const next = (buffer === "0" ? ch : buffer + ch).replace(/^0+(\d)/, "$1");
    setBuffer(next);
  };

  const back = () => {
    const next = buffer.slice(0, -1) || "0";
    setBuffer(next);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-t-2xl bg-white p-4 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-xs text-gray-500">Enter amount</div>
          <button onClick={onClose} className="rounded-full px-2 py-1 text-xs text-gray-500 hover:bg-gray-100">Close</button>
        </div>

        <div className="mb-3 text-center text-4xl font-semibold tracking-tight">${buffer}</div>
        <div className="mb-4 text-center text-xs text-gray-500">Min {currency(min)} • Max {currency(max)}</div>

        <div className="grid grid-cols-3 gap-2">
          {["1","2","3","4","5","6","7","8","9","0"].map(d => (
            <button key={d} onClick={() => push(d)} className="aspect-[6/4] rounded-xl border border-gray-200 text-2xl font-medium active:scale-95">{d}</button>
          ))}
          <button onClick={() => setBuffer("0")} className="aspect-[6/4] rounded-xl border border-gray-200 text-sm font-medium active:scale-95">CLEAR</button>
          <button onClick={() => setBuffer(String(max))} className="aspect-[6/4] rounded-xl border border-gray-200 text-sm font-medium active:scale-95">MAX</button>
          <button onClick={back} className="aspect-[6/4] rounded-xl border border-gray-200 text-xl font-medium active:scale-95">←</button>
        </div>

        <button onClick={commit} className="mt-4 w-full rounded-xl bg-black py-3 text-white">Use ${buffer}</button>
      </div>
    </div>
  );
}

export default function Step7LoanCustomization({ onContinue, onBack, initialData = {} }) {
  const preapprovedMax = initialData.preapprovedMax || 1000; // example cap
  const minDraw = 100;

  const [amount, setAmount] = useState(initialData.amount || preapprovedMax);
  const [showPad, setShowPad] = useState(false);
  const [loanProtection, setLoanProtection] = useState(initialData.loanProtection || false);

  const apr = 47.42;

  const handleContinue = () => {
    onContinue({
      amount,
      loanProtection,
      preapprovedMax,
      apr
    });
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <div className="flex min-h-screen w-full items-center justify-center bg-neutral-100 p-4">
        <div className="relative mx-auto w-[375px] overflow-hidden rounded-[28px] bg-white shadow-2xl">
          
          <div className="bg-neutral-900 px-5 pb-8 pt-6 text-white">
            <div className="mb-6 flex items-center gap-3 text-sm text-neutral-300">
              <button onClick={onBack} className="rounded-full bg-white/10 px-2 py-1">◀</button>
              CUSTOMIZE LINE OF CREDIT – STEP 7 OF 7
            </div>
            <div className="text-neutral-400">You're pre-approved for up to</div>
            <div className="text-[44px] font-bold leading-none tracking-tight">{currency(preapprovedMax)}</div>
          </div>

          <div className="space-y-8 p-5">
            <div className="rounded-2xl border border-neutral-200 p-5">
              <div className="mb-1 flex items-center justify-between text-sm font-semibold tracking-wide">
                <div>// MINI MONEY</div>
                <div className="text-neutral-400">Everyday Loan</div>
              </div>

              <div className="mt-3 text-xs text-neutral-500">Your loan amount:</div>

              {/* Tap-to-edit amount */}
              <button
                onClick={() => setShowPad(true)}
                className="group mt-2 w-full rounded-xl bg-neutral-100 px-4 py-4 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="text-5xl font-semibold tracking-tight">{currency(amount)}</div>
                  <div className="text-neutral-400 transition group-active:translate-y-0.5">△▼</div>
                </div>
                <div className="mt-2 text-xs text-neutral-500">You can edit this later.</div>
              </button>

              <div className="mt-4 h-px w-full bg-neutral-200" />
              <p className="mt-3 text-xs text-neutral-500">
                Based on bi‑weekly payments, APR of {apr}% not including optional services and fees.
              </p>
            </div>

            <section>
              <h3 className="text-sm font-extrabold tracking-widest text-neutral-900">YOUR REPAYMENT PAYMENTS</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Mini Money is recommended for short‑term use but you have the flexibility to pay it back whenever you like. Just contact us when you're ready to make a payment. After it's paid back you can re‑access it on demand.
              </p>
            </section>

            <section>
              <h3 className="text-sm font-extrabold tracking-widest text-neutral-900">LOAN PROTECTION</h3>
              <label className="mt-3 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 accent-black"
                  checked={loanProtection}
                  onChange={(e) => setLoanProtection(e.target.checked)}
                />
                <div>
                  <div className="font-medium">I want to participate in the loan balance protection plan.</div>
                  <p className="mt-1 text-sm text-neutral-600">
                    We strongly recommend loan protection. Protect yourself and your loved ones from damaged credit in the event that you are laid off, injured, critically ill or pass away and can't repay your loan.{' '}
                    <button className="underline">Learn more</button>
                  </p>
                </div>
              </label>
            </section>

            <section>
              <h3 className="text-sm font-extrabold tracking-widest text-neutral-900">WHEN TO USE MINI MONEY</h3>
              <p className="mt-2 text-sm text-neutral-600">
                When used short‑term, Mini Money is a cost effective alternative to overspending on a credit card, bouncing a cheque, going into overdraft or using a payday loan.
              </p>
            </section>
          </div>

          <div className="sticky bottom-0 z-10 w-full bg-white/80 p-5 backdrop-blur">
            <button onClick={handleContinue} className="w-full rounded-xl bg-neutral-900 py-4 text-white">CONTINUE</button>
          </div>
        </div>

        <NumberPad
          open={showPad}
          onClose={() => setShowPad(false)}
          onChange={setAmount}
          value={amount}
          min={minDraw}
          max={preapprovedMax}
        />
      </div>
    </div>
  );
}
