import * as React from 'react';
import { z } from 'zod';
import { insforge } from '@/lib/insforge';
import { Property } from '@/types';
import { PropertyHeader } from './_components/PropertyHeader';
import { PropertyTabs } from './_components/PropertyTabs';
import { PropertyTable } from './_components/PropertyTable';
import { PropertyPagination } from './_components/PropertyPagination';

// Force dynamic data loading
export const revalidate = 0;

// Input Validation and Sanitization Schema
const searchParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return 1;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) || parsed < 1 ? 1 : parsed;
    })
    .catch(1),
  status: z
    .enum(['all', 'disponible', 'sous_compromis', 'vendu', 'location'])
    .optional()
    .default('all')
    .catch('all'),
  search: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return '';
      // Strip potentially harmful characters for PostgREST query syntax or injection
      return val.trim().replace(/[,()\\%_]/g, '').slice(0, 100);
    })
    .catch(''),
});

type ValidatedSearchParams = z.infer<typeof searchParamsSchema>;

/**
 * Fetch entity count from database with specific status or type filters
 * Uses lightweight `head: true` metadata request to optimize database performance
 */
async function fetchCount(filters?: { statut?: string; type?: string }) {
  try {
    let query = insforge.database
      .from('properties')
      .select('*', { count: 'exact', head: true });

    if (filters?.statut) {
      query = query.eq('statut', filters.statut);
    }
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    const { count, error } = await query;
    if (error) {
      console.error('Error executing count query with filters:', filters, error);
      throw new Error('Erreur de comptage en base de données');
    }
    return count || 0;
  } catch (err) {
    console.error('Database connection error in fetchCount:', err);
    throw new Error('Erreur de communication avec la base de données');
  }
}

export default async function PropertyAdminPage({
  searchParams,
}: {
  searchParams: Promise<unknown>;
}) {
  let resolvedParams: ValidatedSearchParams;
  
  try {
    const rawParams = await searchParams;
    resolvedParams = searchParamsSchema.parse(rawParams);
  } catch (err) {
    console.error('Validation error for searchParams:', err);
    resolvedParams = { page: 1, status: 'all', search: '' };
  }

  const { page, status, search } = resolvedParams;

  // Prepare filtered list query
  let listQuery = insforge.database
    .from('properties')
    .select('*, agent:agents(*)', { count: 'exact' });

  // Filter by status/type
  if (status === 'disponible') {
    listQuery = listQuery.eq('statut', 'disponible');
  } else if (status === 'sous_compromis') {
    listQuery = listQuery.eq('statut', 'sous_compromis');
  } else if (status === 'vendu') {
    listQuery = listQuery.eq('statut', 'vendu');
  } else if (status === 'location') {
    listQuery = listQuery.eq('type', 'location');
  }

  // Filter by search text
  if (search) {
    listQuery = listQuery.or(`titre.ilike.%${search}%,ville.ilike.%${search}%,adresse.ilike.%${search}%`);
  }

  // Pagination bounds
  const PAGE_SIZE = 5;
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  listQuery = listQuery.range(start, end).order('cree_a', { ascending: false });

  // Execute count and data queries in parallel to eliminate waterfalls
  try {
    const [
      allCount,
      disponibleCount,
      sousCompromisCount,
      venduCount,
      locationCount,
      listResult,
    ] = await Promise.all([
      fetchCount(),
      fetchCount({ statut: 'disponible' }),
      fetchCount({ statut: 'sous_compromis' }),
      fetchCount({ statut: 'vendu' }),
      fetchCount({ type: 'location' }),
      listQuery,
    ]);

    if (listResult.error) {
      console.error('Error executing properties list query:', listResult.error);
      throw new Error('Erreur de sélection en base de données');
    }

    const properties = (listResult.data || []) as Property[];
    const totalFilteredCount = listResult.count || 0;
    const totalPages = Math.ceil(totalFilteredCount / PAGE_SIZE);

    return (
      <div className="space-y-8">
        {/* Header Section */}
        <PropertyHeader allCount={allCount} status={status} search={search} />

        {/* Tab Filters */}
        <PropertyTabs
          status={status}
          search={search}
          allCount={allCount}
          disponibleCount={disponibleCount}
          sousCompromisCount={sousCompromisCount}
          venduCount={venduCount}
          locationCount={locationCount}
        />

        {/* Properties Table */}
        <PropertyTable properties={properties} />

        {/* Pagination Section */}
        <PropertyPagination
          page={page}
          totalPages={totalPages}
          totalCount={totalFilteredCount}
          pageSize={PAGE_SIZE}
          status={status}
          search={search}
        />
      </div>
    );
  } catch (err) {
    console.error('Unhandled data fetch error in PropertyAdminPage:', err);
    throw new Error('Une erreur s\'est produite lors de la récupération des données. Veuillez réessayer.');
  }
}
