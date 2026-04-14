"use client";

import { InstrumentPicker } from "@/components/ui/instruments/instrument-picker";
import useGetInstruments from "@/hooks/usegetInstruments";
import { useSinglePlan } from "@/hooks/usePlans";
import { toApiError } from "@/server/lib/api-error";
import {
  createTradingPlan,
  updateTradingPlan,
} from "@/server/lib/api/trades/plans/api";
import { TradingPlanType } from "@/types";
import { useRouter } from "next/navigation";
import { on } from "nodemailer/lib/xoauth2";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/* ── Constants (mirror your lib/constants) ── */
const TIMEFRAMES = [
  "1m",
  "5m",
  "15m",
  "30m",
  "1H",
  "4H",
  "1D",
  "1W",
  "1M",
] as const;
const TRADER_TYPES = [
  "scalper",
  "day trader",
  "swing trader",
  "position trader",
] as const;

type Timeframe = (typeof TIMEFRAMES)[number];
type TraderType = (typeof TRADER_TYPES)[number];

interface FormState {
  name: string;
  description: string;
  pairs: { value: string; id: string }[];
  pairIds: string[];
  timeframes: { htf: Timeframe[]; mtf: Timeframe[]; ltf: Timeframe[] };
  strategy: { name: string; description: string; indicators: string[] };
  tradingRules: string[];
  riskManagement: {
    riskPerTrade: number;
    minimumRiskReward: string;
    maxTradePerDay: string;
    maxDailyLoss: string;
  };
  tradeManagement: string[];
  traderType: TraderType;
}

const initial: FormState = {
  name: "",
  description: "",
  pairs: [],
  pairIds: [],
  timeframes: { htf: [], mtf: [], ltf: [] },
  strategy: { name: "", description: "", indicators: [] },
  tradingRules: [""],
  riskManagement: {
    riskPerTrade: 0,
    minimumRiskReward: "",
    maxTradePerDay: "",
    maxDailyLoss: "",
  },
  tradeManagement: [""],
  traderType: "day trader",
};

/* ── Shared primitives ── */
function Label({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-sm font-medium text-gray-300">{children}</label>
      {hint && <span className="text-xs text-gray-600">{hint}</span>}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  prefix,
  suffix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <div
        className={`flex items-center bg-[#0f1117] border rounded-lg h-10 px-3 gap-2 transition-colors ${error ? "border-red-500/60" : "border-[#1e2a3a] focus-within:border-blue-500/50"}`}
      >
        {prefix && (
          <span className="text-gray-600 text-sm flex-shrink-0">{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none"
        />
        {suffix && (
          <span className="text-gray-600 text-sm flex-shrink-0">{suffix}</span>
        )}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function Textarea({
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
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#0f1117] border border-[#1e2a3a] focus:border-blue-500/50 rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none resize-none transition-colors"
    />
  );
}

function Select<T extends string>({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full appearance-none bg-[#0f1117] border border-[#1e2a3a] focus:border-blue-500/50 rounded-lg h-10 px-3 pr-8 text-sm text-gray-200 outline-none transition-colors cursor-pointer"
      >
        {placeholder && (
          <option value="" disabled className="bg-[#131620]">
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#131620] capitalize">
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

/* ── Timeframe multi-toggle ── */
function TimeframeToggleGroup({
  label,
  selected,
  onChange,
}: {
  label: string;
  selected: Timeframe[];
  onChange: (v: Timeframe[]) => void;
}) {
  const toggle = (tf: Timeframe) =>
    onChange(
      selected.includes(tf)
        ? selected.filter((x) => x !== tf)
        : [...selected, tf],
    );

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {TIMEFRAMES.map((tf) => {
          const active = selected.includes(tf);
          return (
            <button
              key={tf}
              type="button"
              onClick={() => toggle(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                active
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-[#0f1117] border-[#1e2a3a] text-gray-500 hover:border-blue-500/40 hover:text-gray-300"
              }`}
            >
              {tf}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Dynamic list (trading rules / trade management) ── */
function DynamicList({
  items,
  onChange,
  placeholder,
  addLabel,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  addLabel: string;
}) {
  const update = (i: number, val: string) => {
    const next = [...items];
    next[i] = val;
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, ""]);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#1e2a3a] flex items-center justify-center text-[10px] text-gray-500 flex-shrink-0 font-semibold">
            {i + 1}
          </div>
          <div className="flex-1 flex items-center bg-[#0f1117] border border-[#1e2a3a] focus-within:border-blue-500/50 rounded-lg h-10 px-3 gap-2 transition-colors">
            <input
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none"
            />
          </div>
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#1e2a3a] text-gray-600 hover:text-red-400 hover:border-red-500/40 transition-colors flex-shrink-0"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors mt-1 w-fit"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        {addLabel}
      </button>
    </div>
  );
}

/* ── Tag input (indicators / pairs) ── */
function TagInput({
  tags,
  onChange,
  placeholder,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;

  placeholder: string;
  otherTags?: { id: string; value: string }[];
}) {
  const [input, setInput] = useState("");

  const {
    instruments,
    isLoadingInstrument,
    error: instrumentError,
    loadMore,
    hasMore,
    isFetchingNextPage,
  } = useGetInstruments();

  const add = () => {
    const val = input.trim().toUpperCase();
    if (val && !tags.includes(val)) onChange([...tags, val]);
    setInput("");
  };

  const remove = (tag: string) => onChange(tags.filter((t) => t !== tag));

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((tag, index) => (
          <span
            key={tag}
            className="flex items-center gap-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-lg"
          >
            {tag}
            <button
              type="button"
              onClick={() => {
                remove(tag);
              }}
              className="text-blue-400 hover:text-white transition-colors"
            >
              <svg
                width="10"
                height="10"
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
        <div className="flex-1 flex items-center bg-[#0f1117] border border-[#1e2a3a] focus-within:border-blue-500/50 rounded-lg h-10 px-3 transition-colors">
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
            className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none uppercase"
          />
        </div>

        <button
          type="button"
          onClick={add}
          className="px-4 h-10 bg-[#1e2a3a] hover:bg-[#2a3a50] border border-[#1e2a3a] rounded-lg text-sm text-gray-300 transition-colors flex-shrink-0"
        >
          Add
        </button>
      </div>
      <p className="text-xs text-gray-600 mt-1.5">Press Enter or click Add</p>
    </div>
  );
}

function TagInsInput({
  tags,
  onChange,
  placeholder,
}: {
  tags: { value: string; id: string }[];
  onChange: (tags: { value: string; id: string }[]) => void;
  placeholder: string;
  inst?: boolean;
}) {
  const {
    instruments,
    isLoadingInstrument,
    error: instrumentError,
    loadMore,
    hasMore,
    isFetchingNextPage,
  } = useGetInstruments();

  const remove = (tag: { value: string; id: string }) =>
    onChange(tags.filter((t) => t.id !== tag?.id));

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((tag, index) => (
          <span
            key={tag?.id}
            className="flex items-center gap-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-lg"
          >
            {tag?.value}

            <button
              type="button"
              onClick={() => {
                remove(tag);
              }}
              className="text-blue-400 hover:text-white transition-colors"
            >
              <svg
                width="10"
                height="10"
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
        <InstrumentPicker
          isLoading={isLoadingInstrument}
          instruments={instruments}
          loadMore={loadMore}
          hasMore={hasMore}
          isFetchingNextPage={isFetchingNextPage}
          onSelect={(instrument) => {
            onChange([
              ...tags,
              {
                value: instrument.pairName,
                id: instrument._id as string,
              },
            ]);
          }}
          showValue
        />
      </div>
      <p className="text-xs text-gray-600 mt-1.5">Press Enter or click Add</p>
    </div>
  );
}

/* ── Section card ── */
export function Section({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#131620] border border-[#1e2a3a] rounded-2xl overflow-hidden">
      <div className="flex items-start gap-3 px-5 py-4 border-b border-[#1e2a3a]">
        <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

/* ── Step indicator ── */
const STEPS = [
  "Basic Info",
  "Timeframes",
  "Strategy",
  "Risk",
  "Rules",
] as const;

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < current
                  ? "bg-green-500 text-white"
                  : i === current
                    ? "bg-blue-600 text-white ring-2 ring-blue-500/30"
                    : "bg-[#1e2a3a] text-gray-600"
              }`}
            >
              {i < current ? (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-[10px] font-medium whitespace-nowrap hidden sm:block ${i === current ? "text-blue-400" : i < current ? "text-green-400" : "text-gray-600"}`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-px mx-2 mb-3 sm:mb-4 transition-colors ${i < current ? "bg-green-500/40" : "bg-[#1e2a3a]"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Page ── */
export default function NewTradingPlanPage({ isEdit }: { isEdit: boolean }) {
  const [form, setForm] = useState<any>(initial);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { plan, planLoading } = useSinglePlan();

  const planData: TradingPlanType = plan?.data || plan;
  const router = useRouter();

  useEffect(() => {
    if (planData) {
      setForm((prev: FormState) => ({
        ...prev,
        name: planData.name,
        description: planData.description,
        timeframes: planData.timeframes,
        strategy: planData.strategy,
        tradingRules: planData.tradingRules,
        riskManagement: planData.riskManagement,
        tradeManagement: planData.tradeManagement,
        traderType: planData.traderType,
        pairs: (planData?.pairs as any)?.map((p: any) => ({
          value: p?.pairName,
          id: p,
        })),
      }));
    }
  }, [planData]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((p: any) => ({ ...p, [key]: value }));

  const setRisk = (key: keyof FormState["riskManagement"], value: string) =>
    setForm((p: any) => ({
      ...p,
      riskManagement: { ...p.riskManagement, [key]: value },
    }));

  const setStrategy = (
    key: keyof FormState["strategy"],
    value: string | string[],
  ) =>
    setForm((p: any) => ({ ...p, strategy: { ...p.strategy, [key]: value } }));

  const setTF = (tier: "htf" | "mtf" | "ltf", value: Timeframe[]) =>
    setForm((p: any) => ({
      ...p,
      timeframes: { ...p.timeframes, [tier]: value },
    }));

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = "Plan name is required.";
      if (!form.traderType) e.traderType = "Select a trader type.";
    }
    if (step === 1) {
      if (!form.timeframes.htf.length) e.htf = "Select at least one HTF.";
      if (!form.timeframes.ltf.length) e.ltf = "Select at least one LTF.";
    }
    if (step === 2) {
      if (!form.strategy.name.trim())
        e.strategyName = "Strategy name is required.";
    }
    if (step === 3) {
      const rp = parseFloat(String(form.riskManagement.riskPerTrade));
      if (isNaN(rp) || rp < 0.1 || rp > 10)
        e.riskPerTrade = "Must be between 0.1% and 10%.";
      if (!/^\d+:\d+$/.test(form.riskManagement.minimumRiskReward))
        e.minimumRiskReward = "Format: 1:2";
      if (!form.riskManagement.maxTradePerDay) e.maxTradePerDay = "Required.";
      if (!form.riskManagement.maxDailyLoss) e.maxDailyLoss = "Required.";
    }
    if (step === 4) {
      if (form.tradingRules.every((r: any) => !r.trim()))
        e.tradingRules = "Add at least one trading rule.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    try {
      const { riskPerTrade, minimumRiskReward, maxTradePerDay, maxDailyLoss } =
        form.riskManagement;

      const payload: TradingPlanType = {
        name: form.name,
        description: form.description,
        pairs: form.pairs?.map((pair: any) => pair.id),
        timeframes: form.timeframes,
        strategy: form.strategy,
        tradingRules: form.tradingRules,
        riskManagement: {
          riskPerTrade,
          minimumRiskReward,
          maxTradePerDay: Number(maxTradePerDay),
          maxDailyLoss: Number(maxDailyLoss),
        },
        tradeManagement: form.tradeManagement,
        traderType: form.traderType,
      };

      if (isEdit) {
        await updateTradingPlan((planData as any)?._id, payload);
      } else {
        await createTradingPlan(payload);
      }

      toast.success(
        isEdit
          ? "Trading plan updated successfully"
          : "Trading plan created successfully",
      );

      router.push("/trading-plan");
    } catch (error) {
      const { message } = toApiError(error);
      setErrors({ submit: message });
      toast.error(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (planLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" bg-[#0f1117] px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Trading Plan</h1>
          <p className="text-sm text-gray-500 mt-1">
            Define your strategy, rules, and risk parameters.
          </p>
        </div>

        {/* Step bar */}
        <StepBar current={step} />

        <div className="flex flex-col gap-5">
          {/* ── Step 0: Basic Info ── */}
          {step === 0 && (
            <Section
              title="Basic Information"
              description="Name your plan and choose your trading style."
              icon={
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              }
            >
              <div className="flex flex-col gap-4">
                <div>
                  <Label hint="max 100 chars">Plan name</Label>
                  <Input
                    value={form.name}
                    onChange={(v) => set("name", v)}
                    placeholder="e.g. London Session Breakout"
                    error={errors.name}
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(v) => set("description", v)}
                    placeholder="Brief overview of this trading plan…"
                  />
                </div>

                <div>
                  <Label>Trader type</Label>
                  <Select
                    value={form.traderType}
                    onChange={(v) => set("traderType", v)}
                    options={TRADER_TYPES}
                  />
                  {errors.traderType && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.traderType}
                    </p>
                  )}
                </div>

                <div>
                  <Label hint="Enter pair symbols">Trading pairs</Label>
                  <TagInsInput
                    tags={form.pairs}
                    onChange={(v) => set("pairs", v)}
                    placeholder="e.g. EURUSD, XAUUSD…"
                  />
                </div>
              </div>
            </Section>
          )}

          {/* ── Step 1: Timeframes ── */}
          {step === 1 && (
            <Section
              title="Timeframes"
              description="Select your higher, middle, and lower timeframes."
              icon={
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
            >
              <div className="flex flex-col gap-6">
                <div>
                  <TimeframeToggleGroup
                    label="HTF — Higher Timeframe"
                    selected={form.timeframes.htf}
                    onChange={(v) => setTF("htf", v)}
                  />
                  {errors.htf && (
                    <p className="text-xs text-red-400 mt-1.5">{errors.htf}</p>
                  )}
                </div>
                <div className="h-px bg-[#1e2a3a]" />
                <TimeframeToggleGroup
                  label="MTF — Middle Timeframe"
                  selected={form.timeframes.mtf}
                  onChange={(v) => setTF("mtf", v)}
                />
                <div className="h-px bg-[#1e2a3a]" />
                <div>
                  <TimeframeToggleGroup
                    label="LTF — Lower Timeframe"
                    selected={form.timeframes.ltf}
                    onChange={(v) => setTF("ltf", v)}
                  />
                  {errors.ltf && (
                    <p className="text-xs text-red-400 mt-1.5">{errors.ltf}</p>
                  )}
                </div>
              </div>
            </Section>
          )}

          {/* ── Step 2: Strategy ── */}
          {step === 2 && (
            <Section
              title="Strategy"
              description="Describe your edge and the indicators you rely on."
              icon={
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              }
            >
              <div className="flex flex-col gap-4">
                <div>
                  <Label>Strategy name</Label>
                  <Input
                    value={form.strategy.name}
                    onChange={(v) => setStrategy("name", v)}
                    placeholder="e.g. SMC Liquidity Sweep"
                    error={errors.strategyName}
                  />
                </div>
                <div>
                  <Label>Strategy description</Label>
                  <Textarea
                    value={form.strategy.description}
                    onChange={(v) => setStrategy("description", v)}
                    placeholder="Explain the logic behind your strategy, entry criteria, confluences…"
                    rows={4}
                  />
                </div>
                <div>
                  <Label hint="Indicators / tools">Indicators</Label>
                  <TagInput
                    tags={form.strategy.indicators}
                    onChange={(v) => setStrategy("indicators", v)}
                    placeholder="e.g. EMA, RSI, VWAP…"
                  />
                </div>
              </div>
            </Section>
          )}

          {/* ── Step 3: Risk Management ── */}
          {step === 3 && (
            <Section
              title="Risk Management"
              description="Set your hard limits to protect your capital."
              icon={
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label hint="0.1% – 10%">Risk per trade</Label>
                  <Input
                    value={String(form.riskManagement.riskPerTrade)}
                    onChange={(v) => setRisk("riskPerTrade", v)}
                    placeholder="1.0"
                    type="number"
                    suffix="%"
                    error={errors.riskPerTrade}
                  />
                </div>
                <div>
                  <Label hint="e.g. 1:2">Minimum risk : reward</Label>
                  <Input
                    value={form.riskManagement.minimumRiskReward}
                    onChange={(v) => setRisk("minimumRiskReward", v)}
                    placeholder="1:2"
                    error={errors.minimumRiskReward}
                  />
                </div>
                <div>
                  <Label>Max trades per day</Label>
                  <Input
                    value={form.riskManagement.maxTradePerDay}
                    onChange={(v) => setRisk("maxTradePerDay", v)}
                    placeholder="3"
                    type="number"
                    error={errors.maxTradePerDay}
                  />
                </div>
                <div>
                  <Label hint="in account %">Max daily loss</Label>
                  <Input
                    value={form.riskManagement.maxDailyLoss}
                    onChange={(v) => setRisk("maxDailyLoss", v)}
                    placeholder="3.0"
                    type="number"
                    suffix=""
                    error={errors.maxDailyLoss}
                  />
                </div>
              </div>

              {/* Risk summary preview */}
              {form.riskManagement.riskPerTrade &&
                form.riskManagement.minimumRiskReward && (
                  <div className="mt-4 bg-[#0f1117] border border-[#1e2a3a] rounded-xl p-4">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">
                      Risk summary
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        {
                          label: "Risk / trade",
                          value: `${form.riskManagement.riskPerTrade}%`,
                        },
                        {
                          label: "Min R:R",
                          value: form.riskManagement.minimumRiskReward,
                        },
                        {
                          label: "Max trades",
                          value: form.riskManagement.maxTradePerDay || "—",
                        },
                        {
                          label: "Max daily loss",
                          value: form.riskManagement.maxDailyLoss
                            ? `${form.riskManagement.maxDailyLoss}%`
                            : "—",
                        },
                      ].map((item) => (
                        <div key={item.label}>
                          <p className="text-[10px] text-gray-600 mb-0.5">
                            {item.label}
                          </p>
                          <p className="text-sm font-semibold text-blue-400">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </Section>
          )}

          {/* ── Step 4: Rules ── */}
          {step === 4 && (
            <div className="flex flex-col gap-5">
              <Section
                title="Trading Rules"
                description="The non-negotiable rules you must follow before entering a trade."
                icon={
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  >
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                }
              >
                {errors.tradingRules && (
                  <p className="text-xs text-red-400 mb-3">
                    {errors.tradingRules}
                  </p>
                )}
                <DynamicList
                  items={form.tradingRules}
                  onChange={(v) => set("tradingRules", v)}
                  placeholder="e.g. Only trade during London or NY session"
                  addLabel="Add rule"
                />
              </Section>

              <Section
                title="Trade Management"
                description="How you manage trades once they're open — optional but recommended."
                icon={
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  >
                    <path d="M18 20V10" />
                    <path d="M12 20V4" />
                    <path d="M6 20v-6" />
                  </svg>
                }
              >
                <DynamicList
                  items={form.tradeManagement}
                  onChange={(v) => set("tradeManagement", v)}
                  placeholder="e.g. Move SL to BE after 1R"
                  addLabel="Add management rule"
                />
              </Section>
            </div>
          )}

          <>
            {errors.submit && (
              <span className="text-red-500">{errors.submit}</span>
            )}
          </>
          {/* ── Navigation ── */}
          <div className="flex items-center justify-between pt-2 pb-6">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                className="flex items-center cursor-pointer gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
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
                type="submit"
                disabled={loading}
                className="flex items-center cursor-pointer gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
                onClick={handleSubmit}
              >
                {loading ? (
                  <>
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
                    Save Trading Plan
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
