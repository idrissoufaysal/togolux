import * as React from 'react';
import { notFound } from 'next/navigation';
import { insforge } from '@/lib/insforge';
import { Property } from '@/types';
import { PriceTag, AgentAvatar, StatusBadge } from '@/components/ui';
import { VisitForm } from './VisitForm';
import { MapPin, BedDouble, Ruler, Building, HelpCircle, Maximize2, MessageSquare, Phone, Mail } from 'lucide-react';
import type { Metadata } from 'next';

interface RouteParams {
  slug: string;
}

// Fetch property helper
async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    const { data, error } = await insforge.database
      .from('properties')
      .select('*, agent:agents(*)')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching property details:', error);
      return null;
    }
    return data as Property;
  } catch (e) {
    console.error('Exception fetching property details:', e);
    return null;
  }
}

// Dynamic SEO metadata generator
export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const property = await getPropertyBySlug(resolvedParams.slug);

  if (!property) {
    return {
      title: 'Bien introuvable — TogoLux Properties',
      description: 'Le bien demandé est introuvable ou a été retiré du catalogue.',
    };
  }

  return {
    title: `${property.titre} — ${property.ville} | TogoLux Properties`,
    description: property.description?.slice(0, 160) || '',
    openGraph: {
      title: property.titre,
      description: property.description?.slice(0, 160) || '',
      images: [
        {
          url:
            property.images[0]?.url ||
            'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
        },
      ],
    },
  };
}

export const revalidate = 10; // short revalidation for dynamic details

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const resolvedParams = await params;
  const property = await getPropertyBySlug(resolvedParams.slug);

  if (!property) {
    notFound();
  }

  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    'name': property.titre,
    'description': property.description || '',
    'url': `https://togolux.com/biens/${property.slug}`,
    'datePosted': property.cree_a,
    'numberOfItems': 1,
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'item': {
          '@type': 'SingleFamilyResidence',
          'name': property.titre,
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': property.ville,
            'addressCountry': 'TG',
          },
          'offers': {
            '@type': 'Offer',
            'priceCurrency': 'XOF',
            'price': property.prix,
          },
        },
      },
    ],
  };

  const images = property.images.length > 0
    ? property.images
    : [{ id: 'default', name: 'default', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80' }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Insert JSON-LD for Search Engine indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header and Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/60 pb-8 bg-transparent">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="px-2.5 py-0.5 rounded-sm text-[9px] font-sans font-bold uppercase tracking-widest bg-[#322214] text-white shadow-sm">
              {property.categorie}
            </span>
            <StatusBadge status={property.statut} className="rounded-sm border-none text-[9px] font-sans font-bold uppercase px-2 py-0.5" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 leading-tight">
            {property.titre}
          </h1>
          <div className="flex items-center text-xs sm:text-sm text-stone-500 font-sans font-light">
            <MapPin className="w-4 h-4 text-[#c5a373] mr-1.5 shrink-0" />
            <span>{property.adresse}, {property.ville}</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200/60 p-4 rounded-xl shadow-sm shrink-0">
          <span className="text-[10px] text-stone-400 font-mono tracking-widest uppercase block mb-1">
            Tarif de présentation
          </span>
          <PriceTag price={property.prix} type={property.type} showEuroEquivalent={true} />
        </div>
      </div>

      {/* Dynamic Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-xl overflow-hidden shadow-sm">
        {/* Main large image */}
        <div className="md:col-span-2 aspect-[3/2] relative bg-stone-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]?.url}
            alt={images[0]?.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Thumbnail grid */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
          {images.slice(1, 3).map((img, i) => (
            <div key={img.id || i} className="aspect-[3/2] relative bg-stone-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
          {images.length <= 1 && (
            <div className="aspect-[3/2] bg-stone-50 flex items-center justify-center text-xs text-stone-400">
              Pas d'autres photos
            </div>
          )}
        </div>
      </div>

      {/* Bottom Layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side details */}
        <div className="lg:col-span-8 space-y-12">
          {/* Specs Card */}
          <div className="bg-white border border-stone-200/60 p-6 rounded-xl shadow-sm grid grid-cols-3 gap-4 text-center font-sans font-medium text-stone-500">
            <div className="space-y-1 border-r border-stone-100">
              <span className="text-[9px] font-mono tracking-widest uppercase block text-stone-400">Surface</span>
              <div className="flex items-center justify-center gap-1.5 pt-1">
                <Ruler className="w-4 h-4 text-[#c5a373] shrink-0" />
                <span className="text-sm sm:text-base font-bold text-stone-850 font-mono">
                  {property.surface} m²
                </span>
              </div>
            </div>
            <div className="space-y-1 border-r border-stone-100">
              <span className="text-[9px] font-mono tracking-widest uppercase block text-stone-400">Pièces</span>
              <div className="flex items-center justify-center gap-1.5 pt-1">
                <Building className="w-4 h-4 text-[#c5a373] shrink-0" />
                <span className="text-sm sm:text-base font-bold text-stone-850 font-mono">
                  {property.pieces} p.
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-mono tracking-widest uppercase block text-stone-400">Chambres</span>
              <div className="flex items-center justify-center gap-1.5 pt-1">
                <BedDouble className="w-4 h-4 text-[#c5a373] shrink-0" />
                <span className="text-sm sm:text-base font-bold text-stone-850 font-mono">
                  {property.chambres !== null ? `${property.chambres} ch.` : '--'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-sans text-stone-905">Description du bien</h2>
            <div className="bg-white border border-stone-200/50 p-8 rounded-xl shadow-sm leading-relaxed text-stone-600 text-xs sm:text-sm whitespace-pre-line font-sans">
              {property.description || "Aucune description fournie pour ce bien immobilier."}
            </div>
          </div>

          {/* Agent Card */}
          {property.agent && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-sans text-stone-905">Agent responsable</h2>
              <div className="bg-[#24180e] text-white p-8 rounded-xl shadow-lg border border-[#3a2818]/30 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <AgentAvatar nom={property.agent.nom} avatarUrl={property.agent.avatar_url} size="lg" className="border-2 border-[#c5a373]/20" />
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white">{property.agent.nom}</h3>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-[#c5a373] font-semibold block">
                      {property.agent.role === 'directeur' ? 'Directeur' : 'Agent Immobilier'}
                    </span>
                    <span className="flex items-center justify-center sm:justify-start text-xs text-stone-400">
                      <Mail className="w-3.5 h-3.5 mr-1.5" />
                      {property.agent.email}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/22871902237?text=Bonjour, je souhaite des infos sur le bien : "${property.titre}"`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-sm bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-stone-950 font-sans font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span>WhatsApp</span>
                  </a>
                  {property.agent.telephone && (
                    <a
                      href={`tel:${property.agent.telephone}`}
                      className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-sm bg-white/5 hover:bg-white/10 active:scale-[0.98] text-white border border-white/10 font-sans font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      <Phone className="w-4 h-4 shrink-0" />
                      <span>Appeler</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side form */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <VisitForm propertyId={property.id} />
        </div>
      </div>
    </div>
  );
}
