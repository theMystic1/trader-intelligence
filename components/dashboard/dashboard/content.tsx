"use client";

import { gettingStartedItems } from "@/lib/constants";
import { Icon } from "./Dashboard";

const Content = ({
  gsOpen,
  setGsOpen,
}: {
  gsOpen: boolean;
  setGsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <section className="pt-0  overflow-y-auto flex-1">
      {/* Getting Started */}
      <div className="bg-[#1a1f2e] border border-[#2a3040] rounded-lg overflow-hidden mb-4 ">
        <div className="flex items-center gap-2 pt-3.5 px-4 pb-2.5 ">
          <span className="text-[#f59e0b] ">✦</span>
          <span className="text-sm font-semibold text-[#e2e8f0]">
            Getting Started
          </span>
          <span className="bg-[#374151] text-[#9ca3af] text-[11px] px-2 py-1 rounded-full ml-2">
            0/4 complete
          </span>
          <div
            className="ml-auto flex gap-1.5 text-[#6b7280] cursor-pointer"
            onClick={() => setGsOpen((v) => !v)}
          >
            <span>
              <Icon
                name={gsOpen ? "chevronUp" : "chevronDown"}
                size={16}
                color="#6b7280"
              />
            </span>
            <Icon name="close" size={16} color="#6b7280" />
          </div>
        </div>
        <div className="h-1 bg-[#2a3040] mx-4" />
        {gsOpen && (
          <div>
            {gettingStartedItems.map((item, i) => (
              <div
                key={i}
                className={`flex items-center py-3 px-4 ${i === 0 ? "border-t border-t-[#2a3040]" : ""}`}
              >
                <div className="w-4 h-4 border-[1.5px] border-[#4b5563] rounded-full mr-3 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-[#e2e8f0]">
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "#6b7280",
                      marginTop: 1,
                    }}
                  >
                    {item.desc}
                  </div>
                </div>
                <div className="ml-auto text-[#6b7280]">
                  <Icon name={item.icon} size={16} color="#6b7280" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Content;
