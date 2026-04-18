"use client";

import { useMemo } from "react";
import debounce from "lodash.debounce";

import { Modal } from "@/components/ui/modal";
import { Filter, FormState, JournalEntry } from "@/types";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { EntryCard, EntryDetail } from "./others";
import NewEntryForm from "./new-entry";
import useJournal from "@/hooks/useJournal";
import AdminDashboardSkeleton from "@/app/loading";
import { toApiError } from "@/server/lib/api-error";
import toast from "react-hot-toast";
import {
  createJournal,
  seedJournal,
} from "@/server/lib/api/trades/jornal/journaling";
import { JOURNAL_SEED } from "@/lib/pair-seed";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function StatsBar({ entries }: { entries: JournalEntry[] }) {
  const total = entries.length;
  const wins = entries.filter((e) => e.tradeOutcome === "TP").length;
  const losses = entries.filter((e) => e.tradeOutcome === "SL").length;
  const bes = entries.filter((e) => e.tradeOutcome === "BE").length;
  const wr = total ? ((wins / total) * 100).toFixed(0) : "0";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {[
        { label: "Total Entries", value: total, color: "text-white" },
        { label: "Win Rate", value: `${wr}%`, color: "text-green-400" },
        {
          label: "Wins / Losses",
          value: `${wins}W ${losses}L ${bes}BE`,
          color: "text-gray-300",
        },
        {
          label: "This Month",
          value: entries.filter(
            (e) => new Date(e.date).getMonth() === new Date().getMonth(),
          ).length,
          color: "text-blue-400",
        },
      ].map((s) => (
        <div
          key={s.label}
          className="bg-[#131620] border border-[#1e2a3a] rounded-xl px-4 py-3"
        >
          <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">
            {s.label}
          </p>
          <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────
   Page
────────────────────────────────────────── */
export default function TradingJournalPage() {
  const [selected, setSelected] = useState<JournalEntry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const srchPaarams = useSearchParams();
  const outcome = srchPaarams.get("outcome") ?? "all";
  const [filter, setFilter] = useState<Filter>(outcome as Filter);
  const pathname = usePathname();

  const updateSearch = useMemo(
    () =>
      debounce((value: string) => {
        const params = new URLSearchParams(srchPaarams.toString());

        if (!value) {
          params.delete("search");
        } else {
          params.set("search", value);
        }

        router.replace(
          params.toString() ? `${pathname}?${params.toString()}` : pathname,
          { scroll: false },
        );
      }, 400),
    [srchPaarams, pathname, router],
  );
  // const type = srchPaarams.get("type") ?? "";

  const updateQueryParams = (outcome: string) => {
    const params = new URLSearchParams(srchPaarams.toString());

    if (!outcome) {
      params.delete("outcome");
    } else {
      params.set("outcome", outcome);
    }

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.replace(newUrl, { scroll: false });
  };

  const {
    journals,
    isLoadingJournals,
    errorJournals,
    refetchJournals,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useJournal();

  // ── Intersection Observer sentinel ──
  // `threshold: 0` fires as soon as even 1px of the sentinel is visible.
  // `rootMargin: "200px"` pre-fetches before the user actually hits the bottom.
  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    rootMargin: "0px 0px 300px 0px",
  });

  // Trigger next page whenever the sentinel scrolls into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSave = async (form: FormState) => {
    try {
      setSaving(true);
      await createJournal({ ...form } as JournalEntry);
      await refetchJournals();
      toast.success("Trade journal entry saved successfully");
      setShowForm(false);
    } catch (error) {
      toast.error(toApiError(error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    try {
      setSaving(true);
      await seedJournal(JOURNAL_SEED as any);
      await refetchJournals();
      toast.success("Trade journal entries seeded successfully");
    } catch (error) {
      toast.error(toApiError(error).message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoadingJournals) return <AdminDashboardSkeleton />;
  if (errorJournals) return <div>Error: {errorJournals.message}</div>;

  const filtered = journals
    .filter(
      (e) => filter === "all" || e.tradeOutcome === filter || e.type === filter,
    )
    .filter(
      (e) =>
        !search ||
        e.pair.toLowerCase().includes(search.toLowerCase()) ||
        e.entryCriteria.toLowerCase().includes(search.toLowerCase()),
    );

  // console.log(hasNextPage);

  return (
    <div className="min-h-screen bg-[#0f1117] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Trading Journal</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Document, review, and grow from every trade.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowForm(true);
                setSelected(null);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Entry
            </button>
            {/*<button
              onClick={handleSeed}
              disabled={saving}
              className="text-xs px-3 py-1.5 bg-amber-600 text-amber-100 rounded-lg border font-semibold uppercase"
            >
              {saving ? "Submitting..." : "Seed Dummy trades"}
            </button>*/}
          </div>
        </div>

        {/* ── Stats bar (all loaded entries) ── */}
        {journals?.length > 0 ? <StatsBar entries={journals} /> : null}

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex items-center gap-2 bg-[#131620] border border-[#1e2a3a] rounded-lg h-9 px-3 flex-1 sm:flex-none sm:w-56">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4b5563"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={search ?? ""}
              onChange={(e) => {
                updateSearch(e.target.value);
                setSearch(e.target.value);
              }}
              placeholder="Search pair..."
              className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none"
            />
          </div>
          <div className="flex gap-0 bg-[#131620] border border-[#1e2a3a] rounded-lg overflow-hidden">
            {(["all", "TP", "SL", "BE"] as Filter[]).map((f) => (
              <button
                key={f}
                className={`px-3 py-2 text-xs font-semibold transition-colors ${
                  outcome === f
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
                onClick={() =>
                  f === "all" ? updateQueryParams("") : updateQueryParams(f)
                }
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Entry list ── */}
        {filtered.length === 0 && !isFetchingNextPage ? (
          <div className="bg-[#131620] border border-[#1e2a3a] rounded-2xl py-12 text-center">
            <p className="text-gray-600 text-sm">No journal entries found.</p>
            <button
              onClick={() => {
                setShowForm(true);
                setSelected(null);
              }}
              className="mt-3 text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              Add your first entry →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((entry) => (
              <EntryCard
                key={entry._id}
                entry={entry}
                onSelect={() => {
                  setSelected(entry);
                  setShowJournal(true);
                }}
              />
            ))}

            {/* ── Sentinel: sits below the last card ── */}
            {/* ref attaches the IntersectionObserver; only rendered when more pages exist */}
            {hasNextPage && (
              <div ref={sentinelRef} className="h-10" aria-hidden="true" />
            )}

            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-6 gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                <span className="text-xs text-gray-500">
                  Loading more entries…
                </span>
              </div>
            )}

            {!hasNextPage && journals.length > 0 && (
              <p className="text-center text-xs text-gray-600 py-4">
                All {journals.length} entries loaded
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Journal your trade"
      >
        <NewEntryForm
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          saving={saving}
        />
      </Modal>

      <Modal
        isOpen={showJournal}
        onClose={() => setShowJournal(false)}
        title="Journal"
      >
        <EntryDetail entry={selected!} onClose={() => setShowJournal(false)} />
      </Modal>
    </div>
  );
}
