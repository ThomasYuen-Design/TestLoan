import React, { useMemo, useState } from "react";
import ProgressHeader from "../components/ProgressHeader.jsx";
import ContinueButton from "../components/ContinueButton.jsx";

const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function recentWeekdayDates(weekday1to5, howMany = 2) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const results = [];
  let probe = new Date(today);
  const target = weekday1to5;
  const jsTo1to7 = (js) => (js === 0 ? 7 : js);
  while (results.length < howMany) {
    if (jsTo1to7(probe.getDay()) === target && probe <= today) {
      results.push(iso(probe));
    }
    probe.setDate(probe.getDate() - 1);
  }
  return results;
}

export default function Step6LastPaid({ onContinue, onBack, frequency, weekday, initialData = {} }) {
  const recentDates = useMemo(() => (weekday ? recentWeekdayDates(weekday, 2) : []), [weekday]);
  const [chosenRecent, setChosenRecent] = useState(initialData.lastPaidDate || null);

  const isComplete = chosenRecent !== null;

  const handleContinue = () => {
    if (isComplete) {
      onContinue({ lastPaidDate: chosenRecent });
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col p-6 pb-24">
      <ProgressHeader currentStep={6} totalSteps={6} onBack={onBack} />

      <p className="text-xs tracking-wide text-gray-500 mb-8">
        STEP 6 OF 6 – LAST PAYDAY
      </p>

      <div>
        <h2 className="text-lg font-semibold mb-2">
          {frequency === "Weekly" ? "Choose your pay cycle for repayments" : "Which date were you last paid?"}
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Select the most recent date you received payment.
        </p>

        <div className="space-y-3">
          {recentDates.map((d) => (
            <button
              key={d}
              onClick={() => setChosenRecent(d)}
              className={`w-full px-4 py-4 rounded-xl border text-left transition-colors ${
                chosenRecent === d ? "border-black bg-black text-white" : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">{d}</span>
                <div className={`h-5 w-5 rounded-full border-2 ${chosenRecent === d ? "bg-white border-white" : "border-gray-400"}`} />
              </div>
            </button>
          ))}
        </div>

        {frequency === "Weekly" && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <p className="text-xs text-neutral-600">
              Your repayments will be scheduled <strong>every two weeks</strong> from the date you choose.
            </p>
          </div>
        )}
      </div>

      <ContinueButton onClick={handleContinue} disabled={!isComplete} />
    </div>
  );
}

