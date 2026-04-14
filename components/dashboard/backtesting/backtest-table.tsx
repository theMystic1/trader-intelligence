"use client";

import { SortKey, Trade } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHeadWithRow,
  TableRow,
  TableWrapper,
  Th,
} from "../dashboard/table";
import { ReactNode } from "react";
import { Badge, DirectionBadge } from "./backtest";

const BacktestTable = ({
  sortKey,
  sortDir,
  handleSort,
  filtered,
}: {
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  handleSort: (col: SortKey) => void;
  filtered: Trade[];
}) => {
  const SortIcon = ({ col }: { col: SortKey }) => (
    <span
      className={`ml-1 ${sortKey === col ? "text-blue-400" : "text-gray-700"}`}
    >
      {sortKey === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  const ThSort = ({ col, children }: { col: SortKey; children: ReactNode }) => (
    <Th>
      <button
        onClick={() => handleSort(col)}
        className="flex items-center gap-0.5 hover:text-gray-300 transition-colors"
      >
        {children}
        <SortIcon col={col} />
      </button>
    </Th>
  );

  return (
    <TableWrapper>
      <Table>
        <TableHeadWithRow>
          <ThSort col="entryTime">#</ThSort>
          <ThSort col="direction">Direction</ThSort>
          <ThSort col="entryPrice">Entry</ThSort>
          <ThSort col="exitPrice">Exit</ThSort>
          <ThSort col="stopLoss">SL</ThSort>
          <ThSort col="takeProfit">TP</ThSort>
          <ThSort col="riskReward">R:R</ThSort>
          <ThSort col="profitLoss">P&L</ThSort>
          <ThSort col="profitLossPercent">%</ThSort>
          <ThSort col="outcome">Outcome</ThSort>
          <Th>Setup</Th>
          <Th>Session</Th>
          <Th>Notes</Th>
        </TableHeadWithRow>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={13}>
                <div className="text-center py-8 text-gray-600 text-sm">
                  No trades match the current filter.
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((t, i) => (
              <TableRow
                key={t.id}
                className={`border-b border-[#1a2030] hover:bg-[#0f1621] transition-colors ${i % 2 === 0 ? "" : "bg-[#0f1117]/40"}`}
              >
                <TableCell>
                  <span className="text-xs font-semibold text-gray-400">
                    {i + 1}
                  </span>
                </TableCell>
                <TableCell>
                  <DirectionBadge dir={t.direction} />
                </TableCell>
                <TableCell className="text-gray-300 font-mono text-xs">
                  {t.entryPrice.toFixed(4)}
                </TableCell>
                <TableCell className="text-gray-300 font-mono text-xs">
                  {t.exitPrice.toFixed(4)}
                </TableCell>
                <TableCell className="text-red-400/70 font-mono text-xs">
                  {t.stopLoss.toFixed(4)}
                </TableCell>
                <TableCell className="text-green-400/70 font-mono text-xs">
                  {t.takeProfit.toFixed(4)}
                </TableCell>
                <TableCell>
                  <span className="text-xs font-semibold text-blue-400">
                    {t.riskReward > 0 ? `${t.riskReward}R` : "—"}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-sm font-bold ${t.profitLoss > 0 ? "text-green-400" : t.profitLoss < 0 ? "text-red-400" : "text-yellow-400"}`}
                  >
                    {t.profitLoss > 0 ? "+" : ""}
                    {t.profitLoss === 0
                      ? "—"
                      : `$${t.profitLoss.toLocaleString()}`}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-semibold ${t.profitLossPercent > 0 ? "text-green-400" : t.profitLossPercent < 0 ? "text-red-400" : "text-yellow-400"}`}
                  >
                    {t.profitLossPercent > 0 ? "+" : ""}
                    {t.profitLossPercent === 0
                      ? "—"
                      : `${t.profitLossPercent}%`}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge outcome={t.outcome} />
                </TableCell>
                <TableCell>
                  <span className="text-xs text-gray-400 bg-[#1e2a3a] px-2 py-0.5 rounded">
                    {t.setupType}
                  </span>
                </TableCell>
                <TableCell className="text-xs">{t.session}</TableCell>
                <TableCell>
                  <span
                    className="text-xs text-gray-500 max-w-[160px] block truncate"
                    title={t.notes}
                  >
                    {t.notes}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableWrapper>
  );
};

export default BacktestTable;
