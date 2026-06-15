import * as React from 'react';
import { insforge } from '@/lib/insforge';
import {
  Building2,
  CalendarDays,
  Mail,
  TrendingUp,
  Clock,
  CheckCircle,
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
    const pendingVisits = (visitRes.data || []).filter((v: any) => v.statut === 'planifiee').length;
    const newContacts = (contactRes.data || []).filter((c: any) => c.statut === 'nouveau').length;

    return {
      totalProperties,
      totalVisits,
      totalContacts,
      availableProps,
      pendingVisits,
      newContacts,
    };
  } catch (e) {
    console.error('Error fetching admin stats:', e);
    return {
      totalProperties: 0,
      totalVisits: 0,
      totalContacts: 0,
      availableProps: 0,
      pendingVisits: 0,
      newContacts: 0,
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

  const cards = [
    {
      title: 'Propriétés',
      value: stats.totalProperties,
      sub: `${stats.availableProps} disponibles`,
      icon: Building2,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    },
    {
      title: 'Demandes de Visites',
      value: stats.totalVisits,
      sub: `${stats.pendingVisits} planifiées`,
      icon: CalendarDays,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Messages / Leads',
      value: stats.totalContacts,
      sub: `${stats.newContacts} nouveaux`,
      icon: Mail,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-serif text-white">Tableau de bord</h1>
        <p className="text-xs sm:text-sm text-stone-400 font-sans max-w-xl">
          Bienvenue dans l'administration de TogoLux Properties. Voici le résumé de l'activité immobilière de votre agence à Lomé.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-stone-900 border border-stone-800 rounded-3xl p-6 flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block font-bold">
                {card.title}
              </span>
              <span className="text-3xl font-mono font-bold text-white block">
                {card.value}
              </span>
              <span className="text-xs text-stone-450 block font-medium">
                {card.sub}
              </span>
            </div>
            <div className={`p-4 rounded-2xl border ${card.color} shrink-0`}>
              <card.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Grid of lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Visits */}
        <div className="bg-stone-900 border border-stone-850 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Visites Récentes
            </h3>
          </div>

          {recentVisits.length === 0 ? (
            <p className="text-stone-550 text-xs py-4 text-center font-sans">Aucune visite enregistrée pour le moment.</p>
          ) : (
            <div className="divide-y divide-stone-800/80">
              {recentVisits.map((visit: any) => (
                <div key={visit.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="min-w-0 space-y-1">
                    <span className="text-xs font-bold text-white block truncate">
                      {visit.nom_client}
                    </span>
                    <span className="text-[11px] text-stone-400 block truncate">
                      Sur : <span className="text-sky-400">{visit.property?.titre || 'Bien inconnu'}</span>
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono block">
                      Prévu le : {new Date(visit.date_visite).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <StatusBadge status={visit.statut} className="shrink-0 scale-90" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Leads */}
        <div className="bg-stone-900 border border-stone-850 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Nouveaux Messages / Leads
            </h3>
          </div>

          {recentContacts.length === 0 ? (
            <p className="text-stone-550 text-xs py-4 text-center font-sans">Aucun message de contact reçu pour le moment.</p>
          ) : (
            <div className="divide-y divide-stone-800/80">
              {recentContacts.map((contact: any) => (
                <div key={contact.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="min-w-0 space-y-1">
                    <span className="text-xs font-bold text-white block truncate">
                      {contact.nom}
                    </span>
                    <span className="text-[11px] text-stone-400 block truncate">
                      Sujet : {contact.sujet}
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono block">
                      Reçu le : {new Date(contact.cree_a).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <StatusBadge status={contact.statut} className="shrink-0 scale-90" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
