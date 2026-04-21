"use client";

import { Modal } from "@/components/ui/modal";
import useGetInstruments from "@/hooks/usegetInstruments";
import { useEffect, useState } from "react";
import { FieldLabel, InputField, SelectField } from "../../trades/others";
import { InstrumentPicker } from "@/components/ui/instruments/instrument-picker";
import { TIMEFRAMES } from "@/lib/constants";
import { usePlans } from "@/hooks/usePlans";
import { BacktestStatus, TradingPlanType } from "@/types";
import { toApiError } from "@/server/lib/api-error";
import toast from "react-hot-toast";
import { createBacktest, updateBacktest } from "@/server/lib/api/backtest/api";
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
  openEdit,
  editData,
  onClose,
}: {
  type?: "new" | "edit";
  onRefetch?: () => Promise<void>;
  openEdit?: boolean;
  editData?: any;
  onClose?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(Boolean(openEdit));
  const [selectedInstrument, setSelectedInstrument] = useState<
    string | undefined
  >(editData?._id);

  const [date, setDate] = useState<string>(editData?.startDate);
  const [endDate, setEndDate] = useState<string>(editData?.endDate);
  const [tradingPlanId, setTradingPlanId] = useState<{
    value: string;
    label: string;
  }>({
    value: editData?.tradingPlanId?._id ?? "",
    label: editData?.tradingPlanId?.name ?? "",
  });
  const [initialBalance, setInitialBalance] = useState<number>(
    editData?.initialBalance,
  );
  const [riskPerTrade, setRiskPerTrade] = useState<number>(
    editData?.riskPerTrade,
  );
  const [status, setStatus] = useState<BacktestStatus>(
    editData?.status ?? "running",
  );
  const [timeframe, setTimeframe] = useState<string>(editData?.timeframe ?? "");
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

  useEffect(() => {
    if (editData) {
      setTradingPlanId({
        value: editData.tradingPlanId._id,
        label: editData.tradingPlanId.name,
      });
      setDate(editData.startDate?.split("T")[0]);
      setEndDate(editData.endDate?.split("T")[0]);
      setRiskPerTrade(editData.riskPerTrade);
      setStatus(editData.status);
      setTimeframe(editData.timeframe);
      setInitialBalance(editData.initialBalance);
      setSelectedInstrument(editData.pair?._id);
    }
  }, [editData]);

  // console.log(tradingPlanId);

  console.log(editData?.startDate);
  const handleSubmit = async () => {
    setIsLoading(true);
    if (!selectedInstrument) {
      setIsLoading(false);
      return toast.error("Please select a trading pair");
    }

    try {
      const body = {
        pair: selectedInstrument,
        startDate: date,
        endDate,
        tradingPlanId: tradingPlanId?.value! || plans?.data[0]._id,
        riskPerTrade: Number(riskPerTrade),
        status,
        timeframe,
        initialBalance: Number(initialBalance),
      };
      if (type === "edit") {
        await updateBacktest(editData?._id!, body);
      } else {
        await createBacktest(body);
      }
      if (onRefetch) await onRefetch();
      setIsOpen(false);
      onClose?.();
      toast.success(
        type === "edit"
          ? "Backtest updated successfully"
          : "Backtest created successfully",
      );
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
      {type === "new" && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg"
        >
          + Add
        </button>
      )}
      <Modal
        isOpen={isOpen || Boolean(openEdit)}
        onClose={() => {
          setIsOpen(false);
          onClose?.();
        }}
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
                  // showValue={type === "edit"}
                  editValue={editData?.pair}
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
                  // defaultValue={editData?.startDate}
                />
              </div>
              <div>
                <FieldLabel>Select endDate</FieldLabel>
                <InputField
                  placeholder="end date"
                  type="date"
                  onChange={(e) => setEndDate(e.target.value)}
                  value={endDate}
                  // defaultValue={editData?.endDate}
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
