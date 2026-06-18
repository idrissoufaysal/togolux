import * as React from 'react';
import Link from 'next/link';
import { insforge } from '@/lib/insforge';
import {
  Search,
  Mail,
  ChevronLeft,
  ChevronRight,
  Check,
  Archive,
  Clock,
  Phone,
  MessageSquare,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { updateContactStatus } from '../actions';

export const revalidate = 0; // Fresh contacts data

interface SearchParams {
  page?: string;
  status?: string;
  search?: string;
}

export default async function ContactsAdminPage({
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
    .from('contacts')
    .select('statut');

  const allCount = countData?.length || 0;
  const nouveauCount = countData?.filter((c: any) => c.statut === 'nouveau').length || 0;
  const enCoursCount = countData?.filter((c: any) => c.statut === 'en_cours').length || 0;
  const traiteCount = countData?.filter((c: any) => c.statut === 'traite').length || 0;
  const archiveCount = countData?.filter((c: any) => c.statut === 'archive').length || 0;

  // 2. Query contacts
  let query = insforge.database
    .from('contacts')
    .select('*', { count: 'exact' });

  if (status !== 'all') {
    query = query.eq('statut', status);
  }

  if (search) {
    query = query.or(`nom.ilike.%${search}%,email.ilike.%${search}%,sujet.ilike.%${search}%,message.ilike.%${search}%`);
  }

  const PAGE_SIZE = 6;
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  // Order by creation date (newest first)
  query = query.range(start, end).order('cree_a', { ascending: false });

  const { data: contactsData, count: totalFilteredCount } = await query;
  const contacts = (contactsData || []) as any[];
  const totalCount = totalFilteredCount || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const tabs = [
    { id: 'all', label: 'Tous', count: allCount },
    { id: 'nouveau', label: 'Nouveaux', count: nouveauCount },
    { id: 'en_cours', label: 'En cours', count: enCoursCount },
    { id: 'traite', label: 'Traités', count: traiteCount },
    { id: 'archive', label: 'Archivés', count: archiveCount },
  ];

  return (
    <div className="space-y-8">
      {/* Header Row */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-sans text-[#322214] font-bold tracking-tight">
            Contacts & Leads
          </h1>
          <p className="text-xs text-[#80756d] font-sans">
            {allCount} messages de contact au total
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search form */}
          <form method="GET" action="/admin/contacts" className="relative flex-1 sm:flex-initial">
            <input type="hidden" name="status" value={status} />
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#80756d]" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Rechercher dans les messages..."
              className="pl-10 pr-4 py-2 bg-white border border-[#dec1ac]/65 rounded-xl text-xs focus:outline-none focus:border-[#c5a373] w-full sm:w-64 text-[#221a14] shadow-sm transition-all"
            />
          </form>
        </div>
      </div>

      {/* Tabs list */}
      <div className="border-b border-[#dec1ac]/60 flex gap-6 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = status === tab.id;
          const linkHref = `/admin/contacts?status=${tab.id}${search ? `&search=${search}` : ''}`;
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

      {/* Contact Cards Grid */}
      {contacts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#dec1ac]/65 p-12 text-center space-y-3 shadow-sm">
          <Mail className="w-8 h-8 text-[#80756d]/40 mx-auto" />
          <p className="text-sm font-sans text-[#80756d]">
            Aucun message ne correspond aux critères de recherche actuels.
          </p>
          <Link
            href="/admin/contacts"
            className="inline-block text-xs font-sans text-[#c5a373] hover:underline"
          >
            Réinitialiser les filtres
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contacts.map((contact) => {
            const progressAction = updateContactStatus.bind(null, contact.id, 'en_cours');
            const treatAction = updateContactStatus.bind(null, contact.id, 'traite');
            const archiveAction = updateContactStatus.bind(null, contact.id, 'archive');

            return (
              <div
                key={contact.id}
                className="bg-white rounded-2xl border border-[#dec1ac]/65 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all duration-300 gap-6"
              >
                {/* Message Header & Body */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-[#80756d] font-sans flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#c5a373] shrink-0" />
                        {new Date(contact.cree_a).toLocaleString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <h3 className="font-sans font-bold text-sm text-[#322214] leading-tight">
                        {contact.nom}
                      </h3>
                    </div>
                    <StatusBadge status={contact.statut} className="scale-90" />
                  </div>

                  {/* Subject */}
                  <div className="text-xs font-sans font-semibold text-[#322214] border-l-2 border-[#c5a373] pl-2.5">
                    Sujet : {contact.sujet}
                  </div>

                  {/* Message Content */}
                  <div className="text-xs text-[#80756d] bg-stone-50 border border-stone-100 rounded-xl p-4 font-sans leading-relaxed flex gap-2.5">
                    <MessageSquare className="w-4 h-4 text-[#80756d]/55 shrink-0 mt-0.5" />
                    <p className="whitespace-pre-line">« {contact.message} »</p>
                  </div>

                  {/* Contact Methods */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#221a14] font-sans pt-2 border-t border-[#dec1ac]/20">
                    <div className="flex items-center gap-2 text-[#80756d]">
                      <Phone className="w-3.5 h-3.5 shrink-0 text-[#c5a373]" />
                      <span className="select-all">{contact.telephone || 'Non renseigné'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#80756d]">
                      <Mail className="w-3.5 h-3.5 shrink-0 text-[#c5a373]" />
                      <a href={`mailto:${contact.email}`} className="select-all truncate hover:underline hover:text-[#c5a373]">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Actions row */}
                <div className="border-t border-[#dec1ac]/30 pt-4 flex gap-2 justify-end">
                  {contact.statut === 'nouveau' && (
                    <>
                      <form action={progressAction}>
                        <button
                          type="submit"
                          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-[#dec1ac]/65 hover:bg-[#fff1e9]/20 text-[#80756d] hover:text-[#322214] rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider transition-all"
                        >
                          <Clock className="w-3.5 h-3.5 text-[#c5a373]" />
                          <span>Prendre en cours</span>
                        </button>
                      </form>
                      <form action={treatAction}>
                        <button
                          type="submit"
                          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#322214] hover:bg-[#4a3728] text-white rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider transition-colors shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Marquer Traité</span>
                        </button>
                      </form>
                    </>
                  )}

                  {contact.statut === 'en_cours' && (
                    <>
                      <form action={treatAction}>
                        <button
                          type="submit"
                          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#322214] hover:bg-[#4a3728] text-white rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider transition-colors shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Marquer Traité</span>
                        </button>
                      </form>
                      <form action={archiveAction}>
                        <button
                          type="submit"
                          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-[#dec1ac]/65 hover:bg-stone-50 text-[#80756d] rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider transition-all"
                        >
                          <Archive className="w-3.5 h-3.5" />
                          <span>Archiver</span>
                        </button>
                      </form>
                    </>
                  )}

                  {contact.statut === 'traite' && (
                    <form action={archiveAction}>
                      <button
                        type="submit"
                        className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-[#dec1ac]/65 hover:bg-stone-50 text-[#80756d] rounded-xl text-[10px] font-sans font-bold uppercase tracking-wider transition-all"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>Archiver le message</span>
                      </button>
                    </form>
                  )}

                  {contact.statut === 'archive' && (
                    <span className="text-[10px] text-[#80756d] font-sans font-bold uppercase tracking-wider flex items-center gap-1 py-1.5 px-3 bg-stone-100 rounded-lg border border-stone-200 select-none">
                      <Archive className="w-3.5 h-3.5" />
                      Message archivé
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
            messages
          </p>

          <div className="flex items-center gap-1">
            {/* Previous link */}
            {page > 1 ? (
              <Link
                href={`/admin/contacts?page=${page - 1}&status=${status}${search ? `&search=${search}` : ''}`}
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
                  href={`/admin/contacts?page=${targetPage}&status=${status}${search ? `&search=${search}` : ''}`}
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
                href={`/admin/contacts?page=${page + 1}&status=${status}${search ? `&search=${search}` : ''}`}
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
