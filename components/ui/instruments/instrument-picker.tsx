"use client";

import { useEffect, useState } from "react";
import { InstrumentSelector } from "./instruments";
import { Modal } from "../modal";
import { ScrollSentinel } from "../scroll-sentinel";
import { InstrumentType } from "@/types";

type Instrument = {
  category: string;
  pairName: string;
};

type Props = {
  instruments: InstrumentType[];
  onSelect: (instrument: InstrumentType) => void;
  isLoading: boolean;

  loadMore?: () => void;
  hasMore?: boolean;
  isFetchingNextPage?: boolean;

  showValue?: boolean;
  editValue?: InstrumentType;
};

export const InstrumentPicker = ({
  instruments,
  onSelect,
  isLoading,
  loadMore,
  hasMore,
  isFetchingNextPage,
  showValue,
  editValue,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<InstrumentType | null>(
    editValue ?? null,
  );

  const handleSelect = (instrument: InstrumentType) => {
    setSelected(instrument);
    onSelect(instrument);
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-center">
      {/* trigger */}
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "#0f1117",
          border: "1px solid #1e2a3a",
          borderRadius: 8,
          padding: "10px 12px",
          color: "#e2e8f0",
          fontSize: 13,
          width: "100%",
          outline: "none",
          boxSizing: "border-box",
          flex: 1,
        }}
        className="w-full min-w-70  flex-1 text-start"
      >
        {showValue
          ? "Select Instrument"
          : isLoading
            ? "Loading..."
            : selected
              ? selected.pairName
              : "Select Instrument"}
      </button>

      {/* modal */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Search Instruments"
      >
        <div className="max-h-[420px]  bg-[#0f1117]">
          <InstrumentSelector
            instruments={instruments}
            onSelect={handleSelect}
            isLoading={isLoading}
            showValue={showValue}
          />

          {/* ✅ SCROLL TRIGGER ADDED HERE */}
          <ScrollSentinel
            onLoadMore={() => loadMore?.()}
            loading={isFetchingNextPage}
            disabled={!hasMore}
          />
        </div>
      </Modal>
    </div>
  );
};
