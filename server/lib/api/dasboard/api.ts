import { post, get, del, patch } from "../api-client";

const baseUel = "/api/dashboard";

export const getDashboardData = () => {
  return get(`${baseUel}`);
};
