"use client";

import { useRouter } from "next/navigation";

const Logo = ({ landing }: { landing?: boolean }) => {
  const router = useRouter();
  return (
    <div
      className={`flex items-center gap-3 justify-center  ${landing ? "" : "mb-8"}`}
    >
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm4-8h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h4v2h-4v-2z" />
        </svg>
      </div>
      <div>
        <div className="text-sm font-bold text-white tracking-wide">
          TRADERINTELLIGENCE
        </div>
        <div className="text-[9px] text-gray-500 tracking-widest uppercase">
          Your Trading Blueprint
        </div>
      </div>
    </div>
  );
};

export default Logo;
