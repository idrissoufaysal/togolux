import * as React from 'react';
import { insforge } from '@/lib/insforge';
import { PropertyForm } from './PropertyForm';

export default async function NewPropertyPage() {
  let agents = [];
  try {
    const { data } = await insforge.database.from('agents').select('*');
    if (data) {
      agents = data;
    }
  } catch (e) {
    console.error('Error fetching agents on server:', e);
  }

  return <PropertyForm agents={agents} />;
}
