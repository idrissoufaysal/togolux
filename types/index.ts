export type PropertyType = 'vente' | 'location';
export type PropertyCategory = 'maison' | 'appartement' | 'terrain' | 'bureau' | 'commerce';
export type PropertyStatus = 'disponible' | 'sous_compromis' | 'vendu' | 'loue';
export type VisitStatus = 'planifiee' | 'confirmee' | 'effectuee' | 'annulee';
export type ContactStatus = 'nouveau' | 'en_cours' | 'traite' | 'archive';
export type AgentRole = 'agent' | 'directeur' | 'admin';

export interface Agent {
  id: string;
  nom: string;
  email: string;
  telephone: string | null;
  avatar_url: string | null;
  role: AgentRole;
  cree_a: string;
}

export interface PropertyImage {
  id: string;
  name: string;
  url: string;
}

export interface Property {
  id: string;
  titre: string;
  description: string | null;
  prix: number;
  type: PropertyType;
  categorie: PropertyCategory;
  statut: PropertyStatus;
  surface: number;
  pieces: number;
  chambres: number | null;
  ville: string;
  code_postal: string;
  adresse: string;
  slug: string;
  images: PropertyImage[];
  en_vedette: boolean;
  agent_id: string | null;
  agent?: Agent;
  latitude: number | null;
  longitude: number | null;
  cree_a: string;
  mis_a_jour_a: string;
}

export interface Visit {
  id: string;
  property_id: string;
  property?: Property;
  nom_client: string;
  email_client: string;
  telephone_client: string;
  date_visite: string;
  statut: VisitStatus;
  message: string | null;
  cree_a: string;
}

export interface Contact {
  id: string;
  nom: string;
  email: string;
  telephone: string | null;
  sujet: string;
  message: string;
  statut: ContactStatus;
  cree_a: string;
}
