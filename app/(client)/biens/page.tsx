import * as React from 'react';
import { PropertyCard, PropertyFilters } from '@/components/ui';
import { insforge } from '@/lib/insforge';
import { Property, PropertyType, PropertyCategory } from '@/types';
import { MapPin } from 'lucide-react';

interface SearchParams {
  q?: string;
  type?: string;
  category?: string;
  ville?: string;
  minPrice?: string;
  maxPrice?: string;
}

// Fetch filtered properties from InsForge database
async function getFilteredProperties(params: SearchParams): Promise<Property[]> {
  try {
    let query = insforge.database
      .from('properties')
      .select('*, agent:agents(*)')
      .eq('statut', 'disponible');

    if (params.type && params.type !== 'all') {
      query = query.eq('type', params.type as PropertyType);
    }

    if (params.category && params.category !== 'all') {
      query = query.eq('categorie', params.category as PropertyCategory);
    }

    if (params.ville && params.ville !== 'all') {
      query = query.eq('ville', params.ville);
    }

    if (params.minPrice) {
      const min = parseFloat(params.minPrice);
      if (!isNaN(min)) {
        query = query.gte('prix', min);
      }
    }

    if (params.maxPrice) {
      const max = parseFloat(params.maxPrice);
      if (!isNaN(max)) {
        query = query.lte('prix', max);
      }
    }

    if (params.q) {
      query = query.ilike('titre', `%${params.q}%`);
    }

    // Sort by created_at descending
    query = query.order('cree_a', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching filtered properties:', error);
      return [];
    }

    return (data || []) as Property[];
  } catch (e) {
    console.error('Exception fetching filtered properties:', e);
    return [];
  }
}

export const revalidate = 10; // short revalidation for catalog

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await searchParams;
  const properties = await getFilteredProperties(resolvedParams);

  const activeFiltersCount = [
    resolvedParams.q,
    resolvedParams.type && resolvedParams.type !== 'all',
    resolvedParams.category && resolvedParams.category !== 'all',
    resolvedParams.ville && resolvedParams.ville !== 'all',
    resolvedParams.minPrice,
    resolvedParams.maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="space-y-0 pb-24">
      {/* Hero Section */}
      <section className="relative h-[45vh] sm:h-[50vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover"
            alt="Catalogue immobilier TogoLux"
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1800&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#322214]/50 via-[#322214]/70 to-[#322214]/95" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-5">
          <span className="text-[#c5a373] text-xs font-mono font-bold uppercase tracking-[0.3em] block">
            Notre catalogue
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-[1.15] tracking-tight text-white font-bold">
            Nos Biens d'Exception
          </h1>
          <p className="text-stone-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans font-light">
            Parcourez notre catalogue exclusif d'appartements contemporains, duplex de prestige et parcelles vérifiées à Lomé.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg p-6 sm:p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1 lg:sticky lg:top-24 w-full">
              <PropertyFilters initialParams={resolvedParams} />
            </div>

            {/* Results column */}
            <div className="lg:col-span-3 space-y-6">
              {/* Active Filters Summary */}
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2 text-xs text-stone-500 bg-white border border-stone-150 px-4 py-2.5 rounded-lg w-fit shadow-sm">
                  <span>{properties.length} résultat(s) correspondant à vos filtres</span>
                </div>
              )}

              {/* Results Grid */}
              {properties.length === 0 ? (
                <div className="text-center py-24 bg-white border border-stone-200 rounded-xl p-8 max-w-xl mx-auto shadow-sm">
                  <MapPin className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <h3 className="text-base font-bold text-stone-900">Aucun bien trouvé</h3>
                  <p className="text-stone-500 text-xs sm:text-sm mt-2 mb-6 leading-relaxed">
                    Nous n'avons trouvé aucun bien correspondant à vos critères de recherche actuels. Veuillez essayer de modifier vos filtres.
                  </p>
                  <a
                    href="/biens"
                    className="bg-[#755a30] hover:bg-[#5f4826] text-white font-sans font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-sm inline-block transition-all duration-300 shadow-sm active:scale-[0.98]"
                  >
                    Réinitialiser les filtres
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {properties.map((prop) => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      href={`/biens/${prop.slug}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
