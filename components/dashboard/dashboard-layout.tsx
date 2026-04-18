"use client";

import { ReactNode } from "react";
import { Icon } from "./dashboard/Dashboard";
import Sidebar from "../ui/sidebar";
import { usePathname } from "next/navigation";
import Logo from "../ui/logo";
import { BiMenu } from "react-icons/bi";
import { useDisclosure } from "@/hooks/useDisclosure";
import MobileDrawer from "../ui/mobile-drawer";

const DashLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { isOpen, open, close } = useDisclosure();

  return (
    <div className="grid lg:grid-cols-[210px_1fr] min-h-screen bg-[#0f1117] text-[#e2e8f0] text-sm">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile drawer — rendered into document.body via portal */}
      <MobileDrawer isOpen={isOpen} onClose={close} />

      <main className="flex-1 flex flex-col min-w-0 py-6">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-2 mb-2">
          <Logo />
          <button
            onClick={open}
            aria-label="Open menu"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            className="w-9 h-9 flex items-center justify-start rounded-lg hover:bg-[#1e2a3a] transition-colors"
          >
            <BiMenu size={22} color="#e2e8f0" />
          </button>
        </div>

        {/* Dashboard page header */}
        {pathname === "/dashboard" && (
          <nav className="flex items-start justify-between p-2">
            <div>
              <div className="flex items-center gap-2">
                Dashboard
                <Icon name="refresh" size={16} color="#6b7280" />
              </div>
              <p className="text-sm text-[#6b7280] mt-2">
                Overview of your trading performance
              </p>
            </div>
          </nav>
        )}

        {children}
      </main>
    </div>
  );
};

export default DashLayout;
