import { handleGetMe } from "@/server/lib/api/apii";
import { useQuery } from "@tanstack/react-query";

export const useMe = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: handleGetMe,
  });

  return { me: data, isLoadingMe: isLoading, refetchMe: refetch };
};
