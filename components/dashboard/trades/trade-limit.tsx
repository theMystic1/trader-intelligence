import { RefreshIcon } from "./others";
import { BG_CARD, BG_PAGE, BORDER } from "./trades";

const TradeLimit = () => {
  return (
    <div
      style={{
        background: BG_CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            J
          </div>
          <span style={{ fontSize: 13, fontWeight: 500 }}>
            Monthly Trade Limit
          </span>
        </div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "#3b82f6",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <RefreshIcon /> Refresh
        </button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          marginBottom: 8,
        }}
      >
        <span style={{ color: "#6b7280" }}>0/20 trades used</span>
        <span style={{ color: "#3b82f6", fontWeight: 500 }}>20 remaining</span>
      </div>
      <div style={{ height: 6, borderRadius: 4, background: BG_PAGE }}>
        <div
          style={{
            height: 6,
            borderRadius: 4,
            width: "0%",
            background: "#3b82f6",
          }}
        />
      </div>
    </div>
  );
};

export default TradeLimit;
