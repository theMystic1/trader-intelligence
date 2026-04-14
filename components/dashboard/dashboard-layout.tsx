"use client";

import { ReactNode } from "react";
import { Icon } from "./dashboard/Dashboard";

import Sidebar from "../ui/sidebar";
import { usePathname } from "next/navigation";

const DashLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  // return <div>{children}</div>;
  //   return (
  return (
    <div className="grid lg:grid-cols-[210px_1fr] min-h-screen bg-[#0f1117] text-[#e2e8f0] text-sm relative ">
      {/* ── SIDEBAR ── */}
      <Sidebar />

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col min-w-0 py-6">
        {/* Top bar */}
        {pathname === "/dashboard" ? (
          <nav className="flex items-start justify-between p-2">
            <div>
              <div className="flex items-center gap-2">
                Dashboard <Icon name="refresh" size={16} color="#6b7280" />
              </div>
              <div className="text-sm text-[#6b7280] mt-2">
                Overview of your trading performance
              </div>
            </div>
            {/* Live match */}
          </nav>
        ) : null}

        {/* Show info */}
        {children}
      </main>
    </div>
  );
};

export default DashLayout;
