import { BacktestType } from "@/types";
import { post, get, del, patch } from "../api-client";

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

export async function deleteBacktest(backtestId: string) {
  return del(`${baseUrl}/${backtestId}`);
}
export async function updateBacktest(backtestId: string, body: BacktestType) {
  return patch(`${baseUrl}/${backtestId}`, body);
}

export async function logNewTrade(body: any, backtestId: string) {
  return post(`${baseUrl}/${backtestId}/trade`, body);
}

export async function logNewTradesBulk(body: any, backtestId: string) {
  return post(`${baseUrl}/${backtestId}/bulk`, body);
}
