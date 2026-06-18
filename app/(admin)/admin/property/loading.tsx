import React from 'react';

export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse font-sans">
      {/* Header Row Skeleton */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-[#dec1ac]/35 rounded-lg" />
          <div className="h-4 w-32 bg-[#dec1ac]/20 rounded-md" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="h-9 w-64 bg-[#dec1ac]/25 rounded-xl" />
          <div className="h-9 w-24 bg-[#dec1ac]/25 rounded-xl" />
          <div className="h-9 w-32 bg-[#dec1ac]/25 rounded-xl" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="border-b border-[#dec1ac]/40 flex gap-6 pb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 w-20 bg-[#dec1ac]/25 rounded-md" />
        ))}
      </div>

      {/* Table Container Skeleton */}
      <div className="bg-white rounded-2xl border border-[#dec1ac]/65 shadow-sm overflow-hidden">
        <div className="p-4 bg-[#fff1e9]/10 border-b border-[#dec1ac]/40 flex gap-4">
          <div className="h-4 w-8 bg-[#dec1ac]/20 rounded" />
          <div className="h-4 w-16 bg-[#dec1ac]/20 rounded" />
          <div className="h-4 w-48 bg-[#dec1ac]/20 rounded" />
          <div className="h-4 w-20 bg-[#dec1ac]/20 rounded" />
          <div className="h-4 w-24 bg-[#dec1ac]/20 rounded" />
          <div className="h-4 w-20 bg-[#dec1ac]/20 rounded" />
          <div className="h-4 w-20 bg-[#dec1ac]/20 rounded" />
        </div>

        <div className="divide-y divide-[#dec1ac]/25">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-5 flex items-center justify-between gap-4">
              <div className="h-4 w-8 bg-[#dec1ac]/20 rounded shrink-0" />
              <div className="h-12 w-16 bg-[#dec1ac]/20 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-[#dec1ac]/25 rounded" />
                <div className="h-3.5 w-1/4 bg-[#dec1ac]/15 rounded" />
              </div>
              <div className="h-5 w-16 bg-[#dec1ac]/20 rounded-full shrink-0" />
              <div className="h-4 w-24 bg-[#dec1ac]/25 rounded shrink-0" />
              <div className="h-6 w-20 bg-[#dec1ac]/20 rounded-full shrink-0" />
              <div className="h-6 w-24 bg-[#dec1ac]/20 rounded-xl shrink-0" />
              <div className="h-4 w-20 bg-[#dec1ac]/20 rounded shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
