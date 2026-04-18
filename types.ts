import mongoose from "mongoose";

export type UserType = {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  emailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  token?: string;
  signinTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
};

export type UserMethods = {
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  generateOTP: (forgotPass?: boolean) => string;
  verifyOTP: (otp: string, forgotPass?: boolean) => Promise<boolean>;
};

export type TradingPlanType = {
  _id?: string;
  userId?: string;
  name: string;
  description?: string;
  pairs:
    | string[]
    | {
        value: string;
        id: string;
      }[];
  timeframes: {
    htf: string[];
    mtf: string[];
    ltf: string[];
  };
  strategy: {
    name: string;
    description?: string;
    indicators: string[];
  };
  tradingRules: string[];
  riskManagement: {
    riskPerTrade: number;
    minimumRiskReward: string;
    maxTradePerDay: number;
    maxDailyLoss: number;
  };
  tradeManagement: string[];
  traderType: string;
};

export type InstrumentCategory =
  | "forex"
  | "crypto"
  | "stocks"
  | "indices"
  | "commodities"
  | "bonds"
  | "etfs";

export type InstrumentType = {
  _id?: string;
  category: InstrumentCategory;
  pairName: string;
  base?: string;
  quote?: string;
  description?: string;
};

export type SortKey = keyof Trade;
export type SortDir = "asc" | "desc";
export type Outcome = "win" | "loss" | "breakeven";
export type Direction = "buy" | "sell";

export interface Trade {
  id: number;
  entryTime: string;
  exitTime: string;
  direction: Direction;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  profitLoss: number;
  profitLossPercent: number;
  outcome: Outcome;
  setupType: string;
  session: string;
  notes: string;
}

export type IBacktestDocument = {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  initialBalance: number;
  tradingPlanId: mongoose.Types.ObjectId;
  name: string;
  pair: mongoose.Types.ObjectId;
  timeframe: string;
  startDate: Date;
  endDate: Date;
  totalTrades: number;
  wins: number;
  losses: number;
  breakeven: number;
  winRate: number;
  netProfit: number;
  grossProfit: number;
  grossLoss: number;
  profitFactor: number;
  expectancy: number;
  maxDrawdown: number;
  averageRR: number;
  finalBalance: number;
  hasEdge: boolean;
  edgeScore: number;
  status: "draft" | "running" | "completed" | "archived";
  riskPerTrade: number;
};

export type BacktestStatus = "running" | "completed";

export type BacktestType = {
  _id?: string;

  userId?: any; // or User if populated
  tradingPlanId: any; // or TradingPlan if populated
  pair: any; // or Instrument if populated

  timeframe: string; // "5m", "15m", "1H", etc.

  startDate?: string;
  endDate?: string;

  initialBalance: number;
  riskPerTrade: number;

  status: BacktestStatus;

  createdAt?: string;
  updatedAt?: string;
};

export type TradingJournalype = {
  _id?: string;
  date: Date;
  pair: string;
  type: "LONG" | "SHORT";
  entryCriteria: string;
  entryConfirmation: string;
  exitTime: string;
  session: "NY" | "London" | "Asian";
  riskReward: string;
  tradeOutcome: "TP" | "SL" | "BE";
  tradeManagement: string;
  mistakes: string[];
  rightDeeds: string[];
  feelings?: string[];
  note?: string;
  userId?: string;
};

export interface FormState {
  date: string;
  pair: string;
  type: TradeType;
  session: Session;
  exitTime: string;
  tradeOutcome: TradeOutcome;
  riskReward: string;
  entryCriteria: string;
  entryConfirmation: string;
  tradeManagement: string;
  mistakes: string[];
  rightDeeds: string[];
  feelings: string[];
  note: string;
  userId?: string;
}

export type TradeType = "LONG" | "SHORT";
export type Session = "NY" | "London" | "Asian";
export type TradeOutcome = "TP" | "SL" | "BE";
export type Filter = "all" | TradeOutcome | TradeType;

export interface JournalEntry {
  _id?: string;
  date: string;
  pair: string;
  type: TradeType;
  entryCriteria: string;
  entryConfirmation: string;
  session: Session;
  exitTime: string;
  tradeOutcome: TradeOutcome;
  tradeManagement: string;
  riskReward: string;
  mistakes: string[];
  rightDeeds: string[];
  feelings: string[];
  note: string;
  createdAt?: string;
}

export interface DashboardData {
  overview: OverviewStats;
  journalCurve: JournalCurvePoint[];
  outcomeBreakdown: OutcomeBreakdown;
  sessionPerformance: SessionPerf[];
  pairLeaderboard: PairStat[];
  recentJournals: RecentJournal[];
  backtestSummary: BacktestSummary;
  streaks: StreakData;
  planCount: number;
}

export interface OverviewStats {
  totalJournals: number;
  winRate: number;
  totalTP: number;
  totalSL: number;
  totalBE: number;
  avgRR: number;
  bestPair: string;
  activeBacktests: number;
  completedBacktests: number;
  totalBacktestTrades: number;
}

export interface JournalCurvePoint {
  date: string;
  cumulative: number; // running win count
  tp: number;
  sl: number;
  be: number;
}

export interface OutcomeBreakdown {
  tp: number;
  sl: number;
  be: number;
  total: number;
  winRate: number;
}

export interface SessionPerf {
  session: string;
  tp: number;
  sl: number;
  be: number;
  total: number;
  winRate: number;
}

export interface PairStat {
  pair: string;
  total: number;
  tp: number;
  sl: number;
  winRate: number;
  avgRR: string;
}

export interface RecentJournal {
  _id: string;
  date: string;
  pair: string;
  type: string;
  tradeOutcome: string;
  session: string;
  riskReward: string;
  feelings: string[];
}

export interface BacktestSummary {
  total: number;
  running: number;
  completed: number;
  avgWinRate: number;
  totalTrades: number;
}

export interface StreakData {
  currentWinStreak: number;
  bestWinStreak: number;
  currentLossStreak: number;
}
