import { BacktestType } from "@/types";
import { post, get } from "../api-client";

const baseUrl = "/api/trades/backtests";

export async function getBacktests() {
  return get(baseUrl);
}

export async function createBacktest(body: BacktestType) {
  return post(baseUrl, body);
}

export async function getOverviewStats() {
  return get(`${baseUrl}/overview`);
}

export async function getBacktestStats(backtestId: string) {
  return get(`${baseUrl}/${backtestId}/stats`);
}

export async function getBacktestById(backtestId: string) {
  return get(`${baseUrl}/${backtestId}`);
}
