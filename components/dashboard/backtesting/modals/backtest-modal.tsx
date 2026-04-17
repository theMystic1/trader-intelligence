"use client";

import { Modal } from "@/components/ui/modal";
import useGetInstruments from "@/hooks/usegetInstruments";
import { useState } from "react";
import { FieldLabel, InputField, SelectField } from "../../trades/others";
import { InstrumentPicker } from "@/components/ui/instruments/instrument-picker";
import { TIMEFRAMES } from "@/lib/constants";
import { usePlans } from "@/hooks/usePlans";
import { BacktestStatus, TradingPlanType } from "@/types";
import { toApiError } from "@/server/lib/api-error";
import toast from "react-hot-toast";
import { createBacktest } from "@/server/lib/api/backtest/api";
import { QueryObserverResult } from "@tanstack/react-query";

// tradingPlanId
// pair
// timeframe
// startDate
// endDate
// initialBalance
// riskPerTrade
// status

const BacktestModal = ({
  type = "new",
  onRefetch,
}: {
  type?: "new" | "edit";
  onRefetch?: () => Promise<void>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<
    string | undefined
  >(undefined);

  const [date, setDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [tradingPlanId, setTradingPlanId] = useState<{
    value: string;
    label: string;
  }>();
  const [initialBalance, setInitialBalance] = useState<number>(0);
  const [riskPerTrade, setRiskPerTrade] = useState<number>(0);
  const [status, setStatus] = useState<BacktestStatus>("running");
  const [timeframe, setTimeframe] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    instruments,
    isLoadingInstrument,
    error: instrumentError,
    loadMore,
    hasMore,
    isFetchingNextPage,
  } = useGetInstruments();

  const { plansLoading, plans } = usePlans();

  const planOptions = plans?.data?.map((plan: TradingPlanType) => ({
    value: plan._id,
    label: plan.name,
  }));

  console.log(tradingPlanId);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!selectedInstrument) {
      setIsLoading(false);
      return toast.error("Please select a trading pair");
    }
    try {
      await createBacktest({
        pair: selectedInstrument,
        startDate: date,
        endDate,
        tradingPlanId: tradingPlanId?.value! || plans?.data[0]._id,
        riskPerTrade: Number(riskPerTrade),
        status,
        timeframe,
        initialBalance: Number(initialBalance),
      });
      if (onRefetch) await onRefetch();
      setIsOpen(false);
      toast.success("Backtest created successfully");
    } catch (error) {
      const { message } = toApiError(error);
      toast.error(message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg"
      >
        + Add
      </button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={type === "new" ? "New Backtest Pair" : "Edit Backtest Pair"}
      >
        {plansLoading ? (
          <div>Please wait a moment...</div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            <div className="w-full grid md:grid-cols-2 gap-3">
              <div>
                <FieldLabel>Select Pair</FieldLabel>
                {/*
            <InputField placeholder="e.g. AAPL" />*/}
                <InstrumentPicker
                  isLoading={isLoadingInstrument}
                  instruments={instruments}
                  loadMore={loadMore}
                  hasMore={hasMore}
                  isFetchingNextPage={isFetchingNextPage}
                  onSelect={(instrument: any) =>
                    setSelectedInstrument(instrument?._id)
                  }
                />
              </div>
              <div>
                <FieldLabel>Trading Plan</FieldLabel>
                <SelectField
                  options={planOptions ?? []}
                  defaultValue=""
                  value={tradingPlanId?.value ?? ""}
                  onChange={(value: any) => setTradingPlanId(value)}
                />
              </div>
              <div>
                <FieldLabel>Time frame</FieldLabel>
                <SelectField
                  options={TIMEFRAMES}
                  defaultValue=""
                  value={timeframe ?? ""}
                  onChange={(value: any) => setTimeframe(value)}
                />
              </div>
              <div>
                <FieldLabel>Status</FieldLabel>
                <SelectField
                  options={["running", "completed"]}
                  defaultValue="running"
                  value={status ?? ""}
                  onChange={(value: any) => setStatus(value)}
                />
              </div>
              <div>
                <FieldLabel>Initial Balance</FieldLabel>
                <InputField
                  placeholder="e.g. 1000"
                  type="number"
                  value={String(initialBalance) ?? ""}
                  onChange={(e) => setInitialBalance(Number(e.target.value))}
                />
              </div>
              <div>
                <FieldLabel>Risk per trade</FieldLabel>
                <InputField
                  placeholder="e.g. 1000"
                  type="number"
                  value={String(riskPerTrade) ?? ""}
                  onChange={(e) => setRiskPerTrade(Number(e.target.value))}
                />
              </div>
              <div>
                <FieldLabel>Select startDate</FieldLabel>
                <InputField
                  placeholder="Start date"
                  type="date"
                  onChange={(e) => setDate(e.target.value)}
                  value={date}
                />
              </div>
              <div>
                <FieldLabel>Select endDate</FieldLabel>
                <InputField
                  placeholder="end date"
                  type="date"
                  onChange={(e) => setEndDate(e.target.value)}
                  value={endDate}
                />
              </div>
            </div>

            <button
              className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1"
              onClick={handleSubmit}
            >
              {isLoading ? (
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
                  <span> Saving...</span>
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BacktestModal;
