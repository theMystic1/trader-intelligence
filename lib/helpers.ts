import cookie from "js-cookie";

export function calculateWinRate(trades: any[]) {
  const wins = trades.filter((t) => t.result === "WIN").length;
  return ((wins / trades.length) * 100).toFixed(1);
}

export const setCookie = (
  name: string,
  value: string,
  options: { expires?: number; path?: string } = {},
) => {
  const expires = options.expires || 365;
  cookie.set(name, value, { expires, path: options.path });
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
