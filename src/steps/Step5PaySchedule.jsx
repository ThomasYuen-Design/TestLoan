import React, { useState } from "react";
import ProgressHeader from "../components/ProgressHeader.jsx";
import { Info } from "lucide-react";

const WEEKDAYS = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
];

const dayTiles = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
const LAST_DAY_TILE = "31 / Last day";

export default function Step5PaySchedule({ onContinue, onBack, frequency, initialData = {} }) {
  const [weekday, setWeekday] = useState(initialData.weekday || null);
  const [semiDays, setSemiDays] = useState(initialData.semiDays || []);
  const [monthlyDay, setMonthlyDay] = useState(initialData.monthlyDay || null);

  const isWeeklyOrBiweekly = frequency === "Weekly" || frequency === "Bi-weekly";
  const isSemiMonthly = frequency === "Semi-monthly";
  const isMonthly = frequency === "Monthly";

  const isComplete = 
    (isWeeklyOrBiweekly && weekday !== null) ||
    (isSemiMonthly && semiDays.length === 2) ||
    (isMonthly && monthlyDay !== null);

  const handleContinue = () => {
    if (isComplete) {
      onContinue({ weekday, semiDays, monthlyDay });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col p-6">
      <ProgressHeader currentStep={5} totalSteps={6} onBack={onBack} />

      <p className="text-xs tracking-wide text-gray-500 mb-8">
        STEP 5 OF 6 – PAY SCHEDULE
      </p>

      <div className="flex-1">
        {/* Info rule (implicit holiday/weekend policy) */}
        <div className="flex items-start gap-2 text-xs text-neutral-600 mb-6 bg-blue-50 p-3 rounded-lg">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>
            If a payday falls on a weekend or holiday, we'll set your payment to the <strong>last business day before</strong> your payday.
          </span>
        </div>

        {/* Weekly & Bi-weekly: weekday selection */}
        {isWeeklyOrBiweekly && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Which weekday do you get paid?</h2>
            <div className="grid grid-cols-5 gap-2">
              {WEEKDAYS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setWeekday(d.value)}
                  className={`px-3 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    weekday === d.value ? "border-black bg-black text-white" : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Semi-monthly: pick two days */}
        {isSemiMonthly && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select the two days you're paid every month</h2>
            <div className="grid grid-cols-5 gap-2">
              {dayTiles.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setSemiDays((prev) => {
                      const exists = prev.includes(d);
                      if (exists) return prev.filter((x) => x !== d);
                      if (prev.length >= 2) return prev;
                      return [...prev, d];
                    });
                  }}
                  className={`rounded-lg border py-3 text-sm font-medium transition-colors ${
                    semiDays.includes(d) ? "border-black bg-black text-white" : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {d}
                </button>
              ))}
              <button
                onClick={() => {
                  setSemiDays((prev) => {
                    const exists = prev.includes(LAST_DAY_TILE);
                    if (exists) return prev.filter((x) => x !== LAST_DAY_TILE);
                    if (prev.length >= 2) return prev;
                    return [...prev, LAST_DAY_TILE];
                  });
                }}
                className={`rounded-lg border py-3 text-xs col-span-2 font-medium transition-colors ${
                  semiDays.includes(LAST_DAY_TILE) ? "border-black bg-black text-white" : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {LAST_DAY_TILE}
              </button>
            </div>
            <div className="text-sm text-neutral-600 bg-gray-50 p-3 rounded-lg">
              Selected: <strong>{semiDays.join(" • ") || "—"}</strong>
            </div>
          </div>
        )}

        {/* Monthly: pick one day */}
        {isMonthly && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select the day you're paid every month</h2>
            <div className="grid grid-cols-5 gap-2">
              {dayTiles.map((d) => (
                <button
                  key={d}
                  onClick={() => setMonthlyDay(d)}
                  className={`rounded-lg border py-3 text-sm font-medium transition-colors ${
                    monthlyDay === d ? "border-black bg-black text-white" : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {d}
                </button>
              ))}
              <button
                onClick={() => setMonthlyDay(LAST_DAY_TILE)}
                className={`rounded-lg border py-3 text-xs col-span-2 font-medium transition-colors ${
                  monthlyDay === LAST_DAY_TILE ? "border-black bg-black text-white" : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {LAST_DAY_TILE}
              </button>
            </div>
            <div className="text-sm text-neutral-600 bg-gray-50 p-3 rounded-lg">
              Selected: <strong>{monthlyDay || "—"}</strong>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleContinue}
        disabled={!isComplete}
        className={`mt-8 w-full rounded-lg py-3 font-semibold transition-colors ${
          isComplete
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        CONTINUE
      </button>
    </div>
  );
}

