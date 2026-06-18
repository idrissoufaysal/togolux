import { z } from 'zod';

export const propertyFormSchema = z.object({
  titre: z.string().min(3, { message: "Le titre doit faire au moins 3 caractères." }),
  description: z.string().min(1, { message: "La description est obligatoire." }),
  prix: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Le prix doit être un nombre supérieur à 0.",
  }),
  type: z.enum(['vente', 'location']),
  categorie: z.enum(['maison', 'appartement', 'terrain', 'bureau', 'commerce']),
  ville: z.string().min(2, { message: "La ville doit faire au moins 2 caractères." }),
  adresse: z.string().min(2, { message: "Le quartier doit faire au moins 2 caractères." }),
  chambres: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Le nombre de chambres doit être un nombre positif.",
  }),
  pieces: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Le nombre de salles de bain/pièces doit être un nombre positif.",
  }),
  surface: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "La surface doit être un nombre supérieur à 0.",
  }),
  agent_id: z.string().min(1, { message: "Veuillez assigner un agent." }),
  statut: z.enum(['disponible', 'sous_compromis', 'vendu', 'loue']),
  images: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
    })
  ),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
