import * as React from 'react';
import { cn } from './utils';

interface PriceTagProps {
  price: number;
  type?: 'vente' | 'location';
  showEuroEquivalent?: boolean;
  className?: string;
}

export function PriceTag({ price, type, showEuroEquivalent = true, className }: PriceTagProps) {
  const formatFCFA = (amount: number) => {
    return new Intl.NumberFormat('fr-TG', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace('XOF', 'FCFA');
  };

  const getEuroEquivalent = (amount: number) => {
    // 1 EUR = 655.957 XOF (Fixed PEG)
    const euros = Math.round(amount / 655.957);
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(euros);
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold font-sans tracking-tight text-[#755a30]">
          {formatFCFA(price)}
        </span>
        {type === 'location' && (
          <span className="text-xs text-stone-450 font-sans">/ mois</span>
        )}
      </div>
      {showEuroEquivalent && (
        <span className="text-xs text-stone-400 font-mono">
          soit environ {getEuroEquivalent(price)}
        </span>
      )}
    </div>
  );
}
