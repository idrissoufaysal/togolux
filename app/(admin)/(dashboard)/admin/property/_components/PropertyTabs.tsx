import * as React from 'react';
import Link from 'next/link';

interface TabItem {
  id: string;
  label: string;
  count: number;
}

interface PropertyTabsProps {
  status: string;
  search: string;
  allCount: number;
  disponibleCount: number;
  sousCompromisCount: number;
  venduCount: number;
  locationCount: number;
}

export function PropertyTabs({
  status,
  search,
  allCount,
  disponibleCount,
  sousCompromisCount,
  venduCount,
  locationCount,
}: PropertyTabsProps) {
  const tabs: TabItem[] = [
    { id: 'all', label: 'Tous', count: allCount },
    { id: 'disponible', label: 'Disponibles', count: disponibleCount },
    { id: 'sous_compromis', label: 'Sous compromis', count: sousCompromisCount },
    { id: 'vendu', label: 'Vendus', count: venduCount },
    { id: 'location', label: 'En location', count: locationCount },
  ];

  return (
    <div className="border-b border-[#dec1ac]/60 flex gap-6 overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const isActive = status === tab.id;
        const linkHref = `/admin/property?status=${tab.id}${search ? `&search=${search}` : ''}`;
        return (
          <Link
            key={tab.id}
            href={linkHref}
            className={`pb-3 text-xs font-sans font-bold uppercase tracking-wider border-b-2 transition-all duration-200 shrink-0 ${
              isActive
                ? 'border-[#c5a373] text-[#322214]'
                : 'border-transparent text-[#80756d] hover:text-[#322214]'
            }`}
          >
            {tab.label}{' '}
            <span className="ml-0.5 text-[10px] font-normal text-[#80756d]/75">
              ({tab.count})
            </span>
          </Link>
        );
      })}
    </div>
  );
}
