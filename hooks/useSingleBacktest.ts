import { useQuery } from "@tanstack/react-query";
import {
  getBacktestById,
  getBacktestStats,
} from "../server/lib/api/backtest/api";
import { useParams } from "next/navigation";

export const useSingleBacktest = () => {
  const { backtestId } = useParams();
  const {
    data: backtest,
    isLoading: isLoadingBacktest,
    refetch: refetchBacktest,
  } = useQuery({
    queryKey: ["single-backtest", backtestId],
    queryFn: () => getBacktestById(String(backtestId)),
  });

  return { backtest, isLoadingBacktest, refetchBacktest };
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
