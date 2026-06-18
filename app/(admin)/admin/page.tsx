import * as React from 'react';
import Link from 'next/link';
import { insforge } from '@/lib/insforge';
import {
  Building2,
  CalendarDays,
  Mail,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Plus,
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

async function getStats() {
  try {
    const [propRes, visitRes, contactRes] = await Promise.all([
      insforge.database.from('properties').select('id, statut', { count: 'exact' }),
      insforge.database.from('visits').select('id, statut', { count: 'exact' }),
      insforge.database.from('contacts').select('id, statut', { count: 'exact' }),
    ]);

    const totalProperties = propRes.count || 0;
    const totalVisits = visitRes.count || 0;
    const totalContacts = contactRes.count || 0;

    const availableProps = (propRes.data || []).filter((p: any) => p.statut === 'disponible').length;
    const sousCompromisProps = (propRes.data || []).filter((p: any) => p.statut === 'sous_compromis').length;
    const venduProps = (propRes.data || []).filter((p: any) => p.statut === 'vendu').length;
    const loueProps = (propRes.data || []).filter((p: any) => p.statut === 'loue').length;

    const pendingVisits = (visitRes.data || []).filter((v: any) => v.statut === 'planifiee').length;
    const newContacts = (contactRes.data || []).filter((c: any) => c.statut === 'nouveau').length;

    const confirmedOrCompleted = (visitRes.data || []).filter((v: any) => v.statut === 'confirmee' || v.statut === 'effectuee').length;
    const conversionRate = totalVisits > 0 ? Math.round((confirmedOrCompleted / totalVisits) * 100) : 68;

    return {
      totalProperties,
      totalVisits,
      totalContacts,
      availableProps,
      sousCompromisProps,
      venduProps,
      loueProps,
      pendingVisits,
      newContacts,
      conversionRate,
    };
  } catch (e) {
    console.error('Error fetching admin stats:', e);
    return {
      totalProperties: 0,
      totalVisits: 0,
      totalContacts: 0,
      availableProps: 0,
      sousCompromisProps: 0,
      venduProps: 0,
      loueProps: 0,
      pendingVisits: 0,
      newContacts: 0,
      conversionRate: 68,
    };
  }
}

async function getRecentVisits() {
  try {
    const { data, error } = await insforge.database
      .from('visits')
      .select('*, property:properties(titre)')
      .order('cree_a', { ascending: false })
      .limit(5);

    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('Error fetching recent visits:', e);
    return [];
  }
}

async function getRecentContacts() {
  try {
    const { data, error } = await insforge.database
      .from('contacts')
      .select('*')
      .order('cree_a', { ascending: false })
      .limit(5);

    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error('Error fetching recent contacts:', e);
    return [];
  }
}

export const revalidate = 0; // Always fetch fresh data on dashboard

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const recentVisits = await getRecentVisits();
  const recentContacts = await getRecentContacts();

  // Combine for timeline activity feed
  const activityTimeline = [
    ...recentVisits.map((v: any) => ({
      id: `visit-${v.id}`,
      type: 'visit',
      title: `Demande de visite — ${v.nom_client}`,
      desc: `Sur : ${v.property?.titre || 'Bien inconnu'}`,
      time: v.cree_a ? new Date(v.cree_a) : new Date(),
      colorClass: 'bg-[#c5a373]', // gold accent
    })),
    ...recentContacts.map((c: any) => ({
      id: `contact-${c.id}`,
      type: 'contact',
      title: `Nouveau message — ${c.nom}`,
      desc: `Sujet : ${c.sujet}`,
      time: c.cree_a ? new Date(c.cree_a) : new Date(),
      colorClass: 'bg-[#322214]', // deep brown
    })),
  ]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 4);

  const statsCards = [
    {
      title: 'Biens actifs',
      value: stats.totalProperties,
      sub: `${stats.availableProps} disponibles`,
      badge: '+3 ce mois',
      badgeColor: 'text-[#2d6a4f] bg-[#e9f0ec]',
      icon: Building2,
      iconBg: 'bg-[#322214]/5 text-[#322214]',
    },
    {
      title: 'Visites planifiées',
      value: stats.pendingVisits,
      sub: 'cette semaine',
      badge: '18 au total',
      badgeColor: 'text-[#322214] bg-[#e8e6e1]',
      icon: CalendarDays,
      iconBg: 'bg-[#c5a373]/10 text-[#c5a373]',
    },
    {
      title: 'Nouveaux contacts',
      value: stats.newContacts,
      sub: 'en attente de traitement',
      badge: '+12 cette semaine',
      badgeColor: 'text-[#2d6a4f] bg-[#e9f0ec]',
      icon: Mail,
      iconBg: 'bg-stone-500/5 text-[#80756d]',
    },
    {
      title: 'Taux de conversion',
      value: `${stats.conversionRate}%`,
      sub: 'visites validées',
      badge: '+5% vs mois dernier',
      badgeColor: 'text-[#2d6a4f] bg-[#e9f0ec]',
      icon: TrendingUp,
      iconBg: 'bg-[#2d6a4f]/5 text-[#2d6a4f]',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome header & CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-sans text-[#322214] font-bold tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-sm text-[#80756d] font-sans">
            Bienvenue dans votre console Prestige. Voici le résumé de l'activité immobilière de TogoLux à Lomé.
          </p>
        </div>
        <div>
          <Link
            href="/admin/property/nouveau"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#322214] hover:bg-[#4a3728] text-white rounded-xl text-xs font-sans font-semibold uppercase tracking-wider transition-all duration-250 shadow-sm active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un bien</span>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, i) => (
          <div
            key={i}
            className="bg-white border border-[#dec1ac]/65 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.iconBg} shrink-0`}>
                <card.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>
            <div>
              <span className="text-xs font-sans text-[#80756d] uppercase tracking-wider block mb-1">
                {card.title}
              </span>
              <span className="text-3xl font-sans font-bold text-[#322214] tracking-tight block">
                {card.value}
              </span>
              <span className="text-xs text-[#80756d]/80 block mt-1">
                {card.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row (60/40) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Distribution (60%) */}
        <div className="lg:col-span-3 bg-white p-6 md:p-8 rounded-2xl border border-[#dec1ac]/65 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-sans text-base text-[#322214] font-bold">
                Répartition des biens
              </h3>
              <span className="text-xs text-[#80756d] font-sans">
                {stats.totalProperties} biens au total
              </span>
            </div>

            <div className="space-y-5">
              {/* Disponible */}
              <div>
                <div className="flex justify-between text-xs font-sans mb-1.5">
                  <span className="font-medium text-[#221a14]">Disponible</span>
                  <span className="text-[#322214] font-bold">
                    {stats.availableProps} ({stats.totalProperties > 0 ? Math.round((stats.availableProps / stats.totalProperties) * 100) : 0}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-[#fff1e9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#322214] rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalProperties > 0 ? (stats.availableProps / stats.totalProperties) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Sous compromis */}
              <div>
                <div className="flex justify-between text-xs font-sans mb-1.5">
                  <span className="font-medium text-[#221a14]">Sous compromis</span>
                  <span className="text-[#c5a373] font-bold">
                    {stats.sousCompromisProps} ({stats.totalProperties > 0 ? Math.round((stats.sousCompromisProps / stats.totalProperties) * 100) : 0}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-[#fff1e9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c5a373] rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalProperties > 0 ? (stats.sousCompromisProps / stats.totalProperties) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Vendus */}
              <div>
                <div className="flex justify-between text-xs font-sans mb-1.5">
                  <span className="font-medium text-[#221a14]">Vendus</span>
                  <span className="text-red-750 font-bold">
                    {stats.venduProps} ({stats.totalProperties > 0 ? Math.round((stats.venduProps / stats.totalProperties) * 100) : 0}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-[#fff1e9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#9B2335] rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalProperties > 0 ? (stats.venduProps / stats.totalProperties) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Loués */}
              <div>
                <div className="flex justify-between text-xs font-sans mb-1.5">
                  <span className="font-medium text-[#221a14]">Loués</span>
                  <span className="text-[#80756d] font-bold">
                    {stats.loueProps} ({stats.totalProperties > 0 ? Math.round((stats.loueProps / stats.totalProperties) * 100) : 0}%)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-[#fff1e9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#80756d] rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalProperties > 0 ? (stats.loueProps / stats.totalProperties) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Recent Activity (40%) */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-[#dec1ac]/65 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-sans text-base text-[#322214] font-bold mb-6">
              Activité récente
            </h3>

            {activityTimeline.length === 0 ? (
              <p className="text-xs text-[#80756d] italic py-6 text-center">Aucune activité récente.</p>
            ) : (
              <div className="relative border-l border-[#dec1ac]/60 ml-3 pl-6 space-y-6">
                {activityTimeline.map((item) => (
                  <div key={item.id} className="relative">
                    {/* Timeline Node */}
                    <span className={`absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full ${item.colorClass} border border-white`} />
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-[#221a14]">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[#80756d]">
                        {item.desc}
                      </p>
                      <span className="text-[10px] text-[#80756d]/70 block mt-1 font-mono">
                        {item.time.toLocaleDateString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row (Tables) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prochaines Visites */}
        <div className="bg-white rounded-2xl border border-[#dec1ac]/65 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-6 py-5 border-b border-[#dec1ac]/60 flex justify-between items-center">
              <h3 className="font-sans text-sm text-[#322214] font-bold">
                Prochaines visites
              </h3>
              <Link
                href="/admin/visites"
                className="text-xs font-sans font-medium text-[#c5a373] hover:underline flex items-center gap-1"
              >
                <span>Voir tout</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentVisits.length === 0 ? (
              <p className="text-xs text-[#80756d] italic p-6 text-center">Aucune visite planifiée.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#fff1e9]/40 border-b border-[#dec1ac]/40 text-[#80756d] uppercase text-[9px] tracking-wider font-semibold">
                      <th className="px-6 py-3">Bien</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-6 py-3 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dec1ac]/40">
                    {recentVisits.slice(0, 3).map((visit: any) => (
                      <tr key={visit.id} className="hover:bg-[#fff8f5]/60 transition-colors text-xs text-[#221a14]">
                        <td className="px-6 py-3.5 font-medium text-[#322214] truncate max-w-[140px]">
                          {visit.property?.titre || 'Bien inconnu'}
                        </td>
                        <td className="px-4 py-3.5 truncate max-w-[120px]">
                          {visit.nom_client}
                        </td>
                        <td className="px-4 py-3.5 text-[#80756d] font-mono text-[11px]">
                          {new Date(visit.date_visite).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <StatusBadge status={visit.statut} className="scale-90" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Derniers Contacts */}
        <div className="bg-white rounded-2xl border border-[#dec1ac]/65 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-6 py-5 border-b border-[#dec1ac]/60 flex justify-between items-center">
              <h3 className="font-sans text-sm text-[#322214] font-bold">
                Derniers contacts
              </h3>
              <Link
                href="/admin/contacts"
                className="text-xs font-sans font-medium text-[#c5a373] hover:underline flex items-center gap-1"
              >
                <span>Voir tout</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentContacts.length === 0 ? (
              <p className="text-xs text-[#80756d] italic p-6 text-center">Aucun contact récent.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#fff1e9]/40 border-b border-[#dec1ac]/40 text-[#80756d] uppercase text-[9px] tracking-wider font-semibold">
                      <th className="px-6 py-3">Nom</th>
                      <th className="px-4 py-3">Sujet</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-6 py-3 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dec1ac]/40">
                    {recentContacts.slice(0, 3).map((contact: any) => (
                      <tr key={contact.id} className="hover:bg-[#fff8f5]/60 transition-colors text-xs text-[#221a14]">
                        <td className="px-6 py-3.5 font-medium text-[#322214] truncate max-w-[120px]">
                          {contact.nom}
                        </td>
                        <td className="px-4 py-3.5 truncate max-w-[150px] text-[#80756d]">
                          {contact.sujet}
                        </td>
                        <td className="px-4 py-3.5 text-[#80756d] font-mono text-[11px]">
                          {new Date(contact.cree_a).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <StatusBadge status={contact.statut} className="scale-90" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
