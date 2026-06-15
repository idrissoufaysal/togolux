import * as React from 'react';
import { cn } from './utils';
import { PropertyStatus, VisitStatus, ContactStatus } from '@/types';

interface StatusBadgeProps {
  status: PropertyStatus | VisitStatus | ContactStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let label = status as string;
  let colorClass = 'bg-stone-100 text-stone-800 border-stone-200';

  // Format and color based on value
  switch (status) {
    // PropertyStatus
    case 'disponible':
      label = 'Disponible';
      colorClass = 'bg-[#E9F0EC] text-[#2D6A4F] border-[#d2e4db]';
      break;
    case 'sous_compromis':
      label = 'Sous compromis';
      colorClass = 'bg-[#FFF4E5] text-[#B45D00] border-[#ffe8cc]';
      break;
    case 'vendu':
      label = 'Vendu';
      colorClass = 'bg-[#F5E9EB] text-[#9B2335] border-[#f0d2d6]';
      break;
    case 'loue':
      label = 'Loué';
      colorClass = 'bg-[#E8E6E1] text-[#322214] border-[#d4d1cc]';
      break;

    // VisitStatus
    case 'planifiee':
      label = 'Planifiée';
      colorClass = 'bg-[#E8E6E1] text-[#322214] border-[#d4d1cc]';
      break;
    case 'confirmee':
      label = 'Confirmée';
      colorClass = 'bg-[#E9F0EC] text-[#2D6A4F] border-[#d2e4db]';
      break;
    case 'effectuee':
      label = 'Effectuée';
      colorClass = 'bg-stone-100 text-stone-600 border-stone-200';
      break;
    case 'annulee':
      label = 'Annulée';
      colorClass = 'bg-[#F5E9EB] text-[#9B2335] border-[#f0d2d6]';
      break;

    // ContactStatus
    case 'nouveau':
      label = 'Nouveau';
      colorClass = 'bg-[#E8E6E1] text-[#322214] border-[#d4d1cc]';
      break;
    case 'en_cours':
      label = 'En cours';
      colorClass = 'bg-[#FFF4E5] text-[#B45D00] border-[#ffe8cc]';
      break;
    case 'traite':
      label = 'Traité';
      colorClass = 'bg-[#E9F0EC] text-[#2D6A4F] border-[#d2e4db]';
      break;
    case 'archive':
      label = 'Archivé';
      colorClass = 'bg-stone-100 text-stone-500 border-stone-200';
      break;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        colorClass,
        className
      )}
    >
      {label}
    </span>
  );
}
