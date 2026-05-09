import { FieldLabel, OutcomeBadge, TypeBadge } from "../tradeJournal/others";

export function EntryDetail({
  entry,
  onClose,
  pair,
}: {
  entry: any;
  onClose: () => void;
  pair?: string;
}) {
  const pnlColor =
    entry.profitLoss > 0
      ? "text-green-400"
      : entry.profitLoss < 0
        ? "text-red-400"
        : "text-gray-400";

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2a3a]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base font-bold text-white">{entry.pair}</span>
          <TypeBadge type={entry.direction} />
          <OutcomeBadge
            outcome={
              entry.outcome === "win"
                ? "TP"
                : entry.outcome === "loss"
                  ? "SL"
                  : "BE"
            }
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1 px-5 py-5 flex flex-col gap-5">
        {/* Meta row — Date, Session */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Date",
              value: new Date(entry.entryTime).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
            },
            { label: "Session", value: entry.session || "London" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-[#0f1117] border border-[#1e2a3a] rounded-xl px-3 py-2.5"
            >
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">
                {item.label}
              </p>
              <p className="text-sm font-semibold text-gray-200">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Price levels */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Entry", value: entry.entryPrice },
            { label: "Stop Loss", value: entry.stopLoss },
            { label: "Take Profit", value: entry.takeProfit },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-[#0f1117] border border-[#1e2a3a] rounded-xl px-3 py-2.5"
            >
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">
                {item.label}
              </p>
              <p className="text-sm font-semibold text-gray-200">
                {item.value ?? "—"}
              </p>
            </div>
          ))}
        </div>

        {/* Exit price + exit time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0f1117] border border-[#1e2a3a] rounded-xl px-3 py-2.5">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">
              Exit Price
            </p>
            <p className="text-sm font-semibold text-gray-200">
              {entry.exitPrice ?? "—"}
            </p>
          </div>
          <div className="bg-[#0f1117] border border-[#1e2a3a] rounded-xl px-3 py-2.5">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">
              Exit Time
            </p>
            <p className="text-sm font-semibold text-gray-200">
              {entry.exitTime
                ? new Date(entry.exitTime).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>

        {/* RR + P&L */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl px-4 py-3 flex flex-col gap-0.5">
            <span className="text-xs text-gray-400">Risk : Reward</span>
            <span className="text-lg font-bold text-blue-400">
              1:
              {entry.riskReward?.toFixed(2) ??
                entry.rrNumeric?.toFixed(2) ??
                "—"}
            </span>
          </div>
          <div className="bg-[#0f1117] border border-[#1e2a3a] rounded-xl px-4 py-3 flex flex-col gap-0.5">
            <span className="text-xs text-gray-400">P &amp; L</span>
            <span className={`text-lg font-bold ${pnlColor}`}>
              {entry.profitLoss != null
                ? `${entry.profitLoss > 0 ? "+" : ""}$${Number(entry.profitLoss).toFixed(2)}`
                : "—"}
            </span>
          </div>
        </div>

        {/* P&L % */}
        {entry.profitLossPercent != null && (
          <div className="bg-[#0f1117] border border-[#1e2a3a] rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-gray-400">P&amp;L %</span>
            <span className={`text-sm font-semibold ${pnlColor}`}>
              {entry.profitLoss > 0 ? "+" : ""}
              {Number(entry.profitLossPercent).toFixed(2)}%
            </span>
          </div>
        )}

        {/* Setup type */}
        {entry.setupType && (
          <div>
            <FieldLabel>Setup Type</FieldLabel>
            <p className="text-sm text-gray-300 leading-relaxed">
              {entry.setupType}
            </p>
          </div>
        )}

        {/* Entry criteria */}
        {entry.entryCriteria && (
          <div>
            <FieldLabel>Entry Setup</FieldLabel>
            <p className="text-sm text-gray-300 leading-relaxed">
              {entry.entryCriteria}
            </p>
          </div>
        )}

        {/* Entry confirmation */}
        {entry.entryConfirmation && (
          <div>
            <FieldLabel>Entry Confirmation</FieldLabel>
            <p className="text-sm text-gray-300 leading-relaxed">
              {entry.entryConfirmation}
            </p>
          </div>
        )}

        {/* Trade management */}
        {entry.tradeManagement && (
          <div>
            <FieldLabel>Trade Management</FieldLabel>
            <p className="text-sm text-gray-300 leading-relaxed">
              {entry.tradeManagement}
            </p>
          </div>
        )}

        {/* Feelings */}
        {entry.feelings && entry.feelings.length > 0 && (
          <div>
            <FieldLabel>Feelings</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {entry.feelings.map((f: string) => (
                <span
                  key={f}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${
                    [
                      "Confident",
                      "Patient",
                      "Calm",
                      "Disciplined",
                      "Focused",
                    ].includes(f)
                      ? "bg-green-500/15 border-green-500/30 text-green-400"
                      : "bg-red-500/15 border-red-500/30 text-red-400"
                  }`}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes — now using entry.notes */}
        {entry.notes && (
          <div>
            <FieldLabel>Notes</FieldLabel>
            <div className="bg-[#0f1117] border border-[#1e2a3a] rounded-xl px-4 py-3">
              <p className="text-sm text-gray-300 leading-relaxed italic">
                &ldquo;{entry.notes}&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
