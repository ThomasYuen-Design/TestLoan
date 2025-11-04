import React, { useMemo, useState, useRef, useEffect } from "react";
import { Info, Lock, MessageCircle, Shield } from "lucide-react";
import ProgressHeader from "./components/ProgressHeader.jsx";
import ContinueButton from "./components/ContinueButton.jsx";

/**
 * Paydate Flow – Client (Fora-style) version
 * Frequency → targeted prompts (no next-payday input, no preview, no holiday selector)
 * - Weekly (treated as bi-weekly): pick weekday, then choose between two most recent dates for that weekday
 * - Bi-weekly: pick weekday, then choose which recent date was last payday
 * - Semi-monthly: pick TWO days from 1–31 (include "31 / Last day")
 * - Monthly: pick ONE day from 1–31 (include "31 / Last day")
 * CTA: Continue (enabled only when required selections are complete)
 * Note: Holiday/weekend rule is implicit (informational copy only): shift to last business day before.
 */

// ---------- date helpers ----------
const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// weekday: 1=Mon..5=Fri
function recentWeekdayDates(weekday1to5, howMany = 2) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const results = [];
  let probe = new Date(today);
  // Map Mon..Fri to JS weekday Mon=1..Fri=5 (JS: 0=Sun..6=Sat)
  const target = weekday1to5; // same scale for clarity
  const jsTo1to7 = (js) => (js === 0 ? 7 : js);
  while (results.length < howMany) {
    if (jsTo1to7(probe.getDay()) === target && probe <= today) {
      results.push(iso(probe));
    }
    probe.setDate(probe.getDate() - 1);
  }
  return results;
}

// ---------- UI helpers ----------
const FREQUENCIES = ["Weekly", "Bi-weekly", "Semi-monthly", "Monthly"];

const WEEKDAYS = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
];

const dayTiles = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
const LAST_DAY_TILE = "31 / Last day";

export default function PaydateFlowClient({ employmentData, onBack, onContinue }) {
  const [frequency, setFrequency] = useState(null);

  // weekly / bi-weekly
  const [weekday, setWeekday] = useState(null); // 1..5
  const recentDates = useMemo(() => (weekday ? recentWeekdayDates(weekday, 2) : []), [weekday]);
  const [chosenRecent, setChosenRecent] = useState(null);

  // semi-monthly
  const [semiDays, setSemiDays] = useState([]); // up to 2 of ["1".."30", LAST_DAY_TILE]

  // monthly
  const [monthlyDay, setMonthlyDay] = useState(null);

  // Refs for scrolling
  const weekdaySectionRef = useRef(null);
  const recentDatesSectionRef = useRef(null);
  const semiMonthlySectionRef = useRef(null);
  const monthlySectionRef = useRef(null);

  // validation per frequency
  const canContinue = useMemo(() => {
    if (!frequency) return false;
    if (frequency === "Weekly" || frequency === "Bi-weekly") {
      return Boolean(weekday && chosenRecent);
    }
    if (frequency === "Semi-monthly") {
      return semiDays.length === 2;
    }
    if (frequency === "Monthly") {
      return Boolean(monthlyDay);
    }
    return false;
  }, [frequency, weekday, chosenRecent, semiDays.length, monthlyDay]);

  // reset dependent state when frequency changes
  function onPickFrequency(f) {
    setFrequency(f);
    setWeekday(null);
    setChosenRecent(null);
    setSemiDays([]);
    setMonthlyDay(null);
    
    // Scroll to next section after a short delay to allow state update
    setTimeout(() => {
      if (f === "Weekly" || f === "Bi-weekly") {
        weekdaySectionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      } else if (f === "Semi-monthly") {
        semiMonthlySectionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      } else if (f === "Monthly") {
        monthlySectionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  }

  // Submit handler
  function handleContinue() {
    if (!canContinue) return;
    const payload = { frequency, weekday, anchorDate: chosenRecent, semiDays, monthlyDay };
    if (onContinue) {
      onContinue(payload);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10">
          <ProgressHeader currentStep={2} totalSteps={6} onBack={onBack} />

          <p className="text-xs tracking-wide text-gray-500 mb-8">
            STEP 2 OF 6 – YOUR PAY DATES
          </p>

          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Left Column - Main Form */}
            <div className="space-y-8">
              {/* 1) Frequency */}
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">PAYROLL/INCOME FREQUENCY</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {FREQUENCIES.map((f) => (
                    <button
                      key={f}
                      onClick={() => onPickFrequency(f)}
                      className={`text-left rounded-lg px-4 py-3 border transition-colors ${
                        frequency === f ? "border-black bg-gray-50" : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold uppercase text-sm">{f}</div>
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          frequency === f ? "border-black" : "border-gray-400"
                        }`}>
                          {frequency === f && <div className="h-3 w-3 rounded-full bg-black" />}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">
                        {f === "Weekly" && "You're paid once a week on the same weekday."}
                        {f === "Bi-weekly" && "You're paid every two weeks on the same weekday."}
                        {f === "Semi-monthly" && "You're paid twice a month (e.g. 15th and 31 / Last Day of the Month)"}
                        {f === "Monthly" && "You're paid once a month"}
                      </p>
                    </button>
                  ))}
                </div>
              </section>

              {/* 2) Frequency-specific prompts */}
              {frequency && (
                <section className="space-y-6" data-block="frequency-specific">
                  {/* Weekly & Bi-weekly: weekday chips, then recent-date choice */}
                  {(frequency === "Weekly" || frequency === "Bi-weekly") && (
                    <>
                      <div className="space-y-3" ref={weekdaySectionRef}>
                        <h3 className="text-base font-semibold">WHICH WEEKDAY DO YOU GET PAID?</h3>
                        <div className="flex gap-2">
                          {WEEKDAYS.map((d) => (
                            <button
                              key={d.value}
                              onClick={() => {
                                setWeekday(d.value);
                                setChosenRecent(null);
                                setTimeout(() => {
                                  recentDatesSectionRef.current?.scrollIntoView({ 
                                    behavior: 'smooth', 
                                    block: 'start',
                                    inline: 'nearest'
                                  });
                                }, 100);
                              }}
                              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                weekday === d.value ? "bg-black text-white" : "bg-gray-100 text-black hover:bg-gray-200"
                              }`}
                            >
                              {d.label.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>

                      {weekday && (
                        <div className="space-y-3" ref={recentDatesSectionRef}>
                          <p className="text-sm font-medium uppercase">
                            YOUR LINE OF CREDIT PAYMENTS WILL BE EVERY TWO WEEKS, STARTING FROM THE PAYDAY YOU SELECT.
                          </p>
                          <div className="flex gap-3">
                            {recentDates.map((d) => (
                              <button
                                key={d}
                                onClick={() => setChosenRecent(d)}
                                className={`flex-1 px-6 py-4 rounded-lg text-base font-medium transition-colors ${
                                  chosenRecent === d ? "bg-black text-white" : "bg-gray-100 text-black hover:bg-gray-200"
                                }`}
                              >
                                {d}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Semi-monthly: pick two days */}
                  {frequency === "Semi-monthly" && (
                    <div className="space-y-3" ref={semiMonthlySectionRef}>
                      <h3 className="text-base font-semibold">SELECT THE TWO DAYS YOU'RE PAID EVERY MONTH</h3>
                      <div className="grid grid-cols-5 md:grid-cols-6 gap-2">
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
                            className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                              semiDays.includes(d) ? "bg-black text-white" : "bg-gray-100 text-black hover:bg-gray-200"
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
                          className={`py-3 rounded-lg text-xs col-span-2 font-medium transition-colors ${
                            semiDays.includes(LAST_DAY_TILE) ? "bg-black text-white" : "bg-gray-100 text-black hover:bg-gray-200"
                          }`}
                        >
                          {LAST_DAY_TILE}
                        </button>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">Selected: {semiDays.join(" • ") || "—"}</div>
                    </div>
                  )}

                  {/* Monthly: pick one day */}
                  {frequency === "Monthly" && (
                    <div className="space-y-3" ref={monthlySectionRef}>
                      <h3 className="text-base font-semibold">SELECT THE DAY YOU'RE PAID EVERY MONTH</h3>
                      <div className="grid grid-cols-5 md:grid-cols-6 gap-2">
                        {dayTiles.map((d) => (
                          <button
                            key={d}
                            onClick={() => setMonthlyDay(d)}
                            className={`py-3 rounded-lg text-sm font-medium transition-colors ${
                              monthlyDay === d ? "bg-black text-white" : "bg-gray-100 text-black hover:bg-gray-200"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                        <button
                          onClick={() => setMonthlyDay(LAST_DAY_TILE)}
                          className={`py-3 rounded-lg text-xs col-span-2 font-medium transition-colors ${
                            monthlyDay === LAST_DAY_TILE ? "bg-black text-white" : "bg-gray-100 text-black hover:bg-gray-200"
                          }`}
                        >
                          {LAST_DAY_TILE}
                        </button>
                      </div>
                      <div className="text-xs text-gray-600 mt-2">Selected: {monthlyDay || "—"}</div>
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* Right Column - Info Panel */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="bg-gray-100 rounded-lg p-6 space-y-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    If your payday falls on a weekend or holiday, both your pay and your Line of Credit payment move to the business day before.
                  </p>
                </div>
                
                <button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  className={`w-full rounded-lg py-4 font-semibold transition-colors ${
                    !canContinue
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

