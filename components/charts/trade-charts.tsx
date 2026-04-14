"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", pnl: 200 },
  { name: "Tue", pnl: 400 },
  { name: "Wed", pnl: -100 },
  { name: "Thu", pnl: 800 },
  { name: "Fri", pnl: 600 },
];

export default function TradeChart() {
  return (
    <div className="bg-[#121826] p-4 rounded-2xl h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="pnl"
            stroke="#3B82F6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
