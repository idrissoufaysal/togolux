import * as React from 'react';
import Link from 'next/link';
import { insforge } from '@/lib/insforge';
import {
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Clock,
  MapPin,
  MessageSquare,
  Phone,
  Mail,
  CheckCheck,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { updateVisitStatus } from '../actions';

export const revalidate = 0; // Fresh visits data

interface SearchParams {
  page?: string;
  status?: string;
  search?: string;
}

export default async function VisitesAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;
  const status = typeof resolvedSearchParams.status === 'string' ? resolvedSearchParams.status : 'all';
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : '';

  // 1. Fetch counts
  const { data: countData } = await insforge.database
    .from('visits')
    .select('statut');

  const allCount = countData?.length || 0;
  const planifieeCount = countData?.filter((v: any) => v.statut === 'planifiee').length || 0;
  const confirmeeCount = countData?.filter((v: any) => v.statut === 'confirmee').length || 0;
  const effectueeCount = countData?.filter((v: any) => v.statut === 'effectuee').length || 0;
  const annuleeCount = countData?.filter((v: any) => v.statut === 'annulee').length || 0;

  // 2. Query visits
  let query = insforge.database
    .from('visits')
    .select('*, property:properties(*)', { count: 'exact' });

  if (status !== 'all') {
    query = query.eq('statut', status);
  }

  if (search) {
    query = query.or(`nom_client.ilike.%${search}%,email_client.ilike.%${search}%,telephone_client.ilike.%${search}%`);
  }

  const PAGE_SIZE = 6;
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  // Order visits chronologically (nearest first)
  query = query.range(start, end).order('date_visite', { ascending: true });

  const { data: visitsData, count: totalFilteredCount } = await query;
  const visits = (visitsData || []) as any[];
  const totalCount = totalFilteredCount || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const tabs = [
    { id: 'all', label: 'Toutes', count: allCount },
    { id: 'planifiee', label: 'Planifiées', count: planifieeCount },
    { id: 'confirmee', label: 'Confirmées', count: confirmeeCount },
    { id: 'effectuee', label: 'Effectuées', count: effectueeCount },
    { id: 'annulee', label: 'Annulées', count: annuleeCount },
  ];

  return (
    <div className="space-y-8">
      {/* Header Row */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-sans text-[#322214] font-bold tracking-tight">
            Gestion des Visites
          </h1>
          <p className="text-xs text-[#80756d] font-sans">
            {allCount} demandes de visite au total
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search form */}
          <form method="GET" action="/admin/visites" className="relative flex-1 sm:flex-initial">
            <input type="hidden" name="status" value={status} />
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#80756d]" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Rechercher un client..."
              className="pl-10 pr-4 py-2 bg-white border border-[#dec1ac]/65 rounded-xl text-xs focus:outline-none focus:border-[#c5a373] w-full sm:w-64 text-[#221a14] shadow-sm transition-all"
            />
          </form>
        </div>
      </div>

      {/* Tabs list */}
      <div className="border-b border-[#dec1ac]/60 flex gap-6 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = status === tab.id;
          const linkHref = `/admin/visites?status=${tab.id}${search ? `&search=${search}` : ''}`;
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

      {/* Visits Cards / Grid Layout */}
      {visits.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#dec1ac]/65 p-12 text-center space-y-3 shadow-sm">
          <Calendar className="w-8 h-8 text-[#80756d]/40 mx-auto" />
          <p className="text-sm font-sans text-[#80756d]">
            Aucune demande de visite ne correspond aux critères de recherche actuels.
          </p>
          <Link
            href="/admin/visites"
            className="inline-block text-xs font-sans text-[#c5a373] hover:underline"
          >
            Réinitialiser les filtres
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visits.map((visit) => {
            const hasProperty = !!visit.property;
            const propertyImage =
              visit.property?.images && visit.property.images.length > 0
                ? visit.property.images[0].url
                : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=300&q=80';

            // Define server action handlers for this visit's status updates
            const confirmAction = updateVisitStatus.bind(null, visit.id, 'confirmee');
            const cancelAction = updateVisitStatus.bind(null, visit.id, 'annulee');
            const completeAction = updateVisitStatus.bind(null, visit.id, 'effectuee');

            return (
              <div
                key={visit.id}
                className="bg-white rounded-2xl border border-[#dec1ac]/65 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300 gap-6"
              >
                {/* Top Details & Badge */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <h3 className="font-sans font-bold text-sm text-[#322214] leading-tight">
                        {visit.nom_client}
                      </h3>
                      <span className="text-[10px] text-[#80756d] font-sans flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#c5a373] shrink-0" />
                        {new Date(visit.date_visite).toLocaleString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <StatusBadge status={visit.statut} className="scale-90" />
                  </div>

                  {/* Client Contact Info */}
                  <div className="bg-[#fff8f5]/40 border border-[#dec1ac]/25 rounded-xl p-3 space-y-1.5 text-xs text-[#221a14] font-sans">
                    <div className="flex items-center gap-2 text-[#80756d]">
                      <Phone className="w-3.5 h-3.5 shrink-0 text-[#c5a373]" />
                      <span className="select-all">{visit.telephone_client}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#80756d]">
                      <Mail className="w-3.5 h-3.5 shrink-0 text-[#c5a373]" />
                      <span className="select-all truncate">{visit.email_client}</span>
                    </div>
                  </div>

                  {/* Visited Property */}
                  {hasProperty ? (
                    <div className="flex gap-3 border-t border-[#dec1ac]/30 pt-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={propertyImage}
                        alt={visit.property.titre}
                        className="w-14 h-12 object-cover rounded-lg border border-[#dec1ac]/30 shrink-0"
                      />
                      <div className="min-w-0 space-y-0.5">
                        <span className="text-xs font-sans font-bold text-[#322214] block leading-tight truncate">
                          {visit.property.titre}
                        </span>
                        <span className="text-[10px] text-[#80756d] font-sans flex items-center gap-0.5 truncate">
                          <MapPin className="w-3 h-3 text-[#c5a373] shrink-0" />
                          {visit.property.ville}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#80756d] italic border-t border-[#dec1ac]/30 pt-4">
                      Bien immobilier non disponible.
                    </div>
                  )}

                  {/* Notes / Message */}
                  {visit.message && (
                    <div className="flex gap-2 text-xs text-[#80756d] bg-stone-50 border border-stone-100 rounded-xl p-3 font-sans italic leading-relaxed">
                      <MessageSquare className="w-4 h-4 text-[#80756d]/60 shrink-0 mt-0.5" />
                      <p className="line-clamp-3">« {visit.message} »</p>
                    </div>
                  )}
                </div>

                {/* Actions row */}
                <div className="border-t border-[#dec1ac]/30 pt-4 flex gap-2">
                  {visit.statut === 'planifiee' && (
                    <>
                      <form action={confirmAction} className="flex-1">
                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#322214] hover:bg-[#4a3728] text-white rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider transition-colors shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Confirmer</span>
                        </button>
                      </form>
                      <form action={cancelAction} className="flex-1">
                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-1.5 py-2 bg-white border border-red-250/30 hover:bg-red-50 text-red-700 rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Annuler</span>
                        </button>
                      </form>
                    </>
                  )}

                  {visit.statut === 'confirmee' && (
                    <>
                      <form action={completeAction} className="flex-1">
                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#2d6a4f] hover:bg-[#3d8c6a] text-white rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider transition-colors shadow-sm"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Terminer</span>
                        </button>
                      </form>
                      <form action={cancelAction} className="flex-1">
                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-1.5 py-2 bg-white border border-[#dec1ac]/65 hover:bg-stone-50 text-[#80756d] rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Annuler</span>
                        </button>
                      </form>
                    </>
                  )}

                  {visit.statut === 'effectuee' && (
                    <span className="text-[10px] text-[#2d6a4f] font-sans font-bold uppercase tracking-wider flex items-center gap-1 py-1 px-3 bg-[#e9f0ec] rounded-lg border border-[#d2e4db] mx-auto select-none">
                      <CheckCheck className="w-3.5 h-3.5" />
                      Visite effectuée
                    </span>
                  )}

                  {visit.statut === 'annulee' && (
                    <span className="text-[10px] text-[#9b2335] font-sans font-bold uppercase tracking-wider flex items-center gap-1 py-1 px-3 bg-[#f5e9eb] rounded-lg border border-[#f0d2d6] mx-auto select-none">
                      <X className="w-3.5 h-3.5" />
                      Visite annulée
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-[#80756d] font-sans">
            Affichage de{' '}
            <span className="font-semibold text-[#322214]">
              {start + 1}
            </span>{' '}
            à{' '}
            <span className="font-semibold text-[#322214]">
              {Math.min(start + PAGE_SIZE, totalCount)}
            </span>{' '}
            sur{' '}
            <span className="font-semibold text-[#322214]">{totalCount}</span>{' '}
            demandes
          </p>

          <div className="flex items-center gap-1">
            {/* Previous link */}
            {page > 1 ? (
              <Link
                href={`/admin/visites?page=${page - 1}&status=${status}${search ? `&search=${search}` : ''}`}
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
                  href={`/admin/visites?page=${targetPage}&status=${status}${search ? `&search=${search}` : ''}`}
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
                href={`/admin/visites?page=${page + 1}&status=${status}${search ? `&search=${search}` : ''}`}
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
      )}
    </div>
  );
}
