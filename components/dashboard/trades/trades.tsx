"use client";

import { useState } from "react";
import TradeForm from "./trade-form";
import TradeHeader from "./trade-header";
import TradeLimit from "./trade-limit";
import TradePerformance from "./trade-performance";
import TradesTable from "./trades-table";
import { Icon } from "../dashboard/Dashboard";

export const TABS = ["Consistency", "Skills", "Progress"] as const;
export type Tab = (typeof TABS)[number];

/* ── Shared form primitives ── */

export const BG_PAGE = "#0f1117"; // outermost page background
export const BG_CARD = "#131620"; // card / panel background
export const BORDER = "#1e2a3a"; // card border

/* ── Page ── */
const NewTradePage = () => {
  const [newTrade, setNewTrade] = useState(true);
  // const [activeTab, setActiveTab] = useState<Tab>("Consistency");
  // const [tradeSide, setTradeSide] = useState<"Long" | "Short">("Long");

  return (
    <div className="bg-[#0f1117] text-[#e2e8f0] p-2 md:p-6">
      {/* ── Header ── */}
      <TradeHeader setNewTrade={setNewTrade} />
      {newTrade ? (
        <div style={{ maxWidth: 780 }}>
          {/* ── Monthly Trade Limit ── */}
          <TradeLimit />
          {/* ── Trading Performance ── */}

          <TradePerformance />
          {/* ── Trade Form ── */}

          <TradeForm />
        </div>
      ) : (
        <div>
          <div className="flex justify-end mb-4">
            <button className="bg-[#3b82f6] border-none rounded-lg text-white text-xs font-semibold px-4 py-1.5 cursor-pointer flex items-center gap-1.5">
              <Icon name="plus" size={14} color="white" />{" "}
              <span>New Trade</span>
            </button>
          </div>
          <TradesTable type="all" />
        </div>
      )}
    </div>
  );
};

export default NewTradePage;
