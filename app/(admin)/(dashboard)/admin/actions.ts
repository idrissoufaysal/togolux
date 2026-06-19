'use server';

import { insforge } from '@/lib/insforge';
import { revalidatePath } from 'next/cache';
import { VisitStatus, ContactStatus } from '@/types';
import { PropertyFormValues } from './property/nouveau/schema';

export async function updateVisitStatus(visitId: string, status: VisitStatus) {
  try {
    const { error } = await insforge.database
      .from('visits')
      .update({ statut: status })
      .eq('id', visitId);

    if (error) throw error;
    revalidatePath('/admin/visites');
    revalidatePath('/admin');
  } catch (err: any) {
    console.error('Error updating visit status:', err);
  }
}

export async function updateContactStatus(contactId: string, status: ContactStatus) {
  try {
    const { error } = await insforge.database
      .from('contacts')
      .update({ statut: status })
      .eq('id', contactId);

    if (error) throw error;
    revalidatePath('/admin/contacts');
    revalidatePath('/admin');
  } catch (err: any) {
    console.error('Error updating contact status:', err);
  }
}

const generateSlug = (titre: string) => {
  return titre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 100);
};

export async function createProperty(
  values: PropertyFormValues,
  activeAmenitiesKeys: string[],
  forceDraft: boolean = false
) {
  try {
    const amenityLabels: Record<string, string> = {
      overflowPool: 'Piscine à débordement',
      landscapedGarden: 'Jardin paysager',
      security24h: 'Sécurité 24h/24',
      centralAc: 'Climatisation centrale',
      solarEnergy: 'Énergie solaire',
      automaticGate: 'Portail automatique',
    };
    
    const activeLabels = activeAmenitiesKeys.map((key) => amenityLabels[key] || key);
    const fullDescription = activeLabels.length > 0 
      ? `${values.description}\n\nÉquipements : ${activeLabels.join(', ')}`
      : values.description;

    const statutValue = forceDraft ? 'sous_compromis' : values.statut;

    const { error } = await insforge.database.from('properties').insert([
      {
        titre: values.titre,
        description: fullDescription,
        prix: parseFloat(values.prix),
        type: values.type,
        categorie: values.categorie,
        statut: statutValue,
        surface: parseFloat(values.surface),
        pieces: parseInt(values.pieces, 10),
        chambres: parseInt(values.chambres, 10) || null,
        ville: values.ville,
        code_postal: '9900',
        adresse: values.adresse,
        slug: generateSlug(values.titre),
        images: values.images,
        en_vedette: false,
        agent_id: values.agent_id || null,
      },
    ]);

    if (error) throw error;

    revalidatePath('/admin/property');
    revalidatePath('/biens');
    revalidatePath('/');

    return { success: true };
  } catch (err: any) {
    console.error('Error creating property:', err);
    return { success: false, error: err.message || "Erreur lors de l'enregistrement de l'annonce." };
  }
}

export async function deleteProperty(propertyId: string) {
  try {
    // 1. Get the property to find its images
    const { data: property, error: fetchError } = await insforge.database
      .from('properties')
      .select('images')
      .eq('id', propertyId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    // 2. Clean up images from storage
    if (property?.images && Array.isArray(property.images)) {
      for (const img of property.images) {
        if (img.id) {
          try {
            await insforge.storage.from('property-images').remove(img.id);
          } catch (storageErr) {
            console.error(`Failed to remove image ${img.id} from storage:`, storageErr);
          }
        }
      }
    }

    // 3. Delete associated visits first
    await insforge.database.from('visits').delete().eq('property_id', propertyId);

    // 4. Delete the property row from database
    const { error } = await insforge.database
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) throw error;

    revalidatePath('/admin/property');
    revalidatePath('/biens');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting property:', err);
    return { success: false, error: err.message || 'Erreur lors de la suppression.' };
  }
}

export async function updateProperty(
  propertyId: string,
  values: PropertyFormValues,
  activeAmenitiesKeys: string[]
) {
  try {
    const amenityLabels: Record<string, string> = {
      overflowPool: 'Piscine à débordement',
      landscapedGarden: 'Jardin paysager',
      security24h: 'Sécurité 24h/24',
      centralAc: 'Climatisation centrale',
      solarEnergy: 'Énergie solaire',
      automaticGate: 'Portail automatique',
    };
    
    const activeLabels = activeAmenitiesKeys.map((key) => amenityLabels[key] || key);
    const fullDescription = activeLabels.length > 0 
      ? `${values.description}\n\nÉquipements : ${activeLabels.join(', ')}`
      : values.description;

    const { error } = await insforge.database
      .from('properties')
      .update({
        titre: values.titre,
        description: fullDescription,
        prix: parseFloat(values.prix),
        type: values.type,
        categorie: values.categorie,
        statut: values.statut,
        surface: parseFloat(values.surface),
        pieces: parseInt(values.pieces, 10),
        chambres: parseInt(values.chambres, 10) || null,
        ville: values.ville,
        adresse: values.adresse,
        images: values.images,
        agent_id: values.agent_id || null,
        mis_a_jour_a: new Date().toISOString(),
      })
      .eq('id', propertyId);

    if (error) throw error;

    revalidatePath('/admin/property');
    revalidatePath(`/biens/${generateSlug(values.titre)}`);
    revalidatePath('/biens');
    revalidatePath('/');

    return { success: true };
  } catch (err: any) {
    console.error('Error updating property:', err);
    return { success: false, error: err.message || "Erreur lors de la modification de l'annonce." };
  }
}


