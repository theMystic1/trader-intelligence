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
