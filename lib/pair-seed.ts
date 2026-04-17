import { InstrumentType } from "@/types";

export const COMMODITIES = [
  // ENERGY
  {
    category: "commodities",
    pairName: "USOIL",
    base: "WTI Crude Oil",
    quote: "USD",
  },
  {
    category: "commodities",
    pairName: "UKOIL",
    base: "Brent Crude Oil",
    quote: "USD",
  },
  {
    category: "commodities",
    pairName: "NATGAS",
    base: "Natural Gas",
    quote: "USD",
  },

  // METALS
  { category: "commodities", pairName: "GOLD", base: "XAU", quote: "USD" },
  { category: "commodities", pairName: "SILVER", base: "XAG", quote: "USD" },
  { category: "commodities", pairName: "PLATINUM", base: "XPT", quote: "USD" },
  { category: "commodities", pairName: "PALLADIUM", base: "XPD", quote: "USD" },

  // AGRICULTURE (major liquid futures CFDs)
  { category: "commodities", pairName: "WHEAT" },
  { category: "commodities", pairName: "CORN" },
  { category: "commodities", pairName: "SOYBEAN" },
  { category: "commodities", pairName: "SUGAR" },
  { category: "commodities", pairName: "COFFEE" },
  { category: "commodities", pairName: "COTTON" },
];

export const BONDS = [
  {
    category: "bonds",
    pairName: "US10Y",
    description: "US 10-Year Treasury Yield",
  },
  {
    category: "bonds",
    pairName: "US30Y",
    description: "US 30-Year Treasury Yield",
  },
  {
    category: "bonds",
    pairName: "US02Y",
    description: "US 2-Year Treasury Yield",
  },
  { category: "bonds", pairName: "GER10Y", description: "German 10Y Bund" },
  { category: "bonds", pairName: "UK10Y", description: "UK 10Y Gilt" },
];

export const ETFS = [
  { category: "etfs", pairName: "SPY", description: "S&P 500 ETF" },
  { category: "etfs", pairName: "QQQ", description: "Nasdaq 100 ETF" },
  { category: "etfs", pairName: "DIA", description: "Dow Jones ETF" },
  { category: "etfs", pairName: "IWM", description: "Russell 2000 ETF" },

  { category: "etfs", pairName: "GLD", description: "Gold ETF" },
  { category: "etfs", pairName: "SLV", description: "Silver ETF" },

  { category: "etfs", pairName: "VTI", description: "Total US Market ETF" },
  { category: "etfs", pairName: "VXUS", description: "International ETF" },
];

export const FOREX = [
  // ===== MAJORS =====
  { category: "forex", pairName: "EUR/USD", base: "EUR", quote: "USD" },
  { category: "forex", pairName: "GBP/USD", base: "GBP", quote: "USD" },
  { category: "forex", pairName: "USD/JPY", base: "USD", quote: "JPY" },
  { category: "forex", pairName: "USD/CHF", base: "USD", quote: "CHF" },
  { category: "forex", pairName: "AUD/USD", base: "AUD", quote: "USD" },
  { category: "forex", pairName: "USD/CAD", base: "USD", quote: "CAD" },
  { category: "forex", pairName: "NZD/USD", base: "NZD", quote: "USD" },

  // ===== MINOR CROSSES =====
  { category: "forex", pairName: "EUR/GBP" },
  { category: "forex", pairName: "EUR/JPY" },
  { category: "forex", pairName: "EUR/AUD" },
  { category: "forex", pairName: "EUR/CAD" },
  { category: "forex", pairName: "EUR/CHF" },
  { category: "forex", pairName: "EUR/NZD" },

  { category: "forex", pairName: "GBP/JPY" },
  { category: "forex", pairName: "GBP/AUD" },
  { category: "forex", pairName: "GBP/CAD" },
  { category: "forex", pairName: "GBP/CHF" },
  { category: "forex", pairName: "GBP/NZD" },

  { category: "forex", pairName: "AUD/JPY" },
  { category: "forex", pairName: "AUD/CAD" },
  { category: "forex", pairName: "AUD/CHF" },
  { category: "forex", pairName: "AUD/NZD" },

  { category: "forex", pairName: "CAD/JPY" },
  { category: "forex", pairName: "CAD/CHF" },
  { category: "forex", pairName: "CHF/JPY" },

  // ===== EURO EXOTICS =====
  { category: "forex", pairName: "EUR/SEK" },
  { category: "forex", pairName: "EUR/NOK" },
  { category: "forex", pairName: "EUR/DKK" },
  { category: "forex", pairName: "EUR/PLN" },
  { category: "forex", pairName: "EUR/CZK" },
  { category: "forex", pairName: "EUR/HUF" },
  { category: "forex", pairName: "EUR/TRY" },
  { category: "forex", pairName: "EUR/ZAR" },
  { category: "forex", pairName: "EUR/SGD" },
  { category: "forex", pairName: "EUR/HKD" },
  { category: "forex", pairName: "EUR/MXN" },
  { category: "forex", pairName: "EUR/BRL" },

  // ===== USD EXOTICS =====
  { category: "forex", pairName: "USD/SEK" },
  { category: "forex", pairName: "USD/NOK" },
  { category: "forex", pairName: "USD/DKK" },
  { category: "forex", pairName: "USD/PLN" },
  { category: "forex", pairName: "USD/CZK" },
  { category: "forex", pairName: "USD/HUF" },
  { category: "forex", pairName: "USD/TRY" },
  { category: "forex", pairName: "USD/ZAR" },
  { category: "forex", pairName: "USD/SGD" },
  { category: "forex", pairName: "USD/HKD" },
  { category: "forex", pairName: "USD/MXN" },
  { category: "forex", pairName: "USD/BRL" },
  { category: "forex", pairName: "USD/INR" },
  { category: "forex", pairName: "USD/CNH" },
  { category: "forex", pairName: "USD/KRW" },
  { category: "forex", pairName: "USD/THB" },
  { category: "forex", pairName: "USD/IDR" },
  { category: "forex", pairName: "USD/NGN" },
  { category: "forex", pairName: "USD/KES" },
];

export const CRYPTO = [
  // BTC & ETH CORE
  { category: "crypto", pairName: "BTC/USDT", base: "BTC", quote: "USDT" },
  { category: "crypto", pairName: "BTC/USDC" },
  { category: "crypto", pairName: "BTC/USD" },
  { category: "crypto", pairName: "ETH/USDT", base: "ETH", quote: "USDT" },
  { category: "crypto", pairName: "ETH/USDC" },
  { category: "crypto", pairName: "ETH/BTC" },

  // L1 MAJORS
  { category: "crypto", pairName: "BNB/USDT" },
  { category: "crypto", pairName: "SOL/USDT" },
  { category: "crypto", pairName: "XRP/USDT" },
  { category: "crypto", pairName: "ADA/USDT" },
  { category: "crypto", pairName: "DOGE/USDT" },
  { category: "crypto", pairName: "AVAX/USDT" },
  { category: "crypto", pairName: "DOT/USDT" },
  { category: "crypto", pairName: "MATIC/USDT" },
  { category: "crypto", pairName: "LINK/USDT" },
  { category: "crypto", pairName: "LTC/USDT" },

  // MID CAP LIQUID
  { category: "crypto", pairName: "ATOM/USDT" },
  { category: "crypto", pairName: "UNI/USDT" },
  { category: "crypto", pairName: "NEAR/USDT" },
  { category: "crypto", pairName: "APT/USDT" },
  { category: "crypto", pairName: "ARB/USDT" },
  { category: "crypto", pairName: "OP/USDT" },
  { category: "crypto", pairName: "SUI/USDT" },
  { category: "crypto", pairName: "SEI/USDT" },
  { category: "crypto", pairName: "INJ/USDT" },
  { category: "crypto", pairName: "TIA/USDT" },

  // MEME LIQUID
  { category: "crypto", pairName: "SHIB/USDT" },
  { category: "crypto", pairName: "PEPE/USDT" },
  { category: "crypto", pairName: "FLOKI/USDT" },
  { category: "crypto", pairName: "BONK/USDT" },
];

export const STOCKS = [
  // MEGA CAP
  { category: "stocks", pairName: "AAPL" },
  { category: "stocks", pairName: "MSFT" },
  { category: "stocks", pairName: "GOOGL" },
  { category: "stocks", pairName: "AMZN" },
  { category: "stocks", pairName: "META" },
  { category: "stocks", pairName: "NVDA" },
  { category: "stocks", pairName: "TSLA" },

  // FINANCE
  { category: "stocks", pairName: "JPM" },
  { category: "stocks", pairName: "BAC" },
  { category: "stocks", pairName: "GS" },
  { category: "stocks", pairName: "MS" },
  { category: "stocks", pairName: "WFC" },

  // HEALTH
  { category: "stocks", pairName: "UNH" },
  { category: "stocks", pairName: "JNJ" },
  { category: "stocks", pairName: "PFE" },
  { category: "stocks", pairName: "MRK" },

  // CONSUMER
  { category: "stocks", pairName: "KO" },
  { category: "stocks", pairName: "PEP" },
  { category: "stocks", pairName: "WMT" },
  { category: "stocks", pairName: "MCD" },

  // TECH
  { category: "stocks", pairName: "AMD" },
  { category: "stocks", pairName: "INTC" },
  { category: "stocks", pairName: "CRM" },
  { category: "stocks", pairName: "ORCL" },

  // CHINA ADR
  { category: "stocks", pairName: "BABA" },
  { category: "stocks", pairName: "JD" },
  { category: "stocks", pairName: "PDD" },
  { category: "stocks", pairName: "NIO" },
];

export const INDICES = [
  { category: "indices", pairName: "SPX500" },
  { category: "indices", pairName: "NAS100" },
  { category: "indices", pairName: "DJI30" },
  { category: "indices", pairName: "RUS2000" },

  { category: "indices", pairName: "UK100" },
  { category: "indices", pairName: "GER40" },
  { category: "indices", pairName: "FRA40" },

  { category: "indices", pairName: "JPN225" },
  { category: "indices", pairName: "HK50" },
  { category: "indices", pairName: "AUS200" },

  { category: "indices", pairName: "DXY" },
  { category: "indices", pairName: "VIX" },
];

export const ALL_INSTRUMENTS: InstrumentType[] = [
  ...FOREX,
  ...CRYPTO,
  ...STOCKS,
  ...INDICES,
  ...COMMODITIES,
];

export const JOURNAL_SEED = [
  {
    date: new Date("2026-04-01"),
    pair: "EURUSD",
    type: "LONG",
    entryCriteria:
      "Liquidity sweep below Asian low followed by reclaim of bullish order block on M15",
    entryConfirmation:
      "Bullish engulfing candle + break of minor structure on 5M",
    session: "London",
    exitTime: "10:45",
    tradeOutcome: "TP",
    tradeManagement:
      "Entered with full position size, moved SL to breakeven after +1R, partials taken at +2R and final TP hit at +3R",
    riskReward: "1:3",
    mistakes: [],
    rightDeeds: [
      "Waited for sweep",
      "Followed execution plan",
      "Good patience",
    ],
    feelings: ["Confident", "Focused"],
    note: "This was a textbook liquidity sweep setup. Price took out early Asian lows, induced sellers, then sharply reversed into a clean bullish displacement. Entry timing was precise and aligned with higher timeframe bullish bias. Execution felt effortless and in flow state.",
  },

  {
    date: new Date("2026-04-02"),
    pair: "GBPUSD",
    type: "SHORT",
    entryCriteria:
      "Resistance zone formed from previous day high with visible inefficiency and bearish order block confluence",
    entryConfirmation:
      "Pin bar rejection on H1 followed by lower timeframe bearish structure break",
    session: "London",
    exitTime: "12:10",
    tradeOutcome: "SL",
    tradeManagement:
      "Entered early without full confirmation, did not adjust stop despite momentum shift",
    riskReward: "1:2",
    mistakes: [
      "Entered before confirmation",
      "Ignored bullish divergence on lower timeframe",
    ],
    rightDeeds: [],
    feelings: ["Frustrated", "Impatient"],
    note: "This trade was emotionally driven. I anticipated the reversal instead of waiting for confirmation. Price initially respected resistance but failed to continue downward due to stronger underlying bullish momentum. Early entry caused unnecessary loss.",
  },

  {
    date: new Date("2026-04-03"),
    pair: "XAUUSD",
    type: "LONG",
    entryCriteria:
      "Deep retracement into institutional demand zone aligned with 4H bullish trend continuation",
    entryConfirmation:
      "Break of structure on M15 with strong displacement candle and volume spike",
    session: "NY",
    exitTime: "15:30",
    tradeOutcome: "TP",
    tradeManagement:
      "Scaled in two entries, partials at +1.5R and final exit at +4R after extended trend continuation",
    riskReward: "1:4",
    mistakes: [],
    rightDeeds: [
      "Excellent execution timing",
      "Followed multi-timeframe alignment",
      "Good scaling strategy",
    ],
    feelings: ["Calm", "Confident"],
    note: "Gold respected higher timeframe demand perfectly. The entry was confirmed by strong displacement and momentum shift. This was a high-quality institutional setup with clean continuation structure.",
  },

  {
    date: new Date("2026-04-04"),
    pair: "USDJPY",
    type: "SHORT",
    entryCriteria:
      "Potential reversal at premium pricing after extended bullish leg into HTF resistance",
    entryConfirmation:
      "Lower high formation with weak bullish follow-through on M30",
    session: "Asian",
    exitTime: "06:50",
    tradeOutcome: "BE",
    tradeManagement: "Moved SL to breakeven too early after minor pullback",
    riskReward: "1:2",
    mistakes: ["Over-managed position", "Exited too early due to fear"],
    rightDeeds: ["Protected capital"],
    feelings: ["Neutral", "Uncertain"],
    note: "Setup had validity but lacked strong momentum confirmation. Early risk management resulted in missed opportunity. Market eventually moved in anticipated direction but without me in the trade.",
  },

  {
    date: new Date("2026-04-05"),
    pair: "EURUSD",
    type: "SHORT",
    entryCriteria:
      "Liquidity grab above previous day high with bearish bias from HTF resistance zone",
    entryConfirmation: "Bearish engulfing on M15 after failed breakout attempt",
    session: "London",
    exitTime: "11:20",
    tradeOutcome: "SL",
    tradeManagement:
      "Held full position without adjustment despite structural shift",
    riskReward: "1:3",
    mistakes: ["Ignored higher timeframe bullish pressure"],
    rightDeeds: [],
    feelings: ["Annoyed", "Overconfident"],
    note: "Market invalidated bearish bias after stronger than expected bullish continuation. Entry was technically valid but contextually weak due to HTF momentum against position.",
  },

  {
    date: new Date("2026-04-06"),
    pair: "BTCUSD",
    type: "LONG",
    entryCriteria:
      "Range expansion after prolonged consolidation with institutional accumulation signals",
    entryConfirmation: "Volume breakout + bullish structure shift on M15",
    session: "NY",
    exitTime: "18:00",
    tradeOutcome: "TP",
    tradeManagement: "Held full position to completion of breakout leg",
    riskReward: "1:5",
    mistakes: [],
    rightDeeds: [
      "Waited for breakout confirmation",
      "Did not exit early despite volatility",
    ],
    feelings: ["Excited", "Engaged"],
    note: "Crypto volatility created strong directional expansion. Entry aligned with accumulation breakout phase. Momentum carried price cleanly through multiple resistance levels.",
  },

  {
    date: new Date("2026-04-07"),
    pair: "AUDUSD",
    type: "LONG",
    entryCriteria:
      "Double bottom formation at HTF support with visible liquidity pool below lows",
    entryConfirmation:
      "Small bullish rejection candle followed by minor BOS on M5",
    session: "Asian",
    exitTime: "04:30",
    tradeOutcome: "BE",
    tradeManagement:
      "Stop moved aggressively to breakeven due to fear of reversal",
    riskReward: "1:2",
    mistakes: ["Over-tight stop management", "Lack of patience"],
    rightDeeds: ["Protected capital"],
    feelings: ["Impatient", "Cautious"],
    note: "Trade had valid structure but was managed too tightly. Market wicked into liquidity before moving upward without me. Psychological interference affected outcome.",
  },

  {
    date: new Date("2026-04-08"),
    pair: "GBPJPY",
    type: "SHORT",
    entryCriteria:
      "Trendline rejection combined with overextended bullish move into resistance",
    entryConfirmation:
      "Bearish engulfing on H1 with weak bullish follow-through",
    session: "London",
    exitTime: "09:55",
    tradeOutcome: "SL",
    tradeManagement: "No adjustments made during adverse movement",
    riskReward: "1:3",
    mistakes: ["Forced trade", "Entered without full confluence"],
    rightDeeds: [],
    feelings: ["Doubtful", "Frustrated"],
    note: "Entry lacked strong institutional confirmation. Market structure remained bullish and invalidated short bias quickly.",
  },

  {
    date: new Date("2026-04-09"),
    pair: "EURJPY",
    type: "LONG",
    entryCriteria:
      "Break of market structure followed by retracement into bullish order block",
    entryConfirmation:
      "Strong rejection candle on M15 with displacement continuation",
    session: "London",
    exitTime: "13:10",
    tradeOutcome: "TP",
    tradeManagement: "Scaled out partially at +2R, final TP at +3R",
    riskReward: "1:3",
    mistakes: [],
    rightDeeds: ["Followed structure", "Executed patiently"],
    feelings: ["Focused", "Stable"],
    note: "Clean continuation trade after structural shift. Entry aligned with institutional flow and was executed with discipline.",
  },

  {
    date: new Date("2026-04-10"),
    pair: "NAS100",
    type: "SHORT",
    entryCriteria:
      "Overextended bullish move into weekly resistance with divergence forming on RSI",
    entryConfirmation:
      "Bearish rejection on M15 with weak continuation candles",
    session: "NY",
    exitTime: "17:40",
    tradeOutcome: "BE",
    tradeManagement: "Partial profits taken early, rest stopped at breakeven",
    riskReward: "1:2",
    mistakes: [],
    rightDeeds: ["Good partial management", "Reduced risk early"],
    feelings: ["Calm"],
    note: "Market lacked strong directional conviction. Price consolidated after rejection instead of trending, leading to breakeven exit.",
  },
];
