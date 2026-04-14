"use client";

import { InstrumentCats } from "@/lib/constants";
import { InstrumentType } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type Instrument = {
  category: string;
  pairName: string;
};

type Props = {
  instruments: InstrumentType[];
  onSelect: (instrument: InstrumentType) => void;
  isLoading: boolean;
  showValue?: boolean;
};

export const InstrumentSelector = ({
  instruments,
  onSelect,
  isLoading,
  showValue = false,
}: Props) => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const srchPaarams = useSearchParams();
  const category = srchPaarams.get("category");
  const pathname = usePathname();

  const filtered = useMemo(() => {
    return instruments.filter((i) =>
      i.pairName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, instruments]);

  const grouped = useMemo(() => {
    return filtered.reduce((acc: Record<string, InstrumentType[]>, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [filtered]);

  const updateQueryParams = (classId: string) => {
    const params = new URLSearchParams(srchPaarams.toString());

    if (!classId) {
      params.delete("category");
    } else {
      params.set("category", classId);
    }

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(newUrl, { scroll: false });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
        {InstrumentCats?.map((cat) => (
          <button
            key={cat}
            onClick={() => updateQueryParams(cat)}
            className={`text-xs   border border-indigo-600 py-2 px-4 rounded-lg transition-all duration-300 cursor-pointer ${category === cat ? "text-white bg-indigo-600" : "text-indigo-600 hover:bg-indigo-200 hover:border-none"}`}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* search input */}
      <div className="relative">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search instruments (BTC, EUR/USD, AAPL...)"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-blue-500/50"
        />
      </div>

      {/* list */}
      <div className="max-h-[400px] overflow-y-auto no-scrollbar  space-y-5 pr-1">
        {isLoading ? (
          <div className="text-center text-white/40 text-sm py-10 w-full flex flex-col items-center justify-center">
            <svg
              className="animate-spin"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <div className="text-center text-white/40 text-sm py-10">
              wait a moment....
            </div>
          </div>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xs uppercase text-white/40 mb-2 tracking-wider">
                {category}
              </h3>

              <div className="space-y-1">
                {items.map((item) => (
                  <button
                    key={item.pairName}
                    onClick={() => onSelect(item)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-white hover:bg-white/10 transition"
                  >
                    <span className="text-sm">{item.pairName}</span>
                    <span className="text-xs text-white/40">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}

        {filtered.length === 0 && isLoading === false && (
          <div className="text-center text-white/40 text-sm py-10">
            No instruments found
          </div>
        )}
      </div>
    </div>
  );
};
