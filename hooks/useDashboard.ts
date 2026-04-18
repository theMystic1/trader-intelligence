import { getDashboardData } from "@/server/lib/api/dasboard/api";
import { useQuery } from "@tanstack/react-query";

export const useDashboard = () => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  });

  return { dasdata: data, isLoading, refetch, error };
};
