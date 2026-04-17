import TradingJournalPage from "@/components/dashboard/tradeJournal/journal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trading Journal",
  description:
    "Log trades, review outcomes, and build discipline with a structured trading journal.",
  openGraph: {
    title: "Trading Journal",
    description:
      "Track every trade, learn from mistakes, and improve consistency.",
  },
};
const Journal = () => <TradingJournalPage />;

export default TradingJournalPage;
