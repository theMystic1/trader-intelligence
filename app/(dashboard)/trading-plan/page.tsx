import StrategiesPage from "@/components/dashboard/plans/plans";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trading Plan",
  description:
    "Define your trading rules, risk management strategy, and execution checklist.",
  keywords: [
    "trading plan",
    "risk management",
    "trading strategy",
    "trade rules",
  ],
  openGraph: {
    title: "Trading Plan",
    description:
      "Build discipline with structured trading rules and execution frameworks.",
  },
};
const TradingPlan = () => {
  return <StrategiesPage />;
};
export default TradingPlan;
