"use client";

import { Modal } from "@/components/ui/modal";
import { useState, useEffect, JSX } from "react";
import { FieldLabel, InputField, SelectField } from "../../trades/others";
import toast from "react-hot-toast";
import { toApiError } from "@/server/lib/api-error";
import { logNewTrade } from "@/server/lib/api/backtest/api";

type Props = {
  backtestId: string;
  onRefetch?: () => Promise<void>;
};

const OUTCOMES = ["win", "loss", "breakeven"] as const;
const DIRECTIONS = ["buy", "sell"] as const;
const SESSIONS = ["London", "New York", "Asia", "London/NY Overlap"] as const;
const SETUPS = [
  "BOS Retest",
  "FVG Fill",
  "Liquidity Sweep",
  "OB Entry",
  "MSS + OB",
  "CHoCH Retest",
  "EQH Grab",
  "EQL Grab",
  "Asian Range Break",
  "VWAP Rejection",
  "Other",
] as const;

type Direction = "buy" | "sell";
type Outcome = "win" | "loss" | "breakeven";

interface FormState {
  direction: Direction;
  outcome: Outcome;
  entryTime: string;
  exitTime: string;
  entryPrice: string;
  exitPrice: string;
  stopLoss: string;
  takeProfit: string;
  riskReward: string;
  profitLoss: string;
  profitLossPercent: string;
  setupType: string;
  session: string;
  notes: string;
}

const INITIAL: FormState = {
  direction: "buy",
  outcome: "win",
  entryTime: "",
  exitTime: "",
  entryPrice: "",
  exitPrice: "",
  stopLoss: "",
  takeProfit: "",
  riskReward: "",
  profitLoss: "",
  profitLossPercent: "",
  setupType: "",
  session: "",
  notes: "",
};

/* ── Step config ── */
const STEPS = [
  { label: "Execution", icon: "clock" },
  { label: "Prices", icon: "chart" },
  { label: "Outcome", icon: "target" },
  { label: "Context", icon: "note" },
] as const;

type StepIndex = 0 | 1 | 2 | 3;

/* ── Icons ── */
function StepIcon({ name, active }: { name: string; active: boolean }) {
  const color = active ? "#3b82f6" : "#4b5563";
  const icons: Record<string, JSX.Element> = {
    clock: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    chart: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    target: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
    note: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  };
  return icons[name] ?? null;
}

/* ── Stepper bar ── */
function Stepper({ current, total }: { current: StepIndex; total: number }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((step, i) => (
        <div
          key={step.label}
          className="flex items-center flex-1 last:flex-none"
        >
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border ${
                i < current
                  ? "bg-green-500 border-green-500"
                  : i === current
                    ? "bg-[#1e2a3a] border-blue-500 ring-2 ring-blue-500/30"
                    : "bg-[#0f1117] border-[#1e2a3a]"
              }`}
            >
              {i < current ? (
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <StepIcon name={step.icon} active={i === current} />
              )}
            </div>
            <span
              className={`text-[10px] font-medium whitespace-nowrap hidden sm:block transition-colors ${
                i === current
                  ? "text-blue-400"
                  : i < current
                    ? "text-green-400"
                    : "text-gray-600"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < total - 1 && (
            <div
              className={`flex-1 h-px mx-2 mb-3 sm:mb-4 transition-colors ${
                i < current ? "bg-green-500/40" : "bg-[#1e2a3a]"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Auto-compute RR from prices ── */
function computeRR(
  direction: Direction,
  entry: string,
  exit: string,
  sl: string,
): string {
  const ep = parseFloat(entry);
  const xp = parseFloat(exit);
  const s = parseFloat(sl);
  if (!ep || !xp || !s) return "";
  const slDist = Math.abs(ep - s);
  if (slDist === 0) return "";
  const diff = direction === "buy" ? xp - ep : ep - xp;
  return (diff / slDist).toFixed(2);
}

/* ── Direction toggle ── */
function DirectionToggle({
  value,
  onChange,
}: {
  value: Direction;
  onChange: (v: Direction) => void;
}) {
  return (
    <div className="grid grid-cols-2 rounded-lg overflow-hidden border border-[#1e2a3a]">
      {(["buy", "sell"] as Direction[]).map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => onChange(d)}
          className={`py-2.5 text-sm font-semibold transition-colors capitalize ${
            value === d
              ? d === "buy"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
              : "bg-[#0f1117] text-gray-500 hover:text-gray-300"
          }`}
        >
          {d === "buy" ? "▲ Buy" : "▼ Sell"}
        </button>
      ))}
    </div>
  );
}

/* ── Outcome toggle ── */
function OutcomeToggle({
  value,
  onChange,
}: {
  value: Outcome;
  onChange: (v: Outcome) => void;
}) {
  const map: Record<Outcome, string> = {
    win: "bg-green-600 text-white",
    loss: "bg-red-600 text-white",
    breakeven: "bg-yellow-600 text-white",
  };
  return (
    <div className="grid grid-cols-3 rounded-lg overflow-hidden border border-[#1e2a3a]">
      {(["win", "loss", "breakeven"] as Outcome[]).map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`py-2.5 text-sm font-semibold transition-colors capitalize ${
            value === o ? map[o] : " text-gray-500 hover:text-gray-300"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/* ── Summary pill ── */
function SummaryPill({
  label,
  value,
  color = "text-white",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="bg-[#0f1117] border border-[#1e2a3a] rounded-xl px-4 py-3 flex flex-col gap-0.5">
      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
        {label}
      </span>
      <span className={`text-base font-bold ${color}`}>{value || "—"}</span>
    </div>
  );
}

/* ──────────────────────────────────────────
   Main component
────────────────────────────────────────── */
const TradeLogModal = ({ backtestId, onRefetch }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<StepIndex>(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const set =
    <K extends keyof FormState>(key: K) =>
    (val: FormState[K]) =>
      setForm((p) => ({ ...p, [key]: val }));

  /* auto-compute RR whenever prices change */
  useEffect(() => {
    const rr = computeRR(
      form.direction,
      form.entryPrice,
      form.exitPrice,
      form.stopLoss,
    );
    if (rr) setForm((p) => ({ ...p, riskReward: rr }));
  }, [form.direction, form.entryPrice, form.exitPrice, form.stopLoss]);

  /* reset on close */
  const handleClose = () => {
    setIsOpen(false);
    setStep(0);
    setForm(INITIAL);
    setErrors({});
  };

  /* per-step validation */
  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};

    if (step === 0) {
      if (!form.entryTime) e.entryTime = "Required";
    }
    if (step === 1) {
      if (!form.entryPrice || isNaN(Number(form.entryPrice)))
        e.entryPrice = "Required";
      if (!form.stopLoss || isNaN(Number(form.stopLoss)))
        e.stopLoss = "Required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setStep((s) => Math.min(s + 1, 3) as StepIndex);
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0) as StepIndex);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsLoading(true);
    try {
      await logNewTrade(
        {
          direction: form.direction,
          outcome: form.outcome,
          entryTime: form.entryTime,
          exitTime: form.exitTime,
          entryPrice: Number(form.entryPrice),
          exitPrice: Number(form.exitPrice),
          stopLoss: Number(form.stopLoss),
          takeProfit: Number(form.takeProfit),
          riskReward: Number(form.riskReward),
          profitLoss: Number(form.profitLoss),
          profitLossPercent: Number(form.profitLossPercent),
          setupType: form.setupType,
          session: form.session,
          notes: form.notes,
        },
        backtestId,
      );

      toast.success("Trade logged successfully");
      handleClose();
      if (onRefetch) await onRefetch();
    } catch (err) {
      const { message } = toApiError(err);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Rendered step content ── */
  const renderStep = () => {
    switch (step) {
      /* Step 0 — Execution */
      case 0:
        return (
          <div className="flex flex-col gap-4">
            <div>
              <FieldLabel>Direction</FieldLabel>
              <DirectionToggle
                value={form.direction}
                onChange={set("direction")}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Entry time</FieldLabel>
                <InputField
                  type="datetime-local"
                  value={form.entryTime}
                  onChange={(e) => set("entryTime")(e.target.value)}
                />
                {errors.entryTime && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.entryTime}
                  </p>
                )}
              </div>
              <div>
                <FieldLabel>
                  Exit time{" "}
                  <span className="text-gray-600 text-[10px]">(optional)</span>
                </FieldLabel>
                <InputField
                  type="datetime-local"
                  value={form.exitTime}
                  onChange={(e) => set("exitTime")(e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      /* Step 1 — Prices */
      case 1:
        return (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Entry price</FieldLabel>
                <InputField
                  type="number"
                  value={form.entryPrice}
                  onChange={(e) => set("entryPrice")(e.target.value)}
                  placeholder="e.g. 1.2654"
                />
                {errors.entryPrice && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.entryPrice}
                  </p>
                )}
              </div>
              <div>
                <FieldLabel>
                  Exit price{" "}
                  <span className="text-gray-600 text-[10px]">(optional)</span>
                </FieldLabel>
                <InputField
                  type="number"
                  value={form.exitPrice}
                  onChange={(e) => set("exitPrice")(e.target.value)}
                  placeholder="e.g. 1.2748"
                />
              </div>
              <div>
                <FieldLabel>Stop loss</FieldLabel>
                <InputField
                  type="number"
                  value={form.stopLoss}
                  onChange={(e) => set("stopLoss")(e.target.value)}
                  placeholder="e.g. 1.2610"
                />
                {errors.stopLoss && (
                  <p className="text-xs text-red-400 mt-1">{errors.stopLoss}</p>
                )}
              </div>
              <div>
                <FieldLabel>
                  Take profit{" "}
                  <span className="text-gray-600 text-[10px]">(optional)</span>
                </FieldLabel>
                <InputField
                  type="number"
                  value={form.takeProfit}
                  onChange={(e) => set("takeProfit")(e.target.value)}
                  placeholder="e.g. 1.2760"
                />
              </div>
            </div>

            {/* auto-computed RR preview */}
            {form.riskReward && (
              <div className="flex items-center gap-2 bg-blue-600/10 border border-blue-500/25 rounded-xl px-4 py-3">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span className="text-xs text-gray-400">
                  Auto-computed R:R —{" "}
                  <span
                    className={`font-bold ${Number(form.riskReward) >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {form.riskReward}R
                  </span>
                </span>
              </div>
            )}
          </div>
        );

      /* Step 2 — Outcome */
      case 2:
        return (
          <div className="flex flex-col gap-4">
            <div>
              <FieldLabel>Outcome</FieldLabel>
              <OutcomeToggle value={form.outcome} onChange={set("outcome")} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <FieldLabel>R:R</FieldLabel>
                <InputField
                  type="number"
                  value={form.riskReward}
                  onChange={(e) => set("riskReward")(e.target.value)}
                  placeholder="2.5"
                />
              </div>
              <div>
                <FieldLabel>P&L ($)</FieldLabel>
                <InputField
                  type="number"
                  value={form.profitLoss}
                  onChange={(e) => set("profitLoss")(e.target.value)}
                  placeholder="450"
                />
              </div>
              <div>
                <FieldLabel>P&L (%)</FieldLabel>
                <InputField
                  type="number"
                  value={form.profitLossPercent}
                  onChange={(e) => set("profitLossPercent")(e.target.value)}
                  placeholder="4.5"
                />
              </div>
            </div>

            {/* Trade summary */}
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-2">
                Trade summary
              </p>
              <div className="grid grid-cols-2 gap-2">
                <SummaryPill
                  label="Direction"
                  value={form.direction.toUpperCase()}
                  color={
                    form.direction === "buy" ? "text-green-400" : "text-red-400"
                  }
                />
                <SummaryPill
                  label="Entry → Exit"
                  value={
                    form.entryPrice && form.exitPrice
                      ? `${form.entryPrice} → ${form.exitPrice}`
                      : form.entryPrice || ""
                  }
                />
                <SummaryPill
                  label="Stop Loss"
                  value={form.stopLoss}
                  color="text-red-400"
                />
                <SummaryPill
                  label="Take Profit"
                  value={form.takeProfit}
                  color="text-green-400"
                />
              </div>
            </div>
          </div>
        );

      /* Step 3 — Context */
      case 3:
        return (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Setup type</FieldLabel>
                <SelectField
                  options={SETUPS as unknown as string[]}
                  defaultValue={form.setupType || ""}
                  onChange={(v: string) => set("setupType")(v)}
                />
              </div>
              <div>
                <FieldLabel>Session</FieldLabel>
                <SelectField
                  options={SESSIONS as unknown as string[]}
                  defaultValue={form.session || ""}
                  onChange={(v: string) => set("session")(v)}
                />
              </div>
            </div>

            <div>
              <FieldLabel>
                Notes{" "}
                <span className="text-gray-600 text-[10px]">(optional)</span>
              </FieldLabel>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes")(e.target.value)}
                rows={3}
                placeholder="What went well? What could improve?"
                className="w-full bg-[#0f1117] border border-[#1e2a3a] focus:border-blue-500/50 rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none resize-none transition-colors"
              />
            </div>

            {/* Final summary */}
            <div className="bg-[#0f1117] border border-[#1e2a3a] rounded-xl p-4">
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-3">
                Ready to log
              </p>
              <div className="grid grid-cols-3 gap-y-2 text-xs">
                {[
                  {
                    label: "Direction",
                    value: form.direction,
                    color:
                      form.direction === "buy"
                        ? "text-green-400"
                        : "text-red-400",
                  },
                  {
                    label: "Outcome",
                    value: form.outcome,
                    color:
                      form.outcome === "win"
                        ? "text-green-400"
                        : form.outcome === "loss"
                          ? "text-red-400"
                          : "text-yellow-400",
                  },
                  {
                    label: "R:R",
                    value: form.riskReward ? `${form.riskReward}R` : "—",
                    color: "text-blue-400",
                  },
                  {
                    label: "Entry",
                    value: form.entryPrice || "—",
                    color: "text-gray-300",
                  },
                  {
                    label: "Exit",
                    value: form.exitPrice || "—",
                    color: "text-gray-300",
                  },
                  {
                    label: "P&L",
                    value: form.profitLoss ? `$${form.profitLoss}` : "—",
                    color:
                      Number(form.profitLoss) >= 0
                        ? "text-green-400"
                        : "text-red-400",
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-gray-600">{item.label}</p>
                    <p className={`font-semibold capitalize ${item.color}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-green-600 hover:bg-green-500 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Log Trade
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title="Log Backtest Trade">
        {/* Stepper */}
        <Stepper current={step} total={STEPS.length} />

        {/* Step label */}
        <div className="mb-4">
          <p className="text-xs text-gray-500">
            Step {step + 1} of {STEPS.length} —{" "}
            <span className="text-gray-300 font-medium">
              {STEPS[step].label}
            </span>
          </p>
        </div>

        {/* Step content */}
        <div className="min-h-[200px]">{renderStep()}</div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#1e2a3a]">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Continue
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Save Trade
                </>
              )}
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TradeLogModal;
