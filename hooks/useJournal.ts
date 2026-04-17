"use client";
import { getJournals } from "@/server/lib/api/trades/jornal/journaling";
import { JournalEntry } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const LIMIT = 5;

const useJournal = () => {
  const srchParams = useSearchParams();
  const type = srchParams.get("type") ?? "";
  const outcome = srchParams.get("outcome") ?? "";
  const search = srchParams.get("search") || undefined;

  const query = useInfiniteQuery({
    queryKey: ["journals", type, outcome, search],
    queryFn: ({ pageParam = 1 }) =>
      getJournals({
        type: String(type),
        tradeOutcome: String(outcome),
        page: pageParam,
        limit: LIMIT,
        search,
      }),
    initialPageParam: 1,
    // APIFeatures returns { data, pagination: { hasNext, curPage } }
    // return undefined when there's no next page so hasNextPage becomes false
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.hasNext
        ? lastPage.pagination.curPage + 1
        : undefined,
  });

  // Flatten all pages into a single array for rendering
  const journals: JournalEntry[] =
    query.data?.pages.flatMap((page) => page?.data ?? []) ?? [];

  return {
    journals,
    isLoadingJournals: query.isLoading,
    errorJournals: query.error,
    refetchJournals: query.refetch,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isFetching: query.isFetching,
  };
};

export default useJournal;
