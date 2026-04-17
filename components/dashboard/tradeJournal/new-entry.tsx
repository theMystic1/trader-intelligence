import { useState } from "react";
import { FieldLabel } from "../trades/others";
import {
  FeelingsToggle,
  SelectInput,
  TagList,
  TextareaInput,
  TextInput,
} from "./others";
import { FormState, TradeOutcome, TradeType } from "@/types";
import { FORM_STEPS, INITIAL_FORM } from "@/lib/constants";

export default function NewEntryForm({
  onClose,
  onSave,
  saving,
}: {
  onClose: () => void;
  onSave: (entry: FormState) => void;
  saving: boolean;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const set =
    <K extends keyof FormState>(key: K) =>
    (val: FormState[K]) =>
      setForm((p) => ({ ...p, [key]: val }));

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (step === 0) {
      if (!form.date) e.date = "Required";
      if (!form.pair) e.pair = "Required";
      if (!form.riskReward) e.riskReward = "Required";
    }
    if (step === 1) {
      if (!form.entryCriteria) e.entryCriteria = "Required";
      if (!form.entryConfirmation) e.entryConfirmation = "Required";
      if (!form.exitTime) e.exitTime = "Required";
      if (!form.tradeManagement) e.tradeManagement = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate()) setStep((s) => Math.min(s + 1, FORM_STEPS.length - 1));
  };
  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  return (
    <div className=" rounded-2xl overflow-hidden flex flex-col h-full">
      {/* Header */}

      {/* Step tabs */}
      <div className="flex border-b border-[#1e2a3a]">
        {FORM_STEPS.map((label, i) => (
          <div
            key={label}
            className={`flex-1 py-2.5 text-center text-xs font-semibold transition-colors ${
              i === step
                ? "text-blue-400 border-b-2 border-blue-500"
                : i < step
                  ? "text-green-400"
                  : "text-gray-600"
            }`}
          >
            {i < step ? "✓ " : ""}
            {label}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
        {/* ── Step 0: Trade Info ── */}
        {step === 0 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Date</FieldLabel>
                <TextInput
                  type="date"
                  value={form.date}
                  onChange={set("date")}
                />
                {errors.date && (
                  <p className="text-xs text-red-400 mt-1">{errors.date}</p>
                )}
              </div>
              <div>
                <FieldLabel>Pair</FieldLabel>
                <TextInput
                  value={form.pair}
                  onChange={set("pair")}
                  placeholder="e.g. EURUSD"
                />
                {errors.pair && (
                  <p className="text-xs text-red-400 mt-1">{errors.pair}</p>
                )}
              </div>
            </div>

            <div>
              <FieldLabel>Direction</FieldLabel>
              <div className="grid grid-cols-2 rounded-lg overflow-hidden border border-[#1e2a3a]">
                {(["LONG", "SHORT"] as TradeType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("type")(t)}
                    className={`py-2.5 text-sm font-semibold transition-colors ${
                      form.type === t
                        ? t === "LONG"
                          ? "bg-blue-600 text-white"
                          : t === "SHORT"
                            ? " text-white bg-red-600"
                            : "bg-[#0f1117] text-gray-100 hover:text-gray-300"
                        : "bg-[#0f1117] text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {t === "LONG" ? "▲ Long" : "▼ Short"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Session</FieldLabel>
                <SelectInput
                  value={form.session}
                  onChange={set("session")}
                  options={["NY", "London", "Asian"] as const}
                />
              </div>
              <div>
                <FieldLabel>Outcome</FieldLabel>
                <div className="grid grid-cols-3 rounded-lg overflow-hidden border border-[#1e2a3a]">
                  {(["TP", "SL", "BE"] as TradeOutcome[]).map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => set("tradeOutcome")(o)}
                      className={`py-2.5 text-xs font-bold transition-colors ${
                        form.tradeOutcome === o
                          ? o === "TP"
                            ? "bg-green-600 text-white"
                            : o === "SL"
                              ? "bg-red-600 text-white"
                              : "bg-yellow-500 text-white" // ✅ fixed BE
                          : "bg-[#0f1117] text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <FieldLabel>Risk : Reward</FieldLabel>
              <TextInput
                value={form.riskReward}
                onChange={set("riskReward")}
                placeholder="e.g. 1:2"
              />
              {errors.riskReward && (
                <p className="text-xs text-red-400 mt-1">{errors.riskReward}</p>
              )}
            </div>
          </>
        )}

        {/* ── Step 1: Execution ── */}
        {step === 1 && (
          <>
            <div>
              <FieldLabel>Entry Criteria</FieldLabel>
              <TextareaInput
                value={form.entryCriteria}
                onChange={set("entryCriteria")}
                placeholder="What was your reason for entering this trade?"
                rows={3}
              />
              {errors.entryCriteria && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.entryCriteria}
                </p>
              )}
            </div>
            <div>
              <FieldLabel>Entry Confirmation</FieldLabel>
              <TextareaInput
                value={form.entryConfirmation}
                onChange={set("entryConfirmation")}
                placeholder="What confirmed your entry trigger?"
                rows={3}
              />
              {errors.entryConfirmation && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.entryConfirmation}
                </p>
              )}
            </div>
            <div>
              <FieldLabel>Exit Time</FieldLabel>
              <TextInput
                type="time"
                value={form.exitTime}
                onChange={set("exitTime")}
              />
              {errors.exitTime && (
                <p className="text-xs text-red-400 mt-1">{errors.exitTime}</p>
              )}
            </div>
            <div>
              <FieldLabel>Trade Management</FieldLabel>
              <TextareaInput
                value={form.tradeManagement}
                onChange={set("tradeManagement")}
                placeholder="How did you manage this trade once open?"
                rows={3}
              />
              {errors.tradeManagement && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.tradeManagement}
                </p>
              )}
            </div>
          </>
        )}

        {/* ── Step 2: Psychology ── */}
        {step === 2 && (
          <>
            <div>
              <FieldLabel>Feelings during this trade</FieldLabel>
              <FeelingsToggle
                selected={form.feelings}
                onChange={set("feelings")}
              />
            </div>
            <div>
              <FieldLabel>Mistakes</FieldLabel>
              <TagList
                items={form.mistakes}
                onChange={set("mistakes")}
                placeholder="What did you do wrong?"
                addLabel="Add"
              />
            </div>
            <div>
              <FieldLabel>What I Did Right</FieldLabel>
              <TagList
                items={form.rightDeeds}
                onChange={set("rightDeeds")}
                placeholder="What did you execute well?"
                addLabel="Add"
              />
            </div>
          </>
        )}

        {/* ── Step 3: Notes ── */}
        {step === 3 && (
          <>
            <div>
              <FieldLabel>Additional Notes</FieldLabel>
              <TextareaInput
                value={form.note}
                onChange={set("note")}
                placeholder="Any extra thoughts, observations, or lessons from this trade..."
                rows={5}
              />
            </div>
            {/* Final summary */}
            <div className="bg-[#0f1117] border border-[#1e2a3a] rounded-xl p-4">
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-3">
                Ready to save
              </p>
              <div className="grid grid-cols-2 gap-y-2">
                {[
                  { label: "Pair", value: form.pair || "—" },
                  { label: "Type", value: form.type },
                  { label: "Session", value: form.session },
                  { label: "Outcome", value: form.tradeOutcome },
                  { label: "R:R", value: form.riskReward || "—" },
                  {
                    label: "Date",
                    value: form.date
                      ? new Date(form.date).toLocaleDateString("en-GB")
                      : "—",
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[10px] text-gray-600">{item.label}</p>
                    <p className="text-xs font-semibold text-gray-300">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-[#1e2a3a]">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        {step < FORM_STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Continue
            <svg
              width="13"
              height="13"
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
            onClick={() => onSave(form)}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            {saving ? (
              <>
                {" "}
                <svg
                  className="animate-spin"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <span> Saving...</span>
              </>
            ) : (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Save Entry</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
