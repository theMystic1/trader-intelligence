import { Trade } from "@/types";

export const tradeFeatures = [
  {
    title: "Trading Plan Builder",
    description: "Build and manage your trading plans with ease.",
  },
  {
    title: "Automated Journal",
    description:
      "Keep track of your trades and emotions with an automated journal.",
  },
  {
    title: "Backtesting Engine",
    description:
      "Test your strategies against historical data to see how they would have performed.",
  },
  {
    title: "AI Insights",
    description:
      "Get AI-powered insights to help you make better trading decisions.",
  },
  {
    title: "Discipline Tracking",
    description:
      "Track your discipline and avoid emotional mistakes with our built-in tools.",
  },
  {
    title: "Advanced Analytics",
    description:
      "Analyze your trading performance with advanced analytics tools.",
  },
];

export const navItems = [
  { icon: "grid", label: "Dashboard", active: true },
  { icon: "plus", label: "New Trade" },
  { icon: "list", label: "Trades" },
  { icon: "search", label: "Search" },
];

export const premiumItems = [
  { emoji: "📊", label: "Reports" },
  { emoji: "📅", label: "Calendar" },
  { emoji: "📓", label: "Notebook" },
  { emoji: "📖", label: "Journal" },
  { emoji: "🧠", label: "Psychology" },
  { emoji: "🔢", label: "Risk Calculator" },
  { emoji: "🤖", label: "AI Coach Insights" },
  { emoji: "💬", label: "AI Analyst Chat" },
  { emoji: "📥", label: "File Import" },
  { emoji: "🎯", label: "Performance Goals" },
  { emoji: "📏", label: "Trading Rules" },
];

export const gettingStartedItems = [
  {
    title: "Log your first trade",
    desc: "Record a recent trade with entry, exit, and notes",
    icon: "chart",
  },
  {
    title: "Try the AI Coach",
    desc: "Ask for feedback on your trading or plan a session",
    icon: "chat",
  },
  {
    title: "Connect a broker",
    desc: "Import trades from MT4/MT5, Bybit, Binance, or KuCoin",
    icon: "link",
  },
  {
    title: "Set a performance goal",
    desc: "Track a target like win rate or monthly P&L",
    icon: "target",
  },
];

export const actionCards = [
  {
    title: "Log Your First Trade",
    desc: "Enter a recent trade with your setup, entry, exit, and notes. Takes about 2 minutes.",
    color: "blue",
    icon: "chart",
  },
  {
    title: "Connect Your Broker",
    desc: "Link MT4/MT5, Bybit, Binance, or KuCoin to import trades automatically.",
    color: "green",
    icon: "link",
  },
  {
    title: "Ask the AI Coach",
    desc: "Get personalized trading advice, analyze recent losses, or plan your next session.",
    color: "purple",
    icon: "chat",
  },
  {
    title: "Set a Goal",
    desc: "Define a trading goal — like win rate or monthly P&L — and track your progress.",
    color: "amber",
    icon: "target",
  },
];

export const cardIconColors: Record<string, { bg: string; stroke: string }> = {
  blue: { bg: "#1d3a6e", stroke: "#60a5fa" },
  green: { bg: "#14432a", stroke: "#34d399" },
  purple: { bg: "#2d1b5e", stroke: "#a78bfa" },
  amber: { bg: "#4a2e0a", stroke: "#fbbf24" },
};

export const links = [
  { icon: "grid", title: "Dashboard", href: "/dashboard" },
  {
    icon: "plus",
    title: "Trades",
    href: "/trades",
  },
  {
    icon: "link",
    title: "Trading Plan",
    href: "/trading-plan",
  },
  {
    icon: "chart",
    title: "Backtesting",
    href: "/backtesting",
  },
  { icon: "chat", title: "Journal", href: "/journal" },
  // {
  //   title: "Analytics",
  //   href: "/analytics",
  // },
];

export const tradeFeelings = [
  "Confident",
  "Patient",
  "Relaxed",
  "Inspired",
  "Focused",
  "Distracted",
  "Calm",
  "Anxious",
  "Disciplined",
  "Greed",
  "Fear",
  "Hope",
];

export const publicRoutes = [
  "/",
  "signup",
  "/login",
  "/forgotPassword",
  "/verifyOtp",
  "/resetPassword",
];

export const protectedRoutes = [
  "/charts",
  "/dashboard",
  "/trades",
  "/trading-plan",
  "/backtesting",
  "/journal",
  "/changePassword",
];

export const TIMEFRAMES = [
  "1m",
  "3m",
  "5m",
  "15m",
  "30m",
  "1H",
  "4H",
  "1D",
  "1W",
  "1M",
];

export type Timeframe = (typeof TIMEFRAMES)[number];

export const TRADER_TYPES = [
  "scalper",
  "day trader",
  "swing trader",
  "position trader",
] as const;

export type TraderType = (typeof TRADER_TYPES)[number];

export const InstrumentCats = [
  "Commodities",
  "Forex",
  "Stocks",
  "Crypto",
  "Indices",
  "Futures",
];

export const MOCK_STATS = {
  totalTrades: 48,
  wins: 27,
  losses: 16,
  breakevens: 5,
  winRate: 56.25,
  lossRate: 33.33,
  avgRR: 2.4,
  totalProfit: 3820,
  expectancy: 1.14,
  hasEdge: true,
  netProfit: 3820,
  grossProfit: 5640,
  grossLoss: -1820,
  profitFactor: 3.09,
  maxDrawdown: 6.2,
  finalBalance: 13820,
  initialBalance: 10000,
  edgeScore: 74,
};

export const MOCK_TRADES: Trade[] = [
  {
    id: 1,
    entryTime: "2024-01-08 09:15",
    exitTime: "2024-01-08 11:42",
    direction: "buy",
    entryPrice: 1.2654,
    exitPrice: 1.2748,
    stopLoss: 1.261,
    takeProfit: 1.276,
    riskReward: 2.1,
    profitLoss: 940,
    profitLossPercent: 9.4,
    outcome: "win",
    setupType: "BOS Retest",
    session: "London",
    notes: "Clean BOS with strong momentum",
  },
  {
    id: 2,
    entryTime: "2024-01-09 14:30",
    exitTime: "2024-01-09 16:00",
    direction: "sell",
    entryPrice: 1.278,
    exitPrice: 1.271,
    stopLoss: 1.282,
    takeProfit: 1.266,
    riskReward: 3.0,
    profitLoss: 700,
    profitLossPercent: 7.0,
    outcome: "win",
    setupType: "FVG Fill",
    session: "NY",
    notes: "Textbook FVG entry",
  },
  {
    id: 3,
    entryTime: "2024-01-10 08:00",
    exitTime: "2024-01-10 09:30",
    direction: "buy",
    entryPrice: 1.269,
    exitPrice: 1.2645,
    stopLoss: 1.2655,
    takeProfit: 1.276,
    riskReward: 2.0,
    profitLoss: -450,
    profitLossPercent: -4.5,
    outcome: "loss",
    setupType: "Liquidity Sweep",
    session: "London",
    notes: "Stopped out — false sweep",
  },
  {
    id: 4,
    entryTime: "2024-01-11 10:00",
    exitTime: "2024-01-11 13:15",
    direction: "sell",
    entryPrice: 1.272,
    exitPrice: 1.272,
    stopLoss: 1.276,
    takeProfit: 1.264,
    riskReward: 0,
    profitLoss: 0,
    profitLossPercent: 0,
    outcome: "breakeven",
    setupType: "OB Entry",
    session: "London",
    notes: "Moved SL to BE, reversed",
  },
  {
    id: 5,
    entryTime: "2024-01-12 15:00",
    exitTime: "2024-01-12 17:30",
    direction: "buy",
    entryPrice: 1.2598,
    exitPrice: 1.271,
    stopLoss: 1.2555,
    takeProfit: 1.273,
    riskReward: 2.6,
    profitLoss: 1120,
    profitLossPercent: 11.2,
    outcome: "win",
    setupType: "MSS + OB",
    session: "NY",
    notes: "Perfect MSS confirmation",
  },
  {
    id: 6,
    entryTime: "2024-01-15 09:00",
    exitTime: "2024-01-15 10:15",
    direction: "sell",
    entryPrice: 1.2745,
    exitPrice: 1.2698,
    stopLoss: 1.278,
    takeProfit: 1.2675,
    riskReward: 2.0,
    profitLoss: -350,
    profitLossPercent: -3.5,
    outcome: "loss",
    setupType: "BOS Retest",
    session: "London",
    notes: "News spike invalidated setup",
  },
  {
    id: 7,
    entryTime: "2024-01-16 14:00",
    exitTime: "2024-01-16 17:45",
    direction: "buy",
    entryPrice: 1.2612,
    exitPrice: 1.2748,
    stopLoss: 1.257,
    takeProfit: 1.278,
    riskReward: 3.2,
    profitLoss: 1360,
    profitLossPercent: 13.6,
    outcome: "win",
    setupType: "FVG Fill",
    session: "NY",
    notes: "Strong NY momentum trade",
  },
  {
    id: 8,
    entryTime: "2024-01-17 08:30",
    exitTime: "2024-01-17 11:00",
    direction: "sell",
    entryPrice: 1.279,
    exitPrice: 1.273,
    stopLoss: 1.2825,
    takeProfit: 1.2685,
    riskReward: 3.0,
    profitLoss: 600,
    profitLossPercent: 6.0,
    outcome: "win",
    setupType: "Liquidity Sweep",
    session: "London",
    notes: "Clean sweep above highs",
  },
];

export const MOCK_BACKTESTS = [
  {
    id: "bt_1",
    name: "London Breakout Test",
    tradingPlanName: "ICT Momentum Model",
    pair: "EURUSD",
    timeframe: "1H",
    startDate: "2024-01-01",
    endDate: "2024-02-01",
    status: "completed",
    createdAt: "2024-02-02",
  },
  {
    id: "bt_2",
    name: "Asia Range Fade",
    tradingPlanName: "Liquidity Sweep Model",
    pair: "GBPUSD",
    timeframe: "15m",
    startDate: "2024-03-01",
    endDate: "2024-03-20",
    status: "completed",
    createdAt: "2024-03-21",
  },
];
