import BacktestsPage from "@/components/dashboard/backtesting/overvew";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backtesting",
  description:
    "Analyze trading strategies with equity curves, win rates, profit factor, and risk metrics.",
  openGraph: {
    title: "Strategy Backtesting",
    description:
      "Validate trading strategies with performance-driven backtesting tools.",
  },
};
const BacktestOverview = () => {
  return <BacktestsPage />;
};

export default BacktestOverview;
