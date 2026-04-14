import {
  getBacktests,
  getBacktestStats,
  getOverviewStats,
} from "@/server/lib/api/backtest/api";
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

export const useBacktestStats = () => {
  const { backtestId } = useParams();
  const {
    data: backtestStats,
    isLoading: isLoadingBacktestStats,
    refetch: refetchBacktestStats,
  } = useQuery({
    queryKey: ["backtestStats", backtestId],
    queryFn: () => getBacktestStats(String(backtestId)),
    enabled: !!backtestId,
  });

  return { backtestStats, isLoadingBacktestStats, refetchBacktestStats };
};
