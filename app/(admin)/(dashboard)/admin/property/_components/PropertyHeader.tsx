import * as React from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';

interface PropertyHeaderProps {
  allCount: number;
  status: string;
  search: string;
}

export function PropertyHeader({ allCount, status, search }: PropertyHeaderProps) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-sans text-[#322214] font-bold tracking-tight">
          Biens immobiliers
        </h1>
        <p className="text-xs text-[#80756d] font-sans">
          {allCount} {allCount > 1 ? 'biens' : 'bien'} au total
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Search form */}
        <form method="GET" action="/admin/property" className="relative flex-1 sm:flex-initial">
          <input type="hidden" name="status" value={status} />
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#80756d]" />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Rechercher un bien..."
            className="pl-10 pr-4 py-2 bg-white border border-[#dec1ac]/65 rounded-xl text-xs focus:outline-none focus:border-[#c5a373] w-full sm:w-64 text-[#221a14] shadow-sm transition-all"
          />
        </form>

        {/* Filter toggle button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dec1ac]/65 hover:bg-[#fff1e9]/30 text-[#322214] rounded-xl text-xs font-sans font-semibold transition-all shadow-sm">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#80756d]" />
          <span>Filtres</span>
        </button>

        {/* New property button */}
        <Link
          href="/admin/property/nouveau"
          className="flex items-center gap-2 px-4 py-2 bg-[#322214] hover:bg-[#4a3728] text-white rounded-xl text-xs font-sans font-semibold transition-all shadow-sm uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau bien</span>
        </Link>
      </div>
    </div>
  );
}
