"use client";

import { useState } from "react";
import {
  FieldLabel,
  inputBase,
  InputField,
  ReadonlyField,
  SelectField,
} from "./others";
import { BG_CARD, BG_PAGE, BORDER } from "./trades";
import { InstrumentCats, tradeFeelings } from "@/lib/constants";
import { InstrumentPicker } from "@/components/ui/instruments/instrument-picker";
import useGetInstruments from "@/hooks/usegetInstruments";

const TradeForm = () => {
  const [tradeSide, setTradeSide] = useState<"Long" | "Short">("Long");
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(
    null,
  );
  const [feelings, setFeelings] = useState<string[]>([]);

  const {
    instruments,
    isLoadingInstrument,
    error: instrumentError,
    loadMore,
    hasMore,
    isFetchingNextPage,
  } = useGetInstruments();

  // if (isLoadingInstrument) {
  //   return <div>Loading...</div>;
  // }

  // console.log(instruments);

  return (
    <div
      style={{
        background: BG_CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Instrument + Symbol */}
      <div
        // style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}

        className="grid md:grid-cols-2 gap-4 mb-4 "
      >
        <div>
          <FieldLabel>Instrument type</FieldLabel>
          <SelectField
            options={InstrumentCats}
            defaultValue="Forex"
            instrument
          />
        </div>
        <div>
          <FieldLabel>Symbol</FieldLabel>
          {/*
          <InputField placeholder="e.g. AAPL" />*/}
          <InstrumentPicker
            isLoading={isLoadingInstrument}
            instruments={instruments}
            loadMore={loadMore}
            hasMore={hasMore}
            isFetchingNextPage={isFetchingNextPage}
            onSelect={(instrument) =>
              setSelectedInstrument(instrument?.pairName)
            }
          />
        </div>
      </div>

      {/* Date/time + Trade side */}
      <div>
        <div>
          <FieldLabel>Date and time</FieldLabel>
          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                ...inputBase,
                display: "flex",
                alignItems: "center",
                gap: 8,
                flex: 1,
                padding: "0 12px",
              }}
            >
              <input
                defaultValue="11/04/2026"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#e2e8f0",
                  fontSize: 13,
                  flex: 1,
                  height: 40,
                }}
              />
              <span style={{ fontSize: 13, color: "#4b5563" }}>📅</span>
            </div>
            <div
              style={{
                ...inputBase,
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: 100,
                padding: "0 12px",
              }}
            >
              <input
                defaultValue="17:28"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#e2e8f0",
                  fontSize: 13,
                  width: "100%",
                  height: 40,
                }}
              />
              <span style={{ fontSize: 13, color: "#4b5563" }}>🕐</span>
            </div>
          </div>
        </div>
        <div className="mt-4 ">
          <FieldLabel>Trade side</FieldLabel>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              borderRadius: 8,
              overflow: "hidden",
              border: `1px solid ${BORDER}`,
            }}
          >
            {(["Long", "Short"] as const).map((side) => (
              <button
                key={side}
                onClick={() => setTradeSide(side)}
                style={{
                  padding: "10px 0",
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  background:
                    tradeSide === side
                      ? side === "Long"
                        ? "#16a34a"
                        : "#dc2626"
                      : BG_PAGE,
                  color: tradeSide === side ? "#fff" : "#6b7280",
                  transition: "all 0.15s",
                }}
              >
                {side}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Entry + Exit */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <FieldLabel>Entry price</FieldLabel>
          <InputField placeholder="0.00" prefix="$" />
        </div>
        <div>
          <FieldLabel>Exit price</FieldLabel>
          <InputField placeholder="0.00" prefix="$" />
        </div>
      </div>

      {/* Lot size + Fees */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <FieldLabel>Lot size/Quantity/Shares</FieldLabel>
          <InputField placeholder="0.005" />
        </div>
        <div>
          <FieldLabel>Fees and commissions</FieldLabel>
          <InputField placeholder="0" prefix="$" />
        </div>
      </div>

      {/* Gross + Net profit */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <FieldLabel>Gross profit</FieldLabel>
          <ReadonlyField value="$0.00" />
        </div>
        <div>
          <FieldLabel>Net profit (after fees)</FieldLabel>
          <ReadonlyField value="$0.00" />
        </div>
      </div>

      {/* Trading Account */}
      <div>
        <FieldLabel>Trading Account (Optional)</FieldLabel>
        <SelectField options={["No accounts available"]} />
        <div style={{ fontSize: 12, color: "#4b5563", marginTop: 6 }}>
          No trading accounts available. You can add trades without an account.
        </div>
      </div>

      {/* Timeframe */}
      <div>
        <FieldLabel>Timeframe</FieldLabel>
        <SelectField
          options={[
            "Daily",
            "1m",
            "5m",
            "15m",
            "1h",
            "4h",
            "Weekly",
            "Monthly",
          ]}
          defaultValue="Daily"
        />
      </div>

      {/* Setup Strategy */}
      <div>
        <FieldLabel>Setup Strategy</FieldLabel>
        <SelectField
          options={[
            "Select setup or strategy",
            "Breakout",
            "Pullback",
            "Reversal",
            "Momentum",
          ]}
          defaultValue="Select setup or strategy"
        />
      </div>

      {/* Trade Plan */}
      <div>
        <FieldLabel>Trade Plan</FieldLabel>
        <textarea
          rows={3}
          placeholder="Describe your trade plan..."
          style={{ ...inputBase, resize: "none", fontFamily: "inherit" }}
        />
      </div>
      <div>
        <FieldLabel> Notes</FieldLabel>
        <textarea
          rows={3}
          placeholder="What do you think about this trade? What were you feeling? What went Wrong? What went well? Try to be as specific as possible with your notes."
          style={{ ...inputBase, resize: "none", fontFamily: "inherit" }}
        />
      </div>
      <div>
        <FieldLabel> How did you feel during this trade?</FieldLabel>

        <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2">
          {tradeFeelings?.map((feel) => (
            <button
              key={feel}
              className={`text-xs   border-blue-600 rounded-sm py-1 px-4 hover:border-none hover:bg-cyan-600 transition-all duration-300 cursor-pointer ${feelings?.includes(feel) ? " bg-cyan-600" : "border"}`}
              onClick={() => {
                setFeelings((prev) =>
                  prev.includes(feel)
                    ? prev.filter((f) => f !== feel)
                    : [...prev, feel],
                );
              }}
            >
              {feel}
            </button>
          ))}
        </div>
      </div>

      <div
        className="min-h-40 rounded-lg m-0 p-0"
        style={{
          background: BG_CARD,
          border: `1px solid ${BORDER}`,
        }}
      >
        <div
          className="h-10 w-full rounded-t-lg flex items-center p-3"
          style={{
            background: BORDER,
          }}
        >
          <h1 className="font-bold text-sm">Pre-Trade checklist</h1>
        </div>

        <div className="p-4 flex items-center justify-center">
          <p>No trading rule defined yet</p>
        </div>
      </div>

      <button
        style={{
          width: "100%",
          background: "#2563eb",
          border: "none",
          borderRadius: 8,
          color: "#fff",
          fontSize: 14,
          fontWeight: 600,
          padding: "12px 0",
          cursor: "pointer",
        }}
      >
        Log Trade
      </button>
    </div>
  );
};

export default TradeForm;
