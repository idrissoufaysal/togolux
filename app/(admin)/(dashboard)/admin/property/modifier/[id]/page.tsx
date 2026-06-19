import * as React from 'react';
import { notFound } from 'next/navigation';
import { insforge } from '@/lib/insforge';
import { PropertyForm } from '../../nouveau/PropertyForm';
import { Agent, Property } from '@/types';

interface EditPropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Fetch agents and the selected property in parallel
  const [agentsRes, propertyRes] = await Promise.all([
    insforge.database.from('agents').select('*'),
    insforge.database
      .from('properties')
      .select('*')
      .eq('id', id)
      .maybeSingle(),
  ]);

  const agents = (agentsRes.data || []) as Agent[];
  const property = propertyRes.data as Property | null;

  if (!property) {
    notFound();
  }

  return <PropertyForm agents={agents} property={property} />;
}
