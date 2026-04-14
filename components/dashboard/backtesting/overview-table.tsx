"use client";

import { MOCK_BACKTESTS } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHeadWithRow,
  TableRow,
  TableWrapper,
  Th,
} from "../dashboard/table";
import { BacktestType } from "@/types";
import { formatDate } from "@/lib/helpers";
import Link from "next/link";

export default function BacktestOverviewTable({
  backtestData,
}: {
  backtestData: BacktestType[];
}) {
  console.log(backtestData);
  return (
    <TableWrapper>
      <Table>
        <TableHeadWithRow>
          <Th>Backtest Pair</Th>
          <Th>Strategy</Th>
          {/*<Th>Pair</Th>*/}
          <Th>Timeframe</Th>
          <Th>Period</Th>
          <Th>Status</Th>
          <Th>Action</Th>
        </TableHeadWithRow>

        <TableBody>
          {backtestData?.map((bt) => (
            <TableRow key={bt._id}>
              <TableCell className="font-semibold text-white">
                {bt.pair?.pairName}
              </TableCell>

              <TableCell className="text-gray-400 text-xs!">
                {bt.tradingPlanId?.name}
              </TableCell>

              <TableCell className="text-gray-400">{bt.timeframe}</TableCell>

              <TableCell className="text-gray-500 text-xs">
                {formatDate(new Date(bt.startDate!))} →{" "}
                {formatDate(new Date(bt.endDate!))}
              </TableCell>

              <TableCell>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    bt.status === "completed"
                      ? "bg-green-500/15 text-green-400"
                      : "bg-yellow-500/15 text-yellow-400"
                  }`}
                >
                  {bt.status}
                </span>
              </TableCell>

              <TableCell className="text-gray-500 text-xs">
                <Link
                  className="text-blue-400 hover:text-blue-300"
                  href={`/backtesting/${bt._id}`}
                >
                  View logs
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  );
}
