import * as React from 'react';
import Link from 'next/link';
import { MapPin, SlidersHorizontal, Eye, Edit3 } from 'lucide-react';
import { Property } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AgentAvatar } from '@/components/ui/AgentAvatar';
import { DeletePropertyDialog } from './DeletePropertyDialog';

interface PropertyTableProps {
  properties: Property[];
}

export function PropertyTable({ properties }: PropertyTableProps) {
  // Formatting helper for agent name (e.g. "Jean Dupont" -> "J. Dupont")
  const formatAgentName = (name?: string) => {
    if (!name) return 'Non assigné';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      const firstInitial = parts[0] ? `${parts[0][0]}.` : '';
      const lastName = parts.slice(1).join(' ');
      return `${firstInitial} ${lastName}`;
    }
    return name;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#dec1ac]/65 shadow-sm overflow-hidden">
      {properties.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <SlidersHorizontal className="w-8 h-8 text-[#80756d]/40 mx-auto" />
          <p className="text-sm font-sans text-[#80756d]">
            Aucun bien ne correspond aux critères de recherche actuels.
          </p>
          <Link
            href="/admin/property"
            className="inline-block text-xs font-sans text-[#c5a373] hover:underline"
          >
            Réinitialiser les filtres
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fff1e9]/20 border-b border-[#dec1ac]/50 text-[#80756d] uppercase text-[10px] tracking-widest font-bold font-sans">
                <th className="px-6 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-[#dec1ac] text-[#c5a373] focus:ring-[#c5a373] cursor-pointer"
                  />
                </th>
                <th className="px-4 py-4 w-24">Photo</th>
                <th className="px-4 py-4">Titre</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Prix</th>
                <th className="px-4 py-4">Statut</th>
                <th className="px-4 py-4">Agent</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dec1ac]/40">
              {properties.map((property) => {
                const imageUrl =
                  property.images && property.images.length > 0
                    ? property.images[0].url
                    : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=200&q=80';

                return (
                  <tr
                    key={property.id}
                    className="hover:bg-[#fff8f5]/55 transition-colors text-xs text-[#221a14] group"
                  >
                    <td className="px-6 py-4 text-center">
                      <input
                        type="checkbox"
                        className="rounded border-[#dec1ac] text-[#c5a373] focus:ring-[#c5a373] cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={property.titre}
                        className="w-16 h-12 object-cover rounded-lg border border-[#dec1ac]/30"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-0.5">
                        <span className="font-sans font-bold text-[#322214] block leading-tight hover:text-[#c5a373] transition-colors cursor-pointer">
                          {property.titre}
                        </span>
                        <span className="text-[11px] text-[#80756d] font-sans flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0 text-[#c5a373]" />
                          {property.adresse ? `${property.adresse}, ` : ''}{property.ville}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          property.type === 'vente'
                            ? 'bg-stone-100 text-stone-700 border border-stone-200'
                            : 'bg-[#fff1e9] text-[#c5a373] border border-[#ffe8cc]'
                        }`}
                      >
                        {property.type === 'vente' ? 'Vente' : 'Location'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-0.5">
                        <span className="font-sans font-bold text-[#322214] block">
                          {property.prix.toLocaleString('fr-FR')} FCFA
                        </span>
                        {property.type === 'location' && (
                          <span className="text-[10px] text-[#80756d]/80 block font-sans">
                            / mois
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={property.statut} className="scale-90" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <AgentAvatar
                          nom={property.agent?.nom || 'Non assigné'}
                          avatarUrl={property.agent?.avatar_url}
                          size="sm"
                        />
                        <span className="text-xs text-[#322214] font-medium truncate max-w-[90px]">
                          {formatAgentName(property.agent?.nom)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#80756d] font-mono text-[11px]">
                      {new Date(property.cree_a).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/biens/${property.slug}`}
                          target="_blank"
                          className="p-2 text-[#80756d] hover:text-[#c5a373] hover:bg-[#fff1e9]/30 rounded-xl transition-all cursor-pointer"
                          title="Voir le bien en ligne"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/property/modifier/${property.id}`}
                          className="p-2 text-[#80756d] hover:text-[#322214] hover:bg-[#fff1e9]/30 rounded-xl transition-all cursor-pointer"
                          title="Modifier le bien"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <DeletePropertyDialog
                          propertyId={property.id}
                          title={property.titre}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
