'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Property admin page error:', error);
  }, [error]);

  return (
    <div className="bg-white rounded-2xl border border-red-200/50 p-12 text-center space-y-6 max-w-xl mx-auto shadow-sm my-8 font-sans">
      <div className="p-3 bg-red-50 text-[#9B2335] rounded-full w-fit mx-auto border border-red-100">
        <AlertTriangle className="w-8 h-8" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-[#322214]">
          Une erreur s'est produite
        </h2>
        <p className="text-xs text-[#80756d] leading-relaxed">
          Nous n'avons pas pu charger les données des biens immobiliers depuis la base de données. Veuillez réessayer ou contacter le support si le problème persiste.
        </p>
      </div>

      <button
        onClick={() => reset()}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#322214] hover:bg-[#4a3728] text-white rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-98"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Réessayer le chargement</span>
      </button>
    </div>
  );
}
