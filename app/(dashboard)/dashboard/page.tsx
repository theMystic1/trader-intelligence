// import Dashboard from "@/components/dashboard/dashboard/Dashboard";
import Dashboard from "@/components/dashboard/dashboard/dasboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "View your trading performance, equity curves, win rate, and key analytics in one dashboard.",
  openGraph: {
    title: "Trading Dashboard",
    description:
      "Monitor your trading stats and performance insights in real time.",
  },
};
const MainDashboard = () => {
  return <Dashboard />;
};

export default MainDashboard;
