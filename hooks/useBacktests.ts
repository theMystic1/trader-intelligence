import { getBacktests, getOverviewStats } from "@/server/lib/api/backtest/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const useBacktests = () => {
  const {
    data: backtests,
    isLoading: isLoadingBacktests,
    refetch: refetchBacktests,
  } = useQuery({
    queryKey: ["backtesting"],
    queryFn: getBacktests,
    refetchOnWindowFocus: true,
  });

  return { backtests, isLoadingBacktests, refetchBacktests };
};

export const useOverviewStats = () => {
  const {
    data: overviewStats,
    isLoading: isLoadingOverviewStats,
    refetch: refetchOverviewStats,
  } = useQuery({
    queryKey: ["overviewStats"],
    queryFn: getOverviewStats,
    refetchOnWindowFocus: true,
  });

  return { overviewStats, isLoadingOverviewStats, refetchOverviewStats };
};
