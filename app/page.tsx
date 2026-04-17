// app/page.tsx

import LandingsPage from "@/components/landing/landing-2";
import Landing from "@/components/landing/landing-page";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smarter Trading Starts Here",
  description:
    "Journal trades, backtest strategies, and improve performance with data-driven trading intelligence tools.",
  openGraph: {
    title: "Trading Intelligence",
    description:
      "The modern platform for traders to journal, analyze, and improve performance.",
  },
};
const LandingPage = () => {
  return <LandingsPage />;
};

export default LandingPage;
