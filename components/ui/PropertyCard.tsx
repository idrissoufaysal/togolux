import * as React from 'react';
import Link from 'next/link';
import { Property } from '@/types';
import { StatusBadge } from './StatusBadge';
import { MapPin, BedDouble, Bath, Car, Ruler, ArrowRight } from 'lucide-react';
import { cn } from './utils';

interface PropertyCardProps {
  property: Property;
  className?: string;
  onSelect?: (property: Property) => void;
  href?: string;
}

export function PropertyCard({ property, className, onSelect, href }: PropertyCardProps) {
  const coverImage = property.images[0]?.url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80';

  const categoryLabels: Record<string, string> = {
    maison: 'Maison',
    appartement: 'Appartement',
    terrain: 'Terrain',
    bureau: 'Bureau',
    commerce: 'Commerce',
  };

  const formatFCFA = (amount: number) => {
    return new Intl.NumberFormat('fr-TG', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('XOF', 'FCFA');
  };

  const beds = property.chambres || 0;
  const baths = property.chambres ? Math.max(1, property.chambres - 1) : 1;
  const parkings = property.pieces > 4 ? 2 : 1;

  const content = (
    <>
      {/* Visual Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={property.titre}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
          referrerPolicy="no-referrer"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
          {property.en_vedette ? (
            <span className="px-2 py-0.5 rounded-sm text-[8px] font-sans font-bold uppercase tracking-widest bg-[#755a30] text-white shadow-sm">
              EN VEDETTE
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-sm text-[8px] font-sans font-bold uppercase tracking-widest bg-stone-900 text-white shadow-sm">
              {categoryLabels[property.categorie] || property.categorie}
            </span>
          )}

          <StatusBadge 
            status={property.statut} 
            className="shadow-sm border-none rounded-sm text-[8px] font-sans font-bold uppercase px-2 py-0.5 tracking-wider" 
          />
        </div>
      </div>

      {/* Details Area */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Price Above Title */}
          <div className="text-[#755a30] font-sans font-bold text-base tracking-wide mb-1">
            {formatFCFA(property.prix)}
            {property.type === 'location' && (
              <span className="text-xs text-stone-450 font-sans font-normal"> / mois</span>
            )}
          </div>

          {/* Title in Serif */}
          <h3 className="font-serif font-bold text-lg text-stone-900 mb-1 group-hover:text-[#755a30] transition-colors duration-300 line-clamp-1">
            {property.titre}
          </h3>

          {/* Location */}
          <div className="flex items-center text-xs text-stone-400 font-sans font-light mb-4">
            <MapPin className="w-3.5 h-3.5 text-stone-300 mr-1 shrink-0" />
            <span className="truncate">{property.ville}, {property.adresse || 'Lomé'}</span>
          </div>

          {/* Specs Row */}
          <div className="grid grid-cols-4 gap-1 py-3 border-t border-stone-100 mb-4 text-stone-500 font-sans text-center">
            <div className="flex flex-col items-center justify-center border-r border-stone-100 last:border-0">
              <Ruler className="w-3.5 h-3.5 text-stone-400 shrink-0 mb-0.5" />
              <span className="text-[9px] font-medium text-stone-500 uppercase">{property.surface} m²</span>
            </div>
            <div className="flex flex-col items-center justify-center border-r border-stone-100 last:border-0">
              <BedDouble className="w-3.5 h-3.5 text-stone-400 shrink-0 mb-0.5" />
              <span className="text-[9px] font-medium text-stone-500 uppercase">{beds} Beds</span>
            </div>
            <div className="flex flex-col items-center justify-center border-r border-stone-100 last:border-0">
              <Bath className="w-3.5 h-3.5 text-stone-400 shrink-0 mb-0.5" />
              <span className="text-[9px] font-medium text-stone-500 uppercase">{baths} Baths</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Car className="w-3.5 h-3.5 text-stone-400 shrink-0 mb-0.5" />
              <span className="text-[9px] font-medium text-stone-500 uppercase">{parkings} Park</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div className="flex items-center gap-2">
            {property.agent?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={property.agent.avatar_url}
                alt={property.agent.nom}
                className="w-6 h-6 rounded-full object-cover border border-stone-100"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center font-bold text-[10px] uppercase">
                {property.agent?.nom?.[0] || 'A'}
              </div>
            )}
            <span className="text-[11px] font-medium text-stone-600">
              {property.agent?.nom || 'Agent TogoLux'}
            </span>
          </div>

          <div className="text-stone-400 text-[11px] font-sans font-medium group-hover:text-[#755a30] transition-colors flex items-center gap-1">
            <span>Voir le bien</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </>
  );

  const wrapperClass = cn(
    'group flex flex-col bg-white dark:bg-stone-900 rounded-xl overflow-hidden border border-stone-200/80 dark:border-stone-800/80 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer',
    className
  );

  if (href) {
    return (
      <Link href={href} className={wrapperClass}>
        {content}
      </Link>
    );
  }

  return (
    <div onClick={() => onSelect && onSelect(property)} className={wrapperClass}>
      {content}
    </div>
  );
}
