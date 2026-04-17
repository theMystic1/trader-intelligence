import { JournalEntry } from "@/types";
import { get, post, patch, del } from "../../api-client";

const baseUrl = "/api/trades/journal";

export const createJournal = (data: JournalEntry) => {
  return post(`${baseUrl}`, data);
};

export const updateJournal = (journalId: string, data: JournalEntry) => {
  return patch(`${baseUrl}/${journalId}`, data);
};

export const deleteJournal = (journalId: string) => {
  return del(`${baseUrl}/${journalId}`);
};

export const getJournal = (journalId: string) => {
  return get(`${baseUrl}/${journalId}`);
};

export const getJournals = ({
  type,
  tradeOutcome,
  page,
  limit = 20,
  search,
}: {
  type?: string;
  tradeOutcome?: string;
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const params: Record<string, any> = { limit };

  if (type) params.type = type;
  if (tradeOutcome) params.tradeOutcome = tradeOutcome;
  if (page !== undefined) params.page = page;
  if (search) params.search = search;

  return get(`${baseUrl}`, { params });
};

export const seedJournal = (journals: JournalEntry[]) => {
  return post(`${baseUrl}/seed`, { journals });
};
