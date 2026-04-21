"use client";

import { TradingPlanType } from "@/types";
import { useState } from "react";
import { Section } from "./new-plan";
import { usePlans } from "@/hooks/usePlans";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { toApiError } from "@/server/lib/api-error";
import toast from "react-hot-toast";
import { deleteTradingPlan } from "@/server/lib/api/trades/plans/api";
import { GiCreditsCurrency } from "react-icons/gi";
import { BiDollarCircle } from "react-icons/bi";

/* ───────────────────────────────
   CARD (UNCHANGED, CLEANED SLIGHTLY)
─────────────────────────────── */
function StrategyCard({
  plan,
  onView,
}: {
  plan: TradingPlanType;
  onView: () => void;
}) {
  return (
    <div className="bg-[#131620] border border-[#1e2a3a] rounded-2xl p-4 hover:border-blue-500/40 transition-all group cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{plan.name}</h3>
          <p className="text-xs text-gray-500 capitalize">{plan.traderType}</p>
        </div>

        <button
          onClick={onView}
          className=" transition text-xs text-blue-400 cursor-pointer"
        >
          Open
        </button>
      </div>

      <p className="text-xs text-gray-400 line-clamp-2 mb-3">
        {plan.description || "No description provided"}
      </p>

      <div className="flex flex-wrap gap-1 mb-3">
        {[...plan.timeframes.htf, ...plan.timeframes.ltf]
          .slice(0, 4)
          .map((tf) => (
            <span
              key={tf}
              className="text-[10px] px-2 py-1 rounded-md bg-[#0f1117] border border-[#1e2a3a] text-gray-400"
            >
              {tf}
            </span>
          ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <p className="text-[10px] text-gray-600">Risk</p>
          <p className="text-xs text-blue-400 font-semibold">
            {plan.riskManagement.riskPerTrade}%
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-600">R:R</p>
          <p className="text-xs text-blue-400 font-semibold">
            {plan.riskManagement.minimumRiskReward}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-600">Trades</p>
          <p className="text-xs text-blue-400 font-semibold">
            {plan.riskManagement.maxTradePerDay}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────
   FULL SCREEN DETAIL VIEW (NEW UX)
─────────────────────────────── */
export function StrategyDetailView({
  plan,
  onBack,
}: {
  plan: TradingPlanType;
  onBack: () => void;
}) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  console.log(plan);

  const handleDelete = async () => {
    setDeleting(true);
    toast.loading("Deleting plan....");
    try {
      await deleteTradingPlan((plan as any)._id);

      setOpenDeleteModal(false);
      toast.remove();
      toast.success("Plan deleted successfully");
      router.push("/trading-plan");
    } catch (error) {
      const { message } = toApiError(error);
      toast.remove();
      toast.error(message);
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-[#0f1117] min-h-screen px-2 md:px-6 py-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {/* sticky header */}
        <div className="sticky top-0 bg-[#0f1117]/80 backdrop-blur flex items-center justify-between py-3 border-b border-[#1e2a3a]">
          <button
            onClick={onBack}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Back to strategies
          </button>

          <div className="flex gap-2">
            <Link
              href={`/trading-plan/new/${plan._id}`}
              className="text-xs px-3 py-1 rounded-lg bg-[#1e2a3a] text-gray-300"
            >
              Edit
            </Link>
            <button
              className="text-xs px-3 py-1 rounded-lg bg-red-600 text-white cursor-pointer"
              onClick={() => setOpenDeleteModal(true)}
            >
              Delete
            </button>
          </div>
        </div>

        {/* header */}
        <div>
          <h1 className="text-2xl font-bold text-white">{plan.name}</h1>
          <p className="text-sm text-gray-500 capitalize">{plan.traderType}</p>
        </div>

        {plan.description && (
          <p className="text-sm text-gray-400">{plan.description}</p>
        )}

        {/* FULL SECTION REUSE (IMPORTANT) */}
        <Section
          title="Timeframes"
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
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col items-center">
              <p className="text-blue-400 font-bold">HTF</p>
              <div className="flex items-center gap-1">
                {plan.timeframes.htf.map((tf) => (
                  <span key={tf} className="tag">
                    {tf}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-blue-400 font-bold">MTF</p>
              <div className="flex items-center gap-1">
                {plan.timeframes.mtf.map((tf, i) => (
                  <span key={tf} className="tag">
                    {tf}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-blue-400 font-bold">LTF</p>
              <div className="flex items-center gap-1">
                {plan.timeframes.ltf.map((tf) => (
                  <span key={tf} className="tag">
                    {tf}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Section>
        <Section title="Pairs" icon={<BiDollarCircle />}>
          <div className="flex flex-wrap gap-6">
            {plan?.pairs.map((pair) => (
              <div key={pair?._id} className={`flex flex-col items-center`}>
                <p className="text-blue-400 text-xs font-bold">
                  {pair?.pairName}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Strategy"
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
          <p className="text-sm text-gray-300 mb-3">
            {plan.strategy.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {plan.strategy.indicators.map((i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-md bg-blue-600/10 border border-blue-500/20 text-blue-300"
              >
                {i}
              </span>
            ))}
          </div>
        </Section>

        <Section
          title="Risk Management"
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600">Risk</p>
              <p className="text-sm text-blue-400 font-semibold">
                {plan.riskManagement.riskPerTrade}%
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600">R:R</p>
              <p className="text-sm text-blue-400 font-semibold">
                {plan.riskManagement.minimumRiskReward}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600">Trades</p>
              <p className="text-sm text-blue-400 font-semibold">
                {plan.riskManagement.maxTradePerDay}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600">Max Loss</p>
              <p className="text-sm text-blue-400 font-semibold">
                {plan.riskManagement.maxDailyLoss}%
              </p>
            </div>
          </div>
        </Section>

        <Section
          title="Trading Rules"
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
          <ul className="space-y-2">
            {plan.tradingRules.map((r, i) => (
              <li key={i} className="text-sm text-gray-300">
                <span className="text-blue-400 mr-2">{i + 1}.</span>
                {r}
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="Trade Management"
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
          <ul className="space-y-2">
            {plan.tradeManagement.map((r, i) => (
              <li key={i} className="text-sm text-gray-300">
                <span className="text-green-400 mr-2">{i + 1}.</span>
                {r}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Modal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title="Delete Plan?"
        size="sm"
      >
        <div className="p-3">
          {/*<h3 className="text-lg font-medium mb-4">Delete Plan</h3>*/}
          <p className="text-sm text-gray-300 mb-4">
            Are you sure you want to delete this plan? This action cannot be
            undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setOpenDeleteModal(false)}
              className="flex-1 px-4 py-2 text-sm border border-gray-400 hover:border-gray-200 cursor-pointer rounded-lg "
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 text-sm bg-red-600 hover:bg-red-500 rounded-lg cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ───────────────────────────────
   MAIN PAGE (RECONCILED STATE MACHINE)
─────────────────────────────── */
export default function StrategiesPage() {
  const { plansLoading, plans } = usePlans();
  // const [selected, setSelected] = useState<TradingPlanType | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  if (plansLoading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  const filtered =
    plans?.data?.filter((p: TradingPlanType) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  /* FULLSCREEN DETAIL MODE */

  /* LIST MODE */
  return (
    <div className="bg-[#0f1117] px-2  md:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Trading Plans</h1>
            <p className=" text-gray-500 text-xs md:text-sm">
              Explore and manage your trading plans.
            </p>
          </div>
          <Link
            href="/trading-plan/new"
            className="group-hover:opacity-100 transition text-xs bg-blue-400 text-white px-3 py-2 rounded-lg cursor-pointer"
          >
            + Add Plan
          </Link>
        </div>

        {/* search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search strategies..."
          className="w-full mb-6 bg-[#131620] border border-[#1e2a3a] rounded-lg px-4 h-10 text-sm text-gray-200 outline-none"
        />

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((plan: TradingPlanType) => (
            <StrategyCard
              key={plan._id || plan.name}
              plan={plan}
              onView={() => router.push(`${pathname}/${plan._id}`)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            No strategies found.
          </div>
        )}
      </div>
    </div>
  );
}
