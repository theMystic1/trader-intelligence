import { FEELINGS_OPTIONS } from "@/lib/constants";
import { JournalEntry, Session, TradeOutcome, TradeType } from "@/types";
import { useState } from "react";

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
      {children}
    </p>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#0f1117] border border-[#1e2a3a] focus:border-blue-500/50 rounded-lg px-3 h-10 text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors"
    />
  );
}

export function TextareaInput({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-[#0f1117] border border-[#1e2a3a] focus:border-blue-500/50 rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none resize-none transition-colors"
    />
  );
}

export function SelectInput<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full appearance-none bg-[#0f1117] border border-[#1e2a3a] focus:border-blue-500/50 rounded-lg h-10 px-3 pr-8 text-sm text-gray-200 outline-none transition-colors cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#131620]">
            {o}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
}

/* ── Dynamic tag list (mistakes / rightDeeds) ── */
export function TagList({
  items,
  onChange,
  placeholder,
  addLabel,
}: {
  items: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  addLabel: string;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !items.includes(v)) onChange([...items, v]);
    setInput("");
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 bg-[#1e2a3a] text-gray-300 text-xs px-2.5 py-1 rounded-lg"
          >
            {item}
            <button
              onClick={() => remove(i)}
              className="text-gray-500 hover:text-red-400 transition-colors"
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 bg-[#0f1117] border border-[#1e2a3a] focus:border-blue-500/50 rounded-lg px-3 h-9 text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 h-9 bg-[#1e2a3a] hover:bg-[#2a3a50] border border-[#1e2a3a] rounded-lg text-xs text-gray-300 transition-colors flex-shrink-0"
        >
          {addLabel}
        </button>
      </div>
    </div>
  );
}

/* ── Feelings multi-toggle ── */
export function FeelingsToggle({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (f: string) =>
    onChange(
      selected.includes(f) ? selected.filter((x) => x !== f) : [...selected, f],
    );
  return (
    <div className="flex flex-wrap gap-2">
      {FEELINGS_OPTIONS.map((f) => {
        const on = selected.includes(f);
        const positive = [
          "Confident",
          "Patient",
          "Calm",
          "Disciplined",
          "Focused",
        ].includes(f);
        return (
          <button
            key={f}
            type="button"
            onClick={() => toggle(f)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
              on
                ? positive
                  ? "bg-green-500/15 border-green-500/40 text-green-400"
                  : "bg-red-500/15 border-red-500/40 text-red-400"
                : "bg-[#0f1117] border-[#1e2a3a] text-gray-500 hover:border-[#2a3a50] hover:text-gray-300"
            }`}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────
   Outcome / type badges
────────────────────────────────────────── */
export function OutcomeBadge({ outcome }: { outcome: TradeOutcome }) {
  const map: Record<TradeOutcome, string> = {
    TP: "bg-green-500/15 text-green-400 border-green-500/30",
    SL: "bg-red-500/15 text-red-400 border-red-500/30",
    BE: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  };
  const label: Record<TradeOutcome, string> = {
    TP: "Take Profit",
    SL: "Stop Loss",
    BE: "Breakeven",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border ${map[outcome]}`}
    >
      {label[outcome]}
    </span>
  );
}

export function TypeBadge({ type }: { type: TradeType }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${type === "LONG" ? "bg-blue-500/15 text-blue-400" : "bg-orange-500/15 text-orange-400"}`}
    >
      {type === "LONG" ? "▲" : "▼"} {type}
    </span>
  );
}

export function SessionBadge({ session }: { session: Session }) {
  return (
    <span className="text-xs text-gray-500 bg-[#1e2a3a] px-2 py-0.5 rounded">
      {session}
    </span>
  );
}

/* ──────────────────────────────────────────
   Journal Entry Card
────────────────────────────────────────── */
export function EntryCard({
  entry,
  onSelect,
}: {
  entry: JournalEntry;
  onSelect: () => void;
}) {
  const outcomeColor: Record<TradeOutcome, string> = {
    TP: "border-l-green-500",
    SL: "border-l-red-500",
    BE: "border-l-yellow-500",
  };

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left bg-[#131620] border border-[#1e2a3a] border-l-2 ${outcomeColor[entry.tradeOutcome]} rounded-xl p-4 hover:bg-[#1a2030] hover:border-[#2a3a50] transition-all group`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-white">{entry.pair}</span>
          <TypeBadge type={entry.type} />
          <OutcomeBadge outcome={entry.tradeOutcome} />
          <SessionBadge session={entry.session} />
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-500">
            {new Date(entry.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p
            className={`text-sm font-bold mt-0.5 ${entry.riskReward.startsWith("1:0") ? "text-yellow-400" : "text-blue-400"}`}
          >
            {entry.riskReward}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 line-clamp-2 mb-3">
        {entry.entryCriteria}
      </p>

      <div className="flex items-center gap-3 flex-wrap">
        {entry.feelings.slice(0, 3).map((f) => (
          <span
            key={f}
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${["Confident", "Patient", "Calm", "Disciplined", "Focused"].includes(f) ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-400"}`}
          >
            {f}
          </span>
        ))}
        {entry.mistakes.length > 0 && (
          <span className="text-[10px] text-red-400/70 flex items-center gap-1">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {entry.mistakes.length} mistake
            {entry.mistakes.length > 1 ? "s" : ""}
          </span>
        )}
        {entry.rightDeeds.length > 0 && (
          <span className="text-[10px] text-green-400/70 flex items-center gap-1">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {entry.rightDeeds.length} right deed
            {entry.rightDeeds.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
    </button>
  );
}

/* ──────────────────────────────────────────
   Detail panel
────────────────────────────────────────── */
export function EntryDetail({
  entry,
  onClose,
}: {
  entry: JournalEntry;
  onClose: () => void;
}) {
  return (
    <div className=" rounded-2xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2a3a]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base font-bold text-white">{entry.pair}</span>
          <TypeBadge type={entry.type} />
          <OutcomeBadge outcome={entry.tradeOutcome} />
        </div>
        {/*<button
          onClick={onClose}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>*/}
      </div>

      <div className="overflow-y-auto flex-1 px-5 py-5 flex flex-col gap-5">
        {/* Meta row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Date",
              value: new Date(entry.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
            },
            { label: "Session", value: entry.session },
            { label: "Exit", value: entry.exitTime },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-[#0f1117] border border-[#1e2a3a] rounded-xl px-3 py-2.5"
            >
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">
                {item.label}
              </p>
              <p className="text-sm font-semibold text-gray-200">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* RR */}
        <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">Risk : Reward</span>
          <span className="text-lg font-bold text-blue-400">
            {entry.riskReward}
          </span>
        </div>

        {/* Entry criteria */}
        <div>
          <FieldLabel>Entry Criteria</FieldLabel>
          <p className="text-sm text-gray-300 leading-relaxed">
            {entry.entryCriteria}
          </p>
        </div>

        {/* Entry confirmation */}
        <div>
          <FieldLabel>Entry Confirmation</FieldLabel>
          <p className="text-sm text-gray-300 leading-relaxed">
            {entry.entryConfirmation}
          </p>
        </div>

        {/* Trade management */}
        <div>
          <FieldLabel>Trade Management</FieldLabel>
          <p className="text-sm text-gray-300 leading-relaxed">
            {entry.tradeManagement}
          </p>
        </div>

        {/* Mistakes */}
        {entry.mistakes.length > 0 && (
          <div>
            <FieldLabel>Mistakes</FieldLabel>
            <div className="flex flex-col gap-1.5">
              {entry.mistakes.map((m, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm text-red-400"
                >
                  <span className="mt-0.5 flex-shrink-0">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </span>
                  {m}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Right deeds */}
        {entry.rightDeeds.length > 0 && (
          <div>
            <FieldLabel>What I Did Right</FieldLabel>
            <div className="flex flex-col gap-1.5">
              {entry.rightDeeds.map((r, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm text-green-400"
                >
                  <span className="mt-0.5 flex-shrink-0">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  {r}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feelings */}
        {entry.feelings.length > 0 && (
          <div>
            <FieldLabel>Feelings</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {entry.feelings.map((f) => (
                <span
                  key={f}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${
                    [
                      "Confident",
                      "Patient",
                      "Calm",
                      "Disciplined",
                      "Focused",
                    ].includes(f)
                      ? "bg-green-500/15 border-green-500/30 text-green-400"
                      : "bg-red-500/15 border-red-500/30 text-red-400"
                  }`}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Note */}
        {entry.note && (
          <div>
            <FieldLabel>Notes</FieldLabel>
            <div className="bg-[#0f1117] border border-[#1e2a3a] rounded-xl px-4 py-3">
              <p className="text-sm text-gray-300 leading-relaxed italic">
                &ldquo;{entry.note}&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
