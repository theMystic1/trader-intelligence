import DashLayout from "@/components/dashboard/dashboard-layout";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return <DashLayout>{children}</DashLayout>;
};

export default DashboardLayout;
