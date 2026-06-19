import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyPaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  status: string;
  search: string;
}

export function PropertyPagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  status,
  search,
}: PropertyPaginationProps) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
      <p className="text-xs text-[#80756d] font-sans">
        Affichage de{' '}
        <span className="font-semibold text-[#322214]">
          {start + 1}
        </span>{' '}
        à{' '}
        <span className="font-semibold text-[#322214]">
          {Math.min(start + pageSize, totalCount)}
        </span>{' '}
        sur{' '}
        <span className="font-semibold text-[#322214]">{totalCount}</span>{' '}
        {totalCount > 1 ? 'biens' : 'bien'}
      </p>

      <div className="flex items-center gap-1">
        {/* Previous link */}
        {page > 1 ? (
          <Link
            href={`/admin/property?page=${page - 1}&status=${status}${search ? `&search=${search}` : ''}`}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-[#dec1ac]/65 hover:bg-[#fff1e9]/30 text-[#80756d] hover:text-[#322214] rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Précédent</span>
          </Link>
        ) : (
          <span className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-stone-50 border border-stone-200 text-stone-300 rounded-lg text-xs font-semibold select-none cursor-not-allowed">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Précédent</span>
          </span>
        )}

        {/* Page number buttons */}
        {Array.from({ length: totalPages }).map((_, idx) => {
          const targetPage = idx + 1;
          const isCurrent = page === targetPage;
          return (
            <Link
              key={targetPage}
              href={`/admin/property?page=${targetPage}&status=${status}${search ? `&search=${search}` : ''}`}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                isCurrent
                  ? 'bg-[#322214] text-white'
                  : 'bg-white border border-[#dec1ac]/65 text-[#80756d] hover:bg-[#fff1e9]/30 hover:text-[#322214] shadow-sm'
              }`}
            >
              {targetPage}
            </Link>
          );
        })}

        {/* Next link */}
        {page < totalPages ? (
          <Link
            href={`/admin/property?page=${page + 1}&status=${status}${search ? `&search=${search}` : ''}`}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-[#dec1ac]/65 hover:bg-[#fff1e9]/30 text-[#80756d] hover:text-[#322214] rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            <span>Suivant</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <span className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-stone-50 border border-stone-200 text-stone-300 rounded-lg text-xs font-semibold select-none cursor-not-allowed">
            <span>Suivant</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </div>
  );
}
