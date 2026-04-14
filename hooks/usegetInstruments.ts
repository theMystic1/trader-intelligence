import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getInstruments } from "@/server/lib/api/trades/api";

const LIMIT = 20;

const useGetInstruments = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "forex";

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["instruments", category],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      return getInstruments({
        category,
        page: pageParam,
        limit: LIMIT,
      });
    },

    // tells React Query how to get next page
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.meta?.hasNext ? allPages.length + 1 : undefined;
    },
  });

  // flatten all pages into one list
  const instruments = data?.pages?.flatMap((page: any) => page.data) || [];

  return {
    instruments,
    isLoadingInstrument: isLoading,
    error,

    loadMore: fetchNextPage,
    hasMore: !!hasNextPage,
    isFetchingNextPage,
  };
};

export default useGetInstruments;
