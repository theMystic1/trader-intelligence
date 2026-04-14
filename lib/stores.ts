import { create } from "zustand";

export const useStore = create(() => ({
  trades: [
    { id: 1, pair: "EURUSD", result: "WIN", pnl: 120 },
    { id: 2, pair: "BTCUSDT", result: "LOSS", pnl: -80 },
  ],
}));
