"use client";

import { useSinglePlan } from "@/hooks/usePlans";
import { TradingPlanType } from "@/types";
import { StrategyDetailView } from "./plans";
import { useRouter } from "next/navigation";

const SinglePlan = () => {
  const { plan, planLoading } = useSinglePlan();
  const router = useRouter();

  if (planLoading) {
    return <div>Loading...</div>;
  }

  // console.log(plan);

  const planData: TradingPlanType = plan?.data || plan;
  return <StrategyDetailView plan={planData} onBack={() => router.back()} />;
};

export default SinglePlan;
