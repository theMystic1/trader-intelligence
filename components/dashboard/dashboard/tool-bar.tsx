"use client";

import { toApiError } from "@/server/lib/api-error";
import { Icon } from "./Dashboard";
import toast from "react-hot-toast";
import { seedInstruments } from "@/server/lib/api/trades/api";

const ToolBar = () => {
  const handleSeedInstruments = async () => {
    try {
      toast.loading("..seeding instruments.. .. .. ");

      await seedInstruments();
      toast.remove();
    } catch (error) {
      const { message } = toApiError(error);
      toast.remove();
      toast.error(message);
      console.error(error);
    }
  };
  return (
    <div className="flex items-center gap-2 pt-3 px-6 py-4 justify-end">
      <div className="w-8.5 h-8.5 border border-[#2a3040] rounded-lg bg-[#1e2330] flex items-center justify-center cursor-pointer">
        <Icon name="bell" size={15} color="#9ca3af" />
      </div>
      {["All Accounts", "All time"].map((label) => (
        <div
          key={label}
          className="bg-[#1e2330] text-[#e2e8f0] text-xs rounded-lg border border-[#2a3040] py-1.5 px-3 cursor-pointer flex items-center gap-1.5"
        >
          <span>{label}</span>{" "}
          <Icon name="chevronDown" size={12} color="#6b7280" />
        </div>
      ))}
      <button
        className="bg-[#3b82f6] border-none rounded-lg text-white text-xs font-semibold px-4 py-1.5 cursor-pointer flex items-center gap-1.5"
        onClick={handleSeedInstruments}
      >
        <Icon name="plus" size={14} color="white" /> <span>New Trade</span>
      </button>
    </div>
  );
};

export default ToolBar;
