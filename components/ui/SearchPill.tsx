"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from './button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

export function SearchPill() {
  const router = useRouter();
  const [type, setType] = React.useState('all');
  const [category, setCategory] = React.useState('all');
  const [ville, setVille] = React.useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (type !== 'all') params.append('type', type);
    if (category !== 'all') params.append('category', category);
    if (ville !== 'all') params.append('ville', ville);

    router.push(`/biens?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-2 rounded-xl shadow-xl flex flex-col md:flex-row items-stretch md:items-center gap-2 max-w-4xl mx-auto mt-12 border border-stone-200/50 dark:border-stone-800/80 w-full animate-fade-in-up"
    >
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-200/80 dark:divide-stone-700/80 w-full px-4 gap-2 md:gap-0">
        
        {/* Transaction Type Select */}
        <div className="flex flex-col text-left py-2 md:py-1 md:px-4 justify-center">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 mb-1">Type</span>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="border-0 bg-transparent p-0 h-auto focus:ring-0 focus:ring-offset-0 text-stone-850 dark:text-white font-serif font-semibold text-sm sm:text-base shadow-none [&>svg]:opacity-45 [&>svg]:w-4 [&>svg]:h-4">
              <SelectValue placeholder="Tout type" />
            </SelectTrigger>
            <SelectContent className="border border-stone-250/80 dark:border-stone-800 bg-white dark:bg-stone-900">
              <SelectItem value="all">Tout type</SelectItem>
              <SelectItem value="vente">À Vendre</SelectItem>
              <SelectItem value="location">À Louer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Select */}
        <div className="flex flex-col text-left py-2 md:py-1 md:px-6 justify-center">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 mb-1">Catégorie</span>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="border-0 bg-transparent p-0 h-auto focus:ring-0 focus:ring-offset-0 text-stone-850 dark:text-white font-serif font-semibold text-sm sm:text-base shadow-none [&>svg]:opacity-45 [&>svg]:w-4 [&>svg]:h-4">
              <SelectValue placeholder="Toutes catégories" />
            </SelectTrigger>
            <SelectContent className="border border-stone-250/80 dark:border-stone-800 bg-white dark:bg-stone-900">
              <SelectItem value="all">Toutes catégories</SelectItem>
              <SelectItem value="maison">Maison / Villa</SelectItem>
              <SelectItem value="appartement">Appartement</SelectItem>
              <SelectItem value="terrain">Terrain</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Ville Select */}
        <div className="flex flex-col text-left py-2 md:py-1 md:px-6 justify-center">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-stone-400 mb-1">Ville</span>
          <Select value={ville} onValueChange={setVille}>
            <SelectTrigger className="border-0 bg-transparent p-0 h-auto focus:ring-0 focus:ring-offset-0 text-stone-850 dark:text-white font-serif font-semibold text-sm sm:text-base shadow-none [&>svg]:opacity-45 [&>svg]:w-4 [&>svg]:h-4">
              <SelectValue placeholder="Toutes les villes" />
            </SelectTrigger>
            <SelectContent className="border border-stone-250/80 dark:border-stone-800 bg-white dark:bg-stone-900">
              <SelectItem value="all">Toutes les villes</SelectItem>
              <SelectItem value="Lomé">Lomé</SelectItem>
              <SelectItem value="Agoè">Agoè</SelectItem>
              <SelectItem value="Kpalimé">Kpalimé</SelectItem>
              <SelectItem value="Kara">Kara</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full md:w-auto bg-[#755a30] hover:bg-[#5f4826] text-white rounded-md px-8 py-6 font-sans font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] shrink-0"
      >
        <Search className="w-4 h-4" />
        RECHERCHER
      </Button>
    </form>
  );
}

