"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeadWithRow,
  TableRow,
  TableWrapper,
  Th,
} from "@/components/dashboard/dashboard/table";

const TradesTable = ({ type }: { type: "all" | "recent" }) => {
  return (
    <section className=" gap-4 flex flex-col  bg-[#1a1f2e] border border-[#2a3040] rounded-lg">
      <div style={{ padding: "16px 20px 0" }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#3b82f6",
            marginBottom: 14,
          }}
        >
          {type === "all" ? "All Trades" : "Recent Trades"}
        </div>
      </div>

      <TableWrapper className="">
        <Table>
          <TableHeadWithRow>
            <>
              <Th className="">DATE</Th>
              <Th>ASSET</Th>
              <Th className="">TYPE</Th>
              <Th>ENTRY</Th>
              <Th className="">EXIT</Th>
              <Th className="">SIZE</Th>
              <Th>P&L</Th>
              <Th>ACTIONS</Th>
            </>
          </TableHeadWithRow>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8}>No trades found</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableWrapper>
      <div
        style={{
          padding: "12px 20px",
          fontSize: 12,
          color: "#6b7280",
          borderTop: "1px solid #2a3040",
        }}
      >
        Showing 0 to 0 of 0 results
      </div>
    </section>
  );
};

export default TradesTable;
