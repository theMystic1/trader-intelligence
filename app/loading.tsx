"use client";

import * as React from "react";

type SkeletonProps = {
  className?: string;
};

function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={[
        "animate-pulse rounded-lg bg-[#1e2a3a]",
        "relative overflow-hidden",
        className,
      ].join(" ")}
      aria-hidden="true"
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#2a3a50]/60 to-transparent animate-[shimmer_1.2s_infinite]" />
    </div>
  );
}

const AdminDashboardSkeleton = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#0f1117]">
      {/* Header */}
      <div className="border-b border-[#1e2a3a] bg-[#131620]">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="h-4 w-64" />
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#1e2a3a] bg-[#131620] p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-7 w-20" />
                </div>
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Chart */}
          <div className="lg:col-span-8 rounded-2xl border border-[#1e2a3a] bg-[#131620] p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-9 w-28" />
            </div>

            <div className="mt-5">
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-4 space-y-6">
            {/* Activity */}
            <div className="rounded-2xl border border-[#1e2a3a] bg-[#131620] p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-8 w-20" />
              </div>

              <div className="mt-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-3 w-2/5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl border border-[#1e2a3a] bg-[#131620] p-4 shadow-sm">
              <Skeleton className="h-5 w-32" />
              <div className="mt-4 grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#1e2a3a] bg-[#0f1117] p-3"
                  >
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <Skeleton className="mt-3 h-4 w-20" />
                    <Skeleton className="mt-2 h-3 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="lg:col-span-12 rounded-2xl border border-[#1e2a3a] bg-[#131620] p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-[#1e2a3a]">
              {/* table header */}
              <div className="grid grid-cols-12 gap-3 bg-[#0f1117] px-4 py-3">
                <Skeleton className="col-span-3 h-4" />
                <Skeleton className="col-span-2 h-4" />
                <Skeleton className="col-span-3 h-4" />
                <Skeleton className="col-span-2 h-4" />
                <Skeleton className="col-span-2 h-4" />
              </div>

              {/* rows */}
              <div className="divide-y divide-[#1e2a3a] bg-[#131620]">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 px-4 py-4">
                    <div className="col-span-3 flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-3 w-2/5" />
                      </div>
                    </div>
                    <Skeleton className="col-span-2 h-4 self-center" />
                    <Skeleton className="col-span-3 h-4 self-center" />
                    <Skeleton className="col-span-2 h-4 self-center" />
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <Skeleton className="h-9 w-9 rounded-lg" />
                      <Skeleton className="h-9 w-9 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* pagination */}
            <div className="mt-4 flex items-center justify-between">
              <Skeleton className="h-4 w-40" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardSkeleton;
