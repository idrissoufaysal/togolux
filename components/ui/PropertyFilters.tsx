"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Undo2 } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

interface PropertyFiltersProps {
  initialParams: {
    q?: string;
    type?: string;
    category?: string;
    ville?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export function PropertyFilters({ initialParams }: PropertyFiltersProps) {
  const router = useRouter();
  const [q, setQ] = React.useState(initialParams.q || '');
  const [type, setType] = React.useState(initialParams.type || 'all');
  const [category, setCategory] = React.useState(initialParams.category || 'all');
  const [ville, setVille] = React.useState(initialParams.ville || 'all');
  const [minPrice, setMinPrice] = React.useState(initialParams.minPrice || '');
  const [maxPrice, setMaxPrice] = React.useState(initialParams.maxPrice || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.append('q', q.trim());
    if (type !== 'all') params.append('type', type);
    if (category !== 'all') params.append('category', category);
    if (ville !== 'all') params.append('ville', ville);
    if (minPrice.trim()) params.append('minPrice', minPrice.trim());
    if (maxPrice.trim()) params.append('maxPrice', maxPrice.trim());

    router.push(`/biens?${params.toString()}`);
  };

  const handleReset = () => {
    setQ('');
    setType('all');
    setCategory('all');
    setVille('all');
    setMinPrice('');
    setMaxPrice('');
    router.push('/biens');
  };

  const hasActiveFilters = !!(
    initialParams.q || 
    (initialParams.type && initialParams.type !== 'all') || 
    (initialParams.category && initialParams.category !== 'all') || 
    (initialParams.ville && initialParams.ville !== 'all') || 
    initialParams.minPrice || 
    initialParams.maxPrice
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-stone-200/60 rounded-xl p-5 shadow-sm space-y-5 flex flex-col w-full"
    >
      <div className="space-y-4">
        <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-stone-500 border-b border-stone-100 pb-2">
          Filtres de recherche
        </h3>

        {/* Keyword Search */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 block">
            Rechercher par mot-clé
          </label>
          <div className="flex items-center bg-stone-50 border border-stone-200 rounded-lg px-3 py-1 h-[38px]">
            <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
            <Input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ex: Villa, Avedji..."
              className="border-0 bg-transparent p-0 h-full focus-visible:ring-0 focus-visible:ring-offset-0 text-stone-850 font-sans font-semibold text-xs placeholder-stone-400 shadow-none w-full"
            />
          </div>
        </div>

        {/* Transaction Type Select */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 block">
            Type de transaction
          </label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="bg-stone-50 border border-stone-200 h-[38px] px-3 rounded-lg text-stone-850 font-serif font-semibold text-sm shadow-none w-full [&>svg]:opacity-45 [&>svg]:w-4 [&>svg]:h-4">
              <SelectValue placeholder="Tout type" />
            </SelectTrigger>
            <SelectContent className="border border-stone-200/80 bg-white">
              <SelectItem value="all">Toutes les opérations</SelectItem>
              <SelectItem value="vente">Présenté à la Vente</SelectItem>
              <SelectItem value="location">Location Longue Durée</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Select */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 block">
            Catégorie de bien
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-stone-50 border border-stone-200 h-[38px] px-3 rounded-lg text-stone-850 font-serif font-semibold text-sm shadow-none w-full [&>svg]:opacity-45 [&>svg]:w-4 [&>svg]:h-4">
              <SelectValue placeholder="Toutes catégories" />
            </SelectTrigger>
            <SelectContent className="border border-stone-200/80 bg-white">
              <SelectItem value="all">Toutes catégories</SelectItem>
              <SelectItem value="maison">Maison / Villa</SelectItem>
              <SelectItem value="appartement">Appartement</SelectItem>
              <SelectItem value="terrain">Terrain</SelectItem>
              <SelectItem value="bureau">Bureau</SelectItem>
              <SelectItem value="commerce">Commerce</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ville Select */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 block">
            Localisation (Ville)
          </label>
          <Select value={ville} onValueChange={setVille}>
            <SelectTrigger className="bg-stone-50 border border-stone-200 h-[38px] px-3 rounded-lg text-stone-850 font-serif font-semibold text-sm shadow-none w-full [&>svg]:opacity-45 [&>svg]:w-4 [&>svg]:h-4">
              <SelectValue placeholder="Toutes les villes" />
            </SelectTrigger>
            <SelectContent className="border border-stone-200/80 bg-white">
              <SelectItem value="all">Toutes les villes</SelectItem>
              <SelectItem value="Lomé">Lomé</SelectItem>
              <SelectItem value="Agoè">Agoè</SelectItem>
              <SelectItem value="Kpalimé">Kpalimé</SelectItem>
              <SelectItem value="Kara">Kara</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Ranges */}
        <div className="space-y-3 pt-3 border-t border-stone-100">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 block">
            Tranche de Budget (FCFA)
          </span>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min"
              className="bg-stone-50 border border-stone-200 h-[38px] rounded-lg text-stone-850 font-sans font-semibold text-xs shadow-none w-full focus-visible:ring-[#755a30]"
            />
            <span className="text-stone-300 text-xs font-sans">à</span>
            <Input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max"
              className="bg-stone-50 border border-stone-200 h-[38px] rounded-lg text-stone-850 font-sans font-semibold text-xs shadow-none w-full focus-visible:ring-[#755a30]"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 pt-4 border-t border-stone-100 mt-2">
        <Button
          type="submit"
          className="w-full bg-[#755a30] hover:bg-[#5f4826] text-white font-sans font-bold uppercase tracking-widest text-xs h-[38px] rounded-md transition-all active:scale-[0.98] shadow-sm"
        >
          Appliquer les filtres
        </Button>

        {hasActiveFilters && (
          <Button
            type="button"
            onClick={handleReset}
            variant="outline"
            className="w-full border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-md h-[38px] transition-colors flex items-center justify-center gap-1.5"
          >
            <Undo2 className="w-4 h-4" />
            <span className="text-xs font-bold font-sans uppercase tracking-wider">Réinitialiser</span>
          </Button>
        )}
      </div>
    </form>
  );
}
