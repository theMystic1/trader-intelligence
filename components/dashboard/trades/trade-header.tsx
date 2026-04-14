import { Dispatch } from "react";
import { ChevronDown, InfoIcon, XIcon } from "./others";
import { BG_CARD, BORDER } from "./trades";

const TradeHeader = ({
  setNewTrade,
}: {
  setNewTrade: Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex items-start justify-between mb-3">
      <div>
        <h1 className="text-2xl font-bold text-white m-0">New Trade</h1>
        <div className="flex items-center gap-1.5 text-[#6b7280] text-xs mt-1.5 cursor-pointer">
          <InfoIcon /> Show Info <ChevronDown />
        </div>
      </div>
      <button
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          border: `1px solid ${BORDER}`,
          background: BG_CARD,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6b7280",
          cursor: "pointer",
        }}
        onClick={() => setNewTrade((op) => !op)}
      >
        <XIcon />
      </button>
    </div>
  );
};

export default TradeHeader;
