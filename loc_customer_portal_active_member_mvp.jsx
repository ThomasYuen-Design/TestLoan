import React, { useState } from "react";
import { Home, Wallet, FileText, MoreHorizontal, Lock, Info, Clock, X, ArrowLeft } from "lucide-react";

/**
 * LOC — Customer Portal (Refined Upcoming + Recent Payments Logic)
 * --------------------------------------------------------------------
 * Simplifies payment flow: Upcoming = Pending, Available, Adjusted only.
 * Processed payments now move to Recent Payments automatically.
 *
 * NOTE: This file fixes a syntax error caused by a misplaced `return` and
 * duplicated declarations inside the HomePage JSX. Declarations now appear
 * before the return, and the JSX is clean.
 */

// ---------------- NumberPad Component ----------------
function NumberPad({ open, onClose, onChange, value, min, max, title = "Enter Amount" }) {
  const [buffer, setBuffer] = React.useState(String(value));

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
    if (buffer.length > 6) return; // Limit to 6 digits
    const next = (buffer === "0" ? ch : buffer + ch).replace(/^0+(\d)/, "$1");
    setBuffer(next);
  };

  const back = () => {
    const next = buffer.slice(0, -1) || "0";
    setBuffer(next);
  };

  const clear = () => {
    setBuffer("0");
  };

  const formatDisplay = (val) => {
    const num = parseInt(val || "0", 10);
    return new Intl.NumberFormat(undefined, { 
      style: "currency", 
      currency: "CAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* NumberPad Modal */}
      <div className="relative z-10 w-full bg-white rounded-t-3xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Close number pad"
          >
            <X className="h-5 w-5 text-neutral-600" />
          </button>
        </div>

        {/* Display */}
        <div className="p-6 text-center">
          <div className="text-4xl font-bold text-neutral-900 mb-2">
            {formatDisplay(buffer)}
          </div>
          <div className="text-sm text-neutral-500">
            Range: {formatDisplay(min)} - {formatDisplay(max)}
          </div>
        </div>

        {/* Keypad */}
        <div className="p-4 pb-8">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* Row 1: 1, 2, 3 */}
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => push(String(num))}
                className="h-14 rounded-2xl bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-2xl font-semibold text-neutral-900 transition-colors"
              >
                {num}
              </button>
            ))}
            
            {/* Row 2: 4, 5, 6 */}
            {[4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => push(String(num))}
                className="h-14 rounded-2xl bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-2xl font-semibold text-neutral-900 transition-colors"
              >
                {num}
              </button>
            ))}
            
            {/* Row 3: 7, 8, 9 */}
            {[7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => push(String(num))}
                className="h-14 rounded-2xl bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-2xl font-semibold text-neutral-900 transition-colors"
              >
                {num}
              </button>
            ))}
            
            {/* Row 4: Clear, 0, Backspace */}
            <button
              onClick={clear}
              className="h-14 rounded-2xl bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400 text-lg font-medium text-neutral-700 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => push("0")}
              className="h-14 rounded-2xl bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-2xl font-semibold text-neutral-900 transition-colors"
            >
              0
            </button>
            <button
              onClick={back}
              className="h-14 rounded-2xl bg-neutral-200 hover:bg-neutral-300 active:bg-neutral-400 text-lg font-medium text-neutral-700 transition-colors"
            >
              ⌫
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 h-12 rounded-2xl border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={commit}
              className="flex-1 h-12 rounded-2xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 active:bg-neutral-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-center justify-center py-2 text-xs ${
        active ? "text-neutral-900" : "text-neutral-400"
      }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      {label}
    </button>
  );
}

export default function LocPortalApp() {
  const [tab, setTab] = useState("home");
  const [pendingDraws, setPendingDraws] = useState([]);
  const [totalDrawnAmount, setTotalDrawnAmount] = useState(0);

  const handleDrawSubmitted = (drawData) => {
    const newDraw = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: "pending_draw",
      amount: -drawData.amount,
      method: drawData.fundingMethod === "interac" ? "Interac e-Transfer" : "Direct Deposit",
      ref: `DRAW-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      status: "pending"
    };
    
    setPendingDraws(prev => [newDraw, ...prev]);
    setTotalDrawnAmount(prev => prev + drawData.amount);
    // Don't automatically navigate to home - let user stay on success page
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <div className="flex-1 overflow-y-auto pb-16">
        {tab === "home" && <HomePage 
          onNavigatePayments={() => setTab("payments")} 
          onNavigateDraw={() => setTab("draw")}
          pendingDraws={pendingDraws}
          totalDrawnAmount={totalDrawnAmount}
        />}
        {tab === "payments" && <PaymentsPage onNavigateHome={() => setTab("home")} />}
        {tab === "draw" && <DrawPage onDrawSubmitted={handleDrawSubmitted} onNavigateHome={() => setTab("home")} />}
        {tab === "docs" && <DocsPage />}
        {tab === "more" && <MorePage />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 flex border-t border-neutral-200 bg-white">
        <TabButton icon={Home} label="Home" active={tab === "home"} onClick={() => setTab("home")} />
        <TabButton icon={Wallet} label="Draw" active={tab === "draw"} onClick={() => setTab("draw")} />
        <TabButton icon={FileText} label="Docs" active={tab === "docs"} onClick={() => setTab("docs")} />
        <TabButton icon={MoreHorizontal} label="More" active={tab === "more"} onClick={() => setTab("more")} />
      </nav>
    </div>
  );
}

// ---------------- Home ----------------
function HomePage({ onNavigatePayments, onNavigateDraw, pendingDraws, totalDrawnAmount }) {
  // STATE: Upcoming payment states: 'pending' | 'available' | 'adjusted' | 'payoff_scheduled'
  const [paymentState, setPaymentState] = useState("available");
  // STATE: Simulate a freshly received payment notice & receipt modal
  const [showPaymentNotice, setShowPaymentNotice] = useState(true);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [showExtraPrincipal, setShowExtraPrincipal] = useState(false);
  const [showPayInFull, setShowPayInFull] = useState(false);

  // Recent activity preview (3–4 items). Amount sign: payments positive, draws negative.
  const recentActivity = [
    { date: "Sep 20, 2025", type: "payment", amount: 420.0, principal: 140.0, interest: 260.0, fees: 20.0, method: "PAD", ref: "9F2-K7T" },
    { date: "Aug 20, 2025", type: "payment", amount: 420.0, principal: 135.0, interest: 265.0, fees: 20.0, method: "PAD", ref: "2HJ-43Q" },
    { date: "Jul 20, 2025", type: "payment", amount: 420.0, principal: 130.0, interest: 270.0, fees: 20.0, method: "PAD", ref: "8PL-99A" },
    { date: "Jul 20, 2025", type: "draw", amount: -420.0, method: "Interac e‑Transfer", ref: "ETR-771" },
  ];

  const formatMoney = (n) => new Intl.NumberFormat(undefined, { style: "currency", currency: "CAD" }).format(n);

  // Calculate available credit after deducting pending draws
  const availableCredit = 3000 - totalDrawnAmount;

  // Combine recent activity with pending draws
  const combinedActivity = [...pendingDraws, ...recentActivity].slice(0, 4);

  return (
    <div className="p-4">
      {/* Top notification: recent payment received */}
      {showPaymentNotice && (
        <div role="status" aria-live="polite" className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm text-emerald-900">
              Payment received on <span className="font-medium">Sep 20, 2025</span>. Total <span className="font-medium">$420.00</span>.
            </p>
            <div className="shrink-0 flex items-center gap-2">
              <button
                className="text-xs underline"
                onClick={() => {
                  setSelectedTxn(recentActivity[0]);
                  setShowReceiptModal(true);
                }}
              >
                View receipt
              </button>
              <button
                aria-label="Dismiss notification"
                className="rounded-md border border-emerald-200 px-2 py-1 text-xs text-emerald-800 hover:bg-emerald-100"
                onClick={() => setShowPaymentNotice(false)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-xl font-semibold mb-4">Line of Credit</h1>

      {/* Principal Balance - Full Width Display */}
      <div className="w-full bg-[#282828] rounded-2xl p-8 mb-4 relative overflow-hidden">
        <div className="text-right">
          <div className="text-sm text-[#808080] mb-3 font-medium">Principal Balance</div>
          <div className="text-6xl font-black text-white" style={{ 
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            letterSpacing: '0.05em',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
            lineHeight: '1'
          }}>
            $2,000.00
          </div>
        </div>
        {/* Bottom border to match image */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black"></div>
      </div>

      {/* Other Balance Tiles */}
      <div className="space-y-3">
        <Tile 
          label="Available Credit" 
          value={`$${availableCredit.toLocaleString()}`}
          note="Credit limit $5,000 — sum of principal + available"
          action={
            <div className="mt-3">
              <h3 className="font-medium text-sm mb-1">Need Funds?</h3>
              <p className="text-xs text-neutral-600 mb-2">
                You can draw from your available credit instantly via Interac e‑Transfer or within 1–3 business days by direct deposit.
              </p>
              <ActionButton label="Draw Funds" onClick={onNavigateDraw} />
            </div>
          }
        />
        <Tile
          label={<span className="inline-flex items-center gap-1">Pending Balance<Lock className="h-3.5 w-3.5" /></span>}
          value="$200"
          note="Excludes principal payments made within the last 7 days"
        />
      </div>

      {/* Upcoming Payment */}
      <UpcomingPaymentSection paymentState={paymentState} setPaymentState={setPaymentState} />

      {/* Recent Activity */}
      <RecentPaymentsSection payments={combinedActivity} onNavigatePayments={onNavigatePayments} onSelect={(p) => { setSelectedTxn(p); setShowReceiptModal(true); }} />

      {/* Make Additional Principal Payment (compact) - Hidden when payoff is scheduled */}
      {paymentState !== "payoff_scheduled" && (
        <button
          onClick={() => setShowExtraPrincipal(true)}
          className="mt-6 w-full rounded-2xl border border-neutral-200 p-4 text-left hover:bg-neutral-50"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-medium">Make additional principal payment</h2>
              <p className="text-xs text-neutral-600">Add a one-time amount to your next scheduled payment.</p>
            </div>
            <span className="text-sm text-neutral-500">Add →</span>
          </div>
        </button>
      )}

      {/* Pay In Full (compact) */}
      <button
        onClick={() => setShowPayInFull(true)}
        className="mt-3 w-full rounded-2xl border border-neutral-200 p-4 text-left hover:bg-neutral-50"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-medium">Request Pay In Full</h2>
            <p className="text-xs text-neutral-600">Schedule a full payoff on your next payment date.</p>
          </div>
          <span className="text-sm text-neutral-500">Pay off →</span>
        </div>
      </button>

      {/* Modal: Extra Principal Form */}
      {showExtraPrincipal && (
        <Modal title="Add extra principal" onClose={() => setShowExtraPrincipal(false)}>
          <ExtraPrincipalForm 
            principalBalance={2000} 
            nextMinimumDate="Oct 20, 2025" 
            statementDate="Oct 13, 2025"
            onPaymentSubmitted={(amount) => {
              setPaymentState("adjusted");
              setShowExtraPrincipal(false);
            }}
          />
        </Modal>
      )}

      {/* Modal: Pay In Full Form */}
      {showPayInFull && (
        <Modal title="Pay my Line of Credit in full" onClose={() => setShowPayInFull(false)}>
          <PayInFullForm
            estimatedPayoff={2340.50}
            nextMinimumDate="Oct 20, 2025"
            statementDate="Oct 13, 2025"
            onPayoffScheduled={() => {
              setPaymentState("payoff_scheduled");
              setShowPayInFull(false);
            }}
          />
        </Modal>
      )}


      {/* Receipt Modal */}
      {showReceiptModal && selectedTxn && (
        <Modal onClose={() => setShowReceiptModal(false)} title={selectedTxn?.type === 'payment' ? 'Payment receipt' : 'Draw details'}>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span>Date</span><span>{selectedTxn?.date}</span></div>
            <div className="flex items-center justify-between"><span>Type</span><span className="capitalize">{selectedTxn?.type}</span></div>
            <div className="flex items-center justify-between"><span>Amount</span><span>{selectedTxn?.amount < 0 ? '-' : ''}{formatMoney(Math.abs(selectedTxn?.amount || 0))}</span></div>
            {selectedTxn?.type === 'payment' && (
              <>
                <div className="flex items-center justify-between"><span>Principal</span><span>{formatMoney(selectedTxn?.principal)}</span></div>
                <div className="flex items-center justify-between"><span>Interest</span><span>{formatMoney(selectedTxn?.interest)}</span></div>
                <div className="flex items-center justify-between"><span>Fees</span><span>{formatMoney(selectedTxn?.fees)}</span></div>
              </>
            )}
            <div className="flex items-center justify-between"><span>Method</span><span>{selectedTxn?.method || '—'}</span></div>
            <div className="flex items-center justify-between"><span>Reference</span><span>{selectedTxn?.ref || '—'}</span></div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button className="rounded-md border border-neutral-300 px-3 py-2 text-sm" onClick={() => setShowReceiptModal(false)}>Close</button>
            <button 
              className="rounded-md bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800"
              onClick={() => {
                // Simulate PDF download
                const fileName = selectedTxn?.type === 'payment' ? `payment-receipt-${selectedTxn?.ref}.pdf` : `draw-details-${selectedTxn?.ref}.pdf`;
                alert(`Downloading ${fileName}...\n\nThis would trigger a real PDF download in production.`);
              }}
            >
              Download PDF
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ---------------- Upcoming Payment ----------------
function UpcomingPaymentSection({ paymentState, setPaymentState }) {
  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-medium">Upcoming Payment</h2>
        {/* DEV test control to simulate states */}
        <select
          className="text-xs border border-neutral-300 rounded-md px-2 py-1 text-neutral-600"
          value={paymentState}
          onChange={(e) => setPaymentState(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="available">Available</option>
          <option value="adjusted">Adjusted (Extra Principal)</option>
          <option value="payoff_scheduled">Payoff Scheduled</option>
        </select>
      </div>

      {paymentState === "pending" && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
          <Clock className="h-4 w-4 text-amber-600 mt-0.5" />
          <p className="text-sm text-amber-800">
            Your next Line of Credit statement will be available on <span className="font-medium">Oct 13</span>.
            Details for your next payment will appear then.
          </p>
        </div>
      )}

      {paymentState === "available" && (
        <div>
          <p className="text-sm text-neutral-600 mb-3">
            Next statement: Oct 13 · Payment due Oct 20 · Amount: <span className="font-medium">$125.50</span>
          </p>
          <div className="grid grid-cols-1 gap-3">
            <ActionButton label="Make a Payment" />
          </div>
          <p className="mt-3 text-xs text-neutral-500 flex items-center gap-1">
            <Info className="h-3 w-3" /> Amount includes standard minimum principal, interest, and fees.
          </p>
        </div>
      )}

      {paymentState === "adjusted" && (
        <div>
          <p className="text-sm text-neutral-600 mb-2">
            Next statement: Oct 13 · Payment due Oct 20 · Total: <span className="font-medium">$175.50</span>
          </p>
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 mb-3">
            <p className="text-xs text-neutral-700">Includes your additional principal payment of <span className="font-medium">$50.00</span>.</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <ActionButton label="Make Payment" />
          </div>
        </div>
      )}

      {paymentState === "payoff_scheduled" && (
        <div>
          <p className="text-sm text-neutral-600 mb-2">
            Next statement: Oct 13 · Payment due Oct 20 · Total: <span className="font-medium">$2,340.50</span>
          </p>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 mb-3">
            <p className="text-xs text-emerald-800">Your Line of Credit will be paid in full on your next scheduled payment date. This includes the full principal balance plus accrued interest and fees.</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <ActionButton label="Make Full Payment" />
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- Recent Payments ----------------
function RecentPaymentsSection({ payments, onNavigatePayments, onSelect }) {
  const formatMoney = (n) => new Intl.NumberFormat(undefined, { style: "currency", currency: "CAD" }).format(n);
  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-medium">Recent Activity</h2>
        <button
          className="text-xs text-neutral-500 hover:underline"
          onClick={onNavigatePayments}
        >
          View All
        </button>
      </div>
      <ul className="divide-y divide-neutral-200">
        {payments.slice(0, 4).map((p, i) => (
          <li key={p.id || i} className="py-3">
            <button
              onClick={() => onSelect && onSelect(p)}
              className="w-full text-left"
            >
              <div className="text-xs text-neutral-500">{p.date}</div>
              <div className="mt-0.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-neutral-800 capitalize">
                    {p.type === "pending_draw" ? "Pending draw" : p.type}
                  </div>
                  {p.type === "pending_draw" && (
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Processing
                    </span>
                  )}
                </div>
                <div className={`text-sm font-medium ${p.amount < 0 ? "text-neutral-700" : ""}`}>
                  {p.amount < 0 ? "-" : ""}{formatMoney(Math.abs(p.amount))}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------- Payment History ----------------
function PaymentsPage({ onNavigateHome }) {
  const payments = Array.from({ length: 12 }).map((_, i) => ({
    date: `2025-${(i + 1).toString().padStart(2, "0")}-20`,
    total: `$${(120 + i).toFixed(2)}`,
    principal: `$${(35 + i).toFixed(2)}`,
    interest: `$75.25`,
    fees: `$15.00`,
  }));

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onNavigateHome}
          className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-5 w-5 text-neutral-600" />
        </button>
        <h1 className="text-xl font-semibold">Payment History</h1>
      </div>
      <ul className="divide-y divide-neutral-200">
        {payments.map((p, i) => (
          <li key={i} className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-neutral-800">{p.date}</div>
                <div className="text-xs text-neutral-500">Principal {p.principal} · Interest {p.interest} · Fees {p.fees}</div>
              </div>
              <div className="text-sm font-medium">{p.total}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------- Draw ----------------
function DrawPage({ onDrawSubmitted, onNavigateHome }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [fundingMethod, setFundingMethod] = useState("direct-deposit");
  const [isInteracEligible, setIsInteracEligible] = useState(true); // Simulate eligibility check
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNumberPad, setShowNumberPad] = useState(false);

  const maxAvailable = 2800;
  const parsedAmount = Number(amount.replace(/[^0-9.]/g, ""));
  const isValidAmount = !Number.isNaN(parsedAmount) && parsedAmount >= 1 && parsedAmount <= maxAvailable;
  const amountError = amount && !isValidAmount ? `Exceeds available draw limit of $${maxAvailable.toLocaleString()}` : "";

  const fastAmounts = [
    { label: "25%", value: Math.round(maxAvailable * 0.25) },
    { label: "50%", value: Math.round(maxAvailable * 0.5) },
    { label: "75%", value: Math.round(maxAvailable * 0.75) },
    { label: "Max", value: maxAvailable }
  ];

  const getArrivalDate = () => {
    const today = new Date();
    const arrivalDate = new Date(today);
    if (fundingMethod === "interac") {
      arrivalDate.setHours(today.getHours() + 1); // Within 1 hour
    } else {
      arrivalDate.setDate(today.getDate() + 3); // 1-3 business days
    }
    return arrivalDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleConfirm = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      // Call the parent component with draw data
      if (onDrawSubmitted) {
        onDrawSubmitted({
          amount: parsedAmount,
          fundingMethod: fundingMethod
        });
      }
    }, 2000);
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setAmount("");
    setFundingMethod("direct-deposit");
    setIsProcessing(false);
    setIsSuccess(false);
    setShowNumberPad(false);
  };

  const handleAmountChange = (newAmount) => {
    setAmount(newAmount.toString());
  };

  if (isSuccess) {
    return (
      <div className="p-4">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold mb-2">Draw Request Submitted</h1>
          <p className="text-sm text-neutral-600 mb-6">
            Your draw request for <span className="font-medium">${parsedAmount.toLocaleString()}</span> is processing.
          </p>
          <div className="bg-neutral-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-medium text-sm mb-2">Next Steps</h3>
            <ul className="text-xs text-neutral-600 space-y-1">
              <li>• Funds will arrive via {fundingMethod === "interac" ? "Interac e-Transfer" : "Direct Deposit"}</li>
              <li>• Expected arrival: {getArrivalDate()}</li>
              <li>• Your available credit will update once processed</li>
            </ul>
          </div>
          <button 
            onClick={resetFlow}
            className="w-full rounded-xl bg-neutral-900 py-3 text-sm font-medium text-white mb-2"
          >
            Make Another Draw
          </button>
          <button 
            onClick={onNavigateHome}
            className="w-full rounded-xl border border-neutral-300 py-3 text-sm font-medium text-neutral-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Draw Funds</h1>
        <div className="text-xs text-neutral-500">
          Step {currentStep} of 3
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
              step <= currentStep ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-500'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-12 h-0.5 mx-2 ${
                step < currentStep ? 'bg-neutral-900' : 'bg-neutral-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Enter Amount */}
      {currentStep === 1 && (
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-medium mb-1">How much would you like to draw?</h2>
            <p className="text-sm text-neutral-600">Available to draw: <span className="font-medium">${maxAvailable.toLocaleString()}</span></p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Amount (CAD)</label>
            <button
              onClick={() => setShowNumberPad(true)}
              className={`w-full rounded-xl border px-3 py-3 text-lg text-left ${amountError ? 'border-red-400' : 'border-neutral-300'} hover:bg-neutral-50 transition-colors`}
            >
              {amount ? `$${parsedAmount.toLocaleString()}` : '$0.00'}
            </button>
            {amountError && <p className="mt-1 text-xs text-red-600">{amountError}</p>}
          </div>

          {/* Fast amount buttons */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Quick select</p>
            <div className="grid grid-cols-2 gap-2">
              {fastAmounts.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setAmount(option.value.toString())}
                  className="rounded-xl border border-neutral-300 py-2 text-sm font-medium hover:bg-neutral-50"
                >
                  {option.label} (${option.value.toLocaleString()})
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentStep(2)}
            disabled={!isValidAmount}
            className={`w-full rounded-xl py-3 text-sm font-medium text-white ${
              isValidAmount ? 'bg-neutral-900' : 'bg-neutral-300 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Choose Funding Method */}
      {currentStep === 2 && (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-1">Choose funding method</h2>
            <p className="text-sm text-neutral-600">Select how you'd like to receive your funds</p>
          </div>

          <div className="space-y-3 mb-6">
            {/* Direct Deposit */}
            <label className={`block rounded-xl border p-4 cursor-pointer ${
              fundingMethod === "direct-deposit" ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200'
            }`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="fundingMethod"
                  value="direct-deposit"
                  checked={fundingMethod === "direct-deposit"}
                  onChange={(e) => setFundingMethod(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">Direct Deposit</div>
                  <div className="text-xs text-neutral-600 mt-1">
                    Funds will arrive in 1–3 business days
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    No fees • Deposited to your linked bank account
                  </div>
                </div>
              </div>
            </label>

            {/* Interac e-Transfer */}
            <label className={`block rounded-xl border p-4 cursor-pointer ${
              fundingMethod === "interac" ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200'
            } ${!isInteracEligible ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="fundingMethod"
                  value="interac"
                  checked={fundingMethod === "interac"}
                  onChange={(e) => setFundingMethod(e.target.value)}
                  disabled={!isInteracEligible}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm flex items-center gap-2">
                    Interac e-Transfer
                    {!isInteracEligible && (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                        Not enrolled
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-600 mt-1">
                    Instant / within minutes
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {isInteracEligible ? 'No fees • Sent to your email' : 'You\'re not enrolled in the Money Bundle'}
                  </div>
                </div>
              </div>
            </label>
          </div>

          {!isInteracEligible && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
              <p className="text-xs text-amber-800">
                To use Interac e-Transfer, you need to be enrolled in the Money Bundle. 
                <button className="underline ml-1">Enroll now</button>
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex-1 rounded-xl border border-neutral-300 py-3 text-sm font-medium text-neutral-700"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex-1 rounded-xl bg-neutral-900 py-3 text-sm font-medium text-white"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Confirm */}
      {currentStep === 3 && (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-1">Review your draw request</h2>
            <p className="text-sm text-neutral-600">Please confirm the details before submitting</p>
          </div>

          <div className="bg-neutral-50 rounded-xl p-4 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Draw amount</span>
                <span className="text-sm font-medium">${parsedAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Funding method</span>
                <span className="text-sm font-medium">
                  {fundingMethod === "interac" ? "Interac e-Transfer" : "Direct Deposit"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-neutral-600">Estimated arrival</span>
                <span className="text-sm font-medium">{getArrivalDate()}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Your available credit will be reduced by ${parsedAmount.toLocaleString()} once this draw is processed.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex-1 rounded-xl border border-neutral-300 py-3 text-sm font-medium text-neutral-700"
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className={`flex-1 rounded-xl py-3 text-sm font-medium text-white ${
                isProcessing ? 'bg-neutral-400 cursor-not-allowed' : 'bg-neutral-900'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Confirm Draw'}
            </button>
          </div>
        </div>
      )}

      {/* NumberPad Modal */}
      <NumberPad
        open={showNumberPad}
        onClose={() => setShowNumberPad(false)}
        onChange={handleAmountChange}
        value={parsedAmount || 0}
        min={1}
        max={maxAvailable}
        title="Enter Draw Amount"
      />
    </div>
  );
}

// ---------------- Docs ----------------
function DocsPage() {
  const statements = [
    { month: "Sep 2025", date: "Sep 20, 2025", amount: "$420.00", status: "current" },
    { month: "Aug 2025", date: "Aug 20, 2025", amount: "$420.00", status: "available" },
    { month: "Jul 2025", date: "Jul 20, 2025", amount: "$420.00", status: "available" },
    { month: "Jun 2025", date: "Jun 20, 2025", amount: "$420.00", status: "available" },
  ];

  const agreements = [
    { name: "Line of Credit Agreement", date: "Jan 15, 2025", type: "agreement" },
    { name: "Loan Protection Agreement", date: "Jan 15, 2025", type: "agreement" },
  ];

  const handleDownload = (item, type) => {
    const fileName = type === 'statement' 
      ? `statement-${item.month.toLowerCase().replace(' ', '-')}.pdf`
      : `${item.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    
    alert(`Downloading ${fileName}...\n\nThis would trigger a real PDF download in production.`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Documents</h1>
      
      {/* Statements Section */}
      <div className="mb-6 rounded-2xl border border-neutral-200 p-4">
        <h2 className="text-base font-medium mb-3">Statements</h2>
        <div className="space-y-2">
          {statements.map((statement, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-b-0">
              <div className="flex-1">
                <div className="text-sm font-medium text-neutral-800">{statement.month}</div>
                <div className="text-xs text-neutral-500">{statement.date} · {statement.amount}</div>
                {statement.status === 'current' && (
                  <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDownload(statement, 'statement')}
                  className="text-xs text-blue-600 hover:underline"
                >
                  View
                </button>
                <button 
                  onClick={() => handleDownload(statement, 'statement')}
                  className="text-xs bg-neutral-900 text-white px-2 py-1 rounded hover:bg-neutral-800"
                >
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agreements Section */}
      <div className="mb-6 rounded-2xl border border-neutral-200 p-4">
        <h2 className="text-base font-medium mb-3">Agreements</h2>
        <div className="space-y-2">
          {agreements.map((agreement, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-b-0">
              <div className="flex-1">
                <div className="text-sm font-medium text-neutral-800">{agreement.name}</div>
                <div className="text-xs text-neutral-500">Signed {agreement.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDownload(agreement, 'agreement')}
                  className="text-xs text-blue-600 hover:underline"
                >
                  View
                </button>
                <button 
                  onClick={() => handleDownload(agreement, 'agreement')}
                  className="text-xs bg-neutral-900 text-white px-2 py-1 rounded hover:bg-neutral-800"
                >
                  PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------- More ----------------
function MorePage() {
  const [showMailSettings, setShowMailSettings] = useState(false);
  const [mailDeliveryEnabled, setMailDeliveryEnabled] = useState(false);
  const [mailAddress, setMailAddress] = useState("123 Main St, Toronto, ON M1A 1A1");

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">More</h1>
      
      {/* Profile & Settings */}
      <div className="mb-4 rounded-2xl border border-neutral-200 p-4">
        <h2 className="text-base font-medium mb-1">Profile & Settings</h2>
        <p className="text-sm text-neutral-600 mb-3">Update contact, mailing prefs, bundle enrollment.</p>
        <button 
          onClick={() => setShowMailSettings(true)}
          className="text-sm text-blue-600 hover:underline"
        >
          Manage Statement Delivery →
        </button>
      </div>

      {/* Support */}
      <div className="mb-4 rounded-2xl border border-neutral-200 p-4">
        <h2 className="text-base font-medium mb-1">Support</h2>
        <p className="text-sm text-neutral-600 mb-3">Chat with us or visit Help Center.</p>
        <div className="flex gap-2">
          <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
            Start Chat
          </button>
          <button className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
            Help Center
          </button>
        </div>
      </div>

      {/* Mail Delivery Settings Modal */}
      {showMailSettings && (
        <Modal title="Statement Delivery Settings" onClose={() => setShowMailSettings(false)}>
          <div className="space-y-4">
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
              <p className="text-sm text-blue-800">
                <strong>Current delivery method:</strong> {mailDeliveryEnabled ? "Email + Mail" : "Email only"}
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={mailDeliveryEnabled}
                  onChange={(e) => setMailDeliveryEnabled(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <div className="text-sm font-medium">Receive statements by mail</div>
                  <div className="text-xs text-neutral-600 mt-1">
                    Get a physical copy of your monthly statements delivered to your registered address
                  </div>
                </div>
              </label>

              {mailDeliveryEnabled && (
                <div className="ml-6 space-y-2">
                  <label className="block text-sm font-medium">Mailing Address</label>
                  <div className="rounded-lg border border-neutral-300 p-3 bg-neutral-50">
                    <p className="text-sm text-neutral-700">{mailAddress}</p>
                    <button className="text-xs text-blue-600 hover:underline mt-1">
                      Update address
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Mail delivery takes 5-7 business days after statement generation
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowMailSettings(false)}
                className="flex-1 rounded-xl border border-neutral-300 py-2 text-sm font-medium text-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Simulate saving settings
                  setShowMailSettings(false);
                }}
                className="flex-1 rounded-xl bg-neutral-900 py-2 text-sm font-medium text-white"
              >
                Save Settings
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ---------------- Extra Principal Components ----------------
function StatementToggle() {
  // Demo-only visual (no-op). Real wiring would come from API state.
  const [issued, setIssued] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setIssued(!issued)}
      className={`rounded-md border px-2 py-1 text-xs ${issued ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-neutral-300 text-neutral-600'}`}
      title="Demo toggle"
    >
      {issued ? 'Statement: Issued' : 'Statement: Not issued'}
    </button>
  );
}

function ExtraPrincipalForm({ principalBalance, nextMinimumDate, statementDate, onPaymentSubmitted }) {
  const [amount, setAmount] = useState("");
  const [statementIssued, setStatementIssued] = useState(false); // simulate API: toggled for demo
  const [submitted, setSubmitted] = useState(false);
  const [showNumberPad, setShowNumberPad] = useState(false);

  const parsed = Number(amount.replace(/[^0-9.]/g, ""));
  const valid = !Number.isNaN(parsed) && parsed >= 1 && parsed <= principalBalance;
  const error = amount && !valid ? `Enter $1–$${principalBalance.toLocaleString()}` : "";

  // Messaging: if statement issued, apply to following cycle; else to next due date
  const appliesText = statementIssued
    ? `Statement already delivered — this extra principal will be added to the following cycle.`
    : `This extra principal will be added to your next scheduled payment on ${nextMinimumDate}.`;

  const presets = [25, 50, 100];

  const onSubmit = (e) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitted(true);
    // Notify parent component that extra payment was submitted
    if (onPaymentSubmitted) {
      onPaymentSubmitted(parsed);
    }
  };

  const handleAmountChange = (newAmount) => {
    setAmount(newAmount.toString());
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm text-neutral-700">Amount (CAD)</label>
        {/* Demo toggle to simulate statement delivery */}
        <button type="button" className="text-xs underline text-neutral-600" onClick={() => setStatementIssued(!statementIssued)}>
          {statementIssued ? 'Simulate: statement issued' : 'Simulate: statement not issued'}
        </button>
      </div>
      <button
        type="button"
        onClick={() => setShowNumberPad(true)}
        className={`w-full rounded-xl border px-3 py-2 text-left ${error ? 'border-red-400' : 'border-neutral-300'} hover:bg-neutral-50 transition-colors`}
      >
        {amount ? `$${parsed.toLocaleString()}` : '$0.00'}
      </button>
      <div className="flex gap-2">
        {presets.map((p) => (
          <button key={p} type="button" className="rounded-md border border-neutral-300 px-2 py-1 text-xs" onClick={() => setAmount(String(p))}>
            ${p}
          </button>
        ))}
        <button type="button" className="rounded-md border border-neutral-300 px-2 py-1 text-xs" onClick={() => setAmount(String(Math.min(principalBalance, Math.round(principalBalance))))}>
          Max
        </button>
      </div>
      <p className="text-xs text-neutral-500">You can add between $1 and ${principalBalance.toLocaleString()} (up to current principal balance).</p>
      <p className="text-xs text-neutral-600">Next statement date: {statementDate} · Next minimum payment date: {nextMinimumDate}</p>
      <p className="text-xs text-neutral-600">{appliesText}</p>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button disabled={!valid} className={`w-full rounded-xl py-3 text-sm font-medium text-white ${valid ? 'bg-neutral-900' : 'bg-neutral-300 cursor-not-allowed'}`}>
        Add to next payment
      </button>
      {submitted && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          Extra principal of <strong>${parsed.toFixed(2)}</strong> scheduled. {appliesText}
        </div>
      )}

      {/* NumberPad Modal */}
      <NumberPad
        open={showNumberPad}
        onClose={() => setShowNumberPad(false)}
        onChange={handleAmountChange}
        value={parsed || 0}
        min={1}
        max={principalBalance}
        title="Enter Extra Principal Amount"
      />
    </form>
  );
}

// ---------------- Pay In Full Form ----------------
function PayInFullForm({ estimatedPayoff, nextMinimumDate, statementDate, onPayoffScheduled }) {
  const [statementIssued, setStatementIssued] = useState(false); // simulate API
  const [confirm, setConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const appliesText = statementIssued
    ? `Statement already delivered — your payoff will be scheduled for the following cycle.`
    : `Your LOC will be paid in full on your next scheduled payment date (${nextMinimumDate}).`;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!confirm) return;
    setSubmitted(true);
    // Notify parent component that payoff was scheduled
    if (onPayoffScheduled) {
      onPayoffScheduled();
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-700">Estimated payoff</div>
        <div className="text-sm font-medium">
          {new Intl.NumberFormat(undefined, { style: "currency", currency: "CAD" }).format(estimatedPayoff)}
        </div>
      </div>

      <p className="text-xs text-neutral-600">
        Next statement date: {statementDate} · Next minimum payment date: {nextMinimumDate}
      </p>
      <p className="text-xs text-neutral-600">{appliesText}</p>

      {/* Demo toggle to simulate statement delivery */}
      <button
        type="button"
        className="text-xs underline text-neutral-600"
        onClick={() => setStatementIssued(!statementIssued)}
      >
        {statementIssued ? "Simulate: statement issued" : "Simulate: statement not issued"}
      </button>

      <label className="flex items-start gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={confirm}
          onChange={(e) => setConfirm(e.target.checked)}
        />
        <span>
          I authorize the financial institution to debit the full payoff amount on {statementIssued ? "the following cycle date" : nextMinimumDate}.
          I understand interest may continue to accrue until the payoff date.
        </span>
      </label>

      <button
        disabled={!confirm}
        className={`w-full rounded-xl py-3 text-sm font-medium text-white ${confirm ? "bg-neutral-900" : "bg-neutral-300 cursor-not-allowed"}`}
      >
        Schedule payoff
      </button>

      {submitted && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          Payoff scheduled. {appliesText}
        </div>
      )}
    </form>
  );
}

// ---------------- UI Components ----------------
function Tile({ label, value, note, action }) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-3">
      <div className="text-xs uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
      {note && (
        <div className="mt-1 text-xs text-neutral-500 flex items-center gap-1">
          <Info className="h-3.5 w-3.5" /> {note}
        </div>
      )}
      {action && action}
    </div>
  );
}

function ActionButton({ label, onClick }) {
  return <button onClick={onClick} className="rounded-xl bg-neutral-900 py-3 text-sm font-medium text-white w-full">{label}</button>;
}

function Section({ title, text }) {
  return (
    <div className="mb-4 rounded-2xl border border-neutral-200 p-4">
      <h2 className="text-base font-medium mb-1">{title}</h2>
      <p className="text-sm text-neutral-600">{text}</p>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-[90%] max-w-md rounded-2xl bg-white p-4 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <h3 id="modal-title" className="text-base font-medium">{title}</h3>
          <button aria-label="Close" className="rounded-md border border-neutral-200 px-2 py-1 text-xs" onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
