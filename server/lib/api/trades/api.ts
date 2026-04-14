import { post, get } from "../api-client";

const baseUrl = "/api/trades";

export const seedInstruments = async () => {
  return post(`${baseUrl}/pairs`, {});
};

export const getInstruments = async ({
  category,
  page,
  limit,
}: {
  category: string;
  page: number;
  limit: number;
}) => {
  return get(`${baseUrl}/pairs`, {
    params: { category: category?.toLowerCase(), page, limit },
  });
};
