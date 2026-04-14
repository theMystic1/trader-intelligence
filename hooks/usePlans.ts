import {
  getTradingPlan,
  getTradingPlans,
} from "@/server/lib/api/trades/plans/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export function usePlans() {
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: getTradingPlans,
    refetchOnWindowFocus: true,
  });

  return { plans, plansLoading };
}

export const useSinglePlan = () => {
  const { planId } = useParams();
  const { data: plan, isLoading: planLoading } = useQuery({
    queryKey: ["plan", planId],
    queryFn: () => getTradingPlan(String(planId)),
    refetchOnWindowFocus: true,
    enabled: Boolean(planId),
  });

  return { plan, planLoading };
};
