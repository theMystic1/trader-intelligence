import { TradingPlanType } from "@/types";
import { get, post, patch, del } from "../../api-client";

const baseUrl = "/api/trades/plans";
export const getTradingPlan = (planId: string) => {
  return get(`${baseUrl}/${planId}`);
};

export const updateTradingPlan = (planId: string, data: any) => {
  return patch(`${baseUrl}/${planId}`, data);
};

export const deleteTradingPlan = (planId: string) => {
  return del(`${baseUrl}/${planId}`);
};

export const createTradingPlan = (data: TradingPlanType) => {
  return post(`${baseUrl}`, data);
};

export const getTradingPlans = () => {
  return get(`${baseUrl}`);
};
