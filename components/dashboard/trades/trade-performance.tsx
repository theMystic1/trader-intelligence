import { useState } from "react";
import { ConsistencyChart, InfoIcon, ProgressTab, SkillsChart } from "./others";
import { BG_CARD, BORDER, Tab, TABS } from "./trades";

const TradePerformance = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Consistency");
  return (
    <div
      style={{
        background: BG_CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 16px 12px",
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#3b82f6" }}>
            Trading Performance
          </div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
            Performance Level:{" "}
            <span style={{ color: "#f97316" }}>Developing</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 16,
          }}
        >
          <span style={{ color: "#22c55e" }}>✅</span>
          <InfoIcon color="#3b82f6" />
          <span style={{ color: "#f97316" }}>🔥</span>
          <span style={{ color: "#a855f7" }}>⚡</span>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 0",
              fontSize: 13,
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              background:
                activeTab === tab
                  ? "linear-gradient(90deg,#1d4ed8,#3b82f6)"
                  : "transparent",
              color: activeTab === tab ? "#ffffff" : "#6b7280",
              transition: "all 0.15s",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ paddingTop: 16 }}>
        {activeTab === "Consistency" && <ConsistencyChart />}
        {activeTab === "Skills" && <SkillsChart />}
        {activeTab === "Progress" && <ProgressTab />}
      </div>
    </div>
  );
};

export default TradePerformance;
