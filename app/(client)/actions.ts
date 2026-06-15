'use server';

import { insforge } from '@/lib/insforge';

export async function createVisit(formData: {
  propertyId: string;
  nom: string;
  email: string;
  telephone: string;
  date: string;
  message: string;
}) {
  try {
    const { data, error } = await insforge.database
      .from('visits')
      .insert([
        {
          property_id: formData.propertyId,
          nom_client: formData.nom,
          email_client: formData.email,
          telephone_client: formData.telephone,
          date_visite: new Date(formData.date).toISOString(),
          message: formData.message || null,
          statut: 'planifiee',
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting visit:', error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error('Exception in createVisit:', err);
    return { success: false, error: err.message || 'Une erreur inconnue s\'est produite.' };
  }
}

export async function createContact(formData: {
  nom: string;
  email: string;
  telephone: string;
  sujet: string;
  message: string;
}) {
  try {
    const { data, error } = await insforge.database
      .from('contacts')
      .insert([
        {
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone || null,
          sujet: formData.sujet,
          message: formData.message,
          statut: 'nouveau',
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting contact:', error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.error('Exception in createContact:', err);
    return { success: false, error: err.message || 'Une erreur inconnue s\'est produite.' };
  }
}
