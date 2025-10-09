import React, { useMemo, useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
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

export default function PaydateFlowClient({ employmentData, onBack }) {
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

  // Submit handler (for demo, just log selection)
  function handleContinue() {
    if (!canContinue) return;
    const payload = { frequency, weekday, anchorDate: chosenRecent, semiDays, monthlyDay };
    // eslint-disable-next-line no-console
    console.log("Collected:", payload);
    alert("Captured: " + JSON.stringify(payload, null, 2));
  }

  return (
    <div className="w-full max-w-md mx-auto p-5 pb-24 space-y-6 text-neutral-900">
      <ProgressHeader currentStep={2} totalSteps={6} onBack={onBack} />

      <p className="text-xs tracking-wide text-gray-500 mb-2">
        STEP 2 OF 6 – ENTERING YOUR PAY DATES
      </p>

      <p className="text-sm text-neutral-600">To set your payment schedule, tell us how you get paid.</p>

      {/* 1) Frequency */}
      <section className="space-y-3">
        <div className="text-sm font-semibold">What's your income frequency?</div>
        <div className="grid grid-cols-1 gap-2">
          {FREQUENCIES.map((f) => (
            <button
              key={f}
              onClick={() => onPickFrequency(f)}
              className={`text-left rounded-xl px-4 py-3 border hover:bg-neutral-50 ${
                frequency === f ? "border-neutral-900" : "border-neutral-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">{f}</div>
                <div className={`h-4 w-4 rounded-full border ${frequency === f ? "bg-neutral-900" : ""}`} />
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                {f === "Weekly" && "You're paid once a week on the same weekday."}
                {f === "Bi-weekly" && "You're paid every two weeks on the same weekday."}
                {f === "Semi-monthly" && "You're paid twice a month on fixed dates (e.g., 15th & last day)."}
                {f === "Monthly" && "You're paid once a month on a specific date."}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* 2) Frequency-specific prompts */}
      {frequency && (
        <section className="space-y-4" data-block="frequency-specific">
          {/* Info rule (implicit holiday/weekend policy) */}
          <div className="flex items-start gap-2 text-xs text-neutral-600">
            <Info className="h-4 w-4 mt-0.5" />
            <span>
              If a payday falls on a weekend or holiday, we'll set your payment to the <strong>last business day before</strong> your payday.
            </span>
          </div>

          

          {/* Weekly & Bi-weekly: weekday chips, then recent-date choice */}
          {(frequency === "Weekly" || frequency === "Bi-weekly") && (
            <div className="space-y-3" ref={weekdaySectionRef}>
              <div className="text-sm font-semibold">Which weekday do you get paid?</div>
              <div className="flex gap-2">
                {WEEKDAYS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => {
                      setWeekday(d.value);
                      setChosenRecent(null);
                      // Scroll to recent dates section after selecting weekday
                      setTimeout(() => {
                        recentDatesSectionRef.current?.scrollIntoView({ 
                          behavior: 'smooth', 
                          block: 'start',
                          inline: 'nearest'
                        });
                      }, 100);
                    }}
                    className={`px-3 py-2 rounded-full border text-sm ${
                      weekday === d.value ? "border-neutral-900" : "border-neutral-300"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {weekday && (
                <div className="space-y-2" ref={recentDatesSectionRef}>
                  <div className="text-sm font-semibold">
                    {frequency === "Weekly" ? "Choose your pay cycle for repayments" : "Which date were you last paid?"}
                  </div>
                  <div className="flex gap-2">
                    {recentDates.map((d) => (
                      <button
                        key={d}
                        onClick={() => setChosenRecent(d)}
                        className={`px-3 py-2 rounded-xl border text-sm ${
                          chosenRecent === d ? "border-neutral-900" : "border-neutral-300"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  {frequency === "Weekly" && (
                  <p className="text-xs text-neutral-500">
                    Your repayments will be scheduled <strong>every two weeks</strong> from the date you choose.
                  </p>
                )}
                </div>
              )}
            </div>
          )}

          {/* Semi-monthly: pick two days */}
          {frequency === "Semi-monthly" && (
            <div className="space-y-3" ref={semiMonthlySectionRef}>
              <div className="text-sm font-semibold">Select the two days you're paid every month</div>
              <div className="grid grid-cols-5 gap-2">
                {dayTiles.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSemiDays((prev) => {
                        const exists = prev.includes(d);
                        if (exists) return prev.filter((x) => x !== d);
                        if (prev.length >= 2) return prev; // limit 2
                        return [...prev, d];
                      });
                    }}
                    className={`rounded-lg border py-2 text-sm ${
                      semiDays.includes(d) ? "border-neutral-900" : "border-neutral-300"
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
                  className={`rounded-lg border py-2 text-xs col-span-2 ${
                    semiDays.includes(LAST_DAY_TILE) ? "border-neutral-900" : "border-neutral-300"
                  }`}
                >
                  {LAST_DAY_TILE}
                </button>
              </div>
              <div className="text-xs text-neutral-500">Selected: {semiDays.join(" • ") || "—"}</div>
            </div>
          )}

          {/* Monthly: pick one day */}
          {frequency === "Monthly" && (
            <div className="space-y-3" ref={monthlySectionRef}>
              <div className="text-sm font-semibold">Select the day you're paid every month</div>
              <div className="grid grid-cols-5 gap-2">
                {dayTiles.map((d) => (
                  <button
                    key={d}
                    onClick={() => setMonthlyDay(d)}
                    className={`rounded-lg border py-2 text-sm ${
                      monthlyDay === d ? "border-neutral-900" : "border-neutral-300"
                    }`}
                  >
                    {d}
                  </button>
                ))}
                <button
                  onClick={() => setMonthlyDay(LAST_DAY_TILE)}
                  className={`rounded-lg border py-2 text-xs col-span-2 ${
                    monthlyDay === LAST_DAY_TILE ? "border-neutral-900" : "border-neutral-300"
                  }`}
                >
                  {LAST_DAY_TILE}
                </button>
              </div>
              <div className="text-xs text-neutral-500">Selected: {monthlyDay || "—"}</div>
            </div>
          )}
        </section>
      )}

      {/* CTA */}
      <ContinueButton onClick={handleContinue} disabled={!canContinue} children="Continue" />
    </div>
  );
}

