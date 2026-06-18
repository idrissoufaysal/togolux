"use client";

import * as React from 'react';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { insforge } from '@/lib/insforge';
import { PropertyImage, Agent, Property } from '@/types';
import {
  Upload,
  X,
  Loader2,
  MapPin,
  Building2,
  Plus,
  Compass,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { propertyFormSchema, PropertyFormValues } from './schema';
import { createProperty, updateProperty } from '../../actions';

interface PropertyFormProps {
  agents: Agent[];
  property?: Property;
}

export function PropertyForm({ agents, property }: PropertyFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-parse description and active amenities if property exists
  const parsed = React.useMemo(() => {
    if (!property) return { description: '', activeAmenities: {} as Record<string, boolean> };
    const desc = property.description || '';
    const splitIndex = desc.lastIndexOf('\n\nÉquipements :');
    if (splitIndex !== -1) {
      const rawDesc = desc.slice(0, splitIndex).trim();
      const amenitiesPart = desc.slice(splitIndex + 14).trim();
      const activeAmenities: Record<string, boolean> = {};
      const amenityLabels: Record<string, string> = {
        overflowPool: 'Piscine à débordement',
        landscapedGarden: 'Jardin paysager',
        security24h: 'Sécurité 24h/24',
        centralAc: 'Climatisation centrale',
        solarEnergy: 'Énergie solaire',
        automaticGate: 'Portail automatique',
      };
      for (const [key, label] of Object.entries(amenityLabels)) {
        if (amenitiesPart.includes(label)) {
          activeAmenities[key] = true;
        }
      }
      return { description: rawDesc, activeAmenities };
    }
    return { description: desc, activeAmenities: {} as Record<string, boolean> };
  }, [property]);

  // Amenities State (for visual form validation and description insertion)
  const [amenities, setAmenities] = useState(() => {
    const base = {
      overflowPool: false,
      landscapedGarden: false,
      security24h: false,
      centralAc: false,
      solarEnergy: false,
      automaticGate: false,
    };
    if (property) {
      return {
        ...base,
        ...parsed.activeAmenities,
      };
    }
    return {
      ...base,
      overflowPool: true,
      landscapedGarden: true,
      security24h: true,
      solarEnergy: true,
    };
  });

  // Zoom level on map placeholder
  const [zoom, setZoom] = useState(15);

  // UI States
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize react-hook-form with Zod validation resolver
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      titre: property?.titre || '',
      description: parsed.description,
      prix: property?.prix ? String(property.prix) : '',
      type: property?.type || 'vente',
      categorie: property?.categorie || 'maison',
      ville: property?.ville || 'Lomé',
      adresse: property?.adresse || '',
      chambres: property?.chambres ? String(property.chambres) : '4',
      pieces: property?.pieces ? String(property.pieces) : '3',
      surface: property?.surface ? String(property.surface) : '450',
      agent_id: property?.agent_id || agents[0]?.id || '',
      statut: property?.statut || 'disponible',
      images: property?.images || [],
    },
  });

  // Handle file uploads to InsForge storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMsg(null);

    const currentImages = form.getValues('images');
    const uploadedList: PropertyImage[] = [...currentImages];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]!;

        // File validation (Security review best practices)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          throw new Error(`Le fichier "${file.name}" est trop volumineux. La taille maximale autorisée est de 5 Mo.`);
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`Le format du fichier "${file.name}" n'est pas autorisé. Seuls les formats JPEG, PNG, WEBP et GIF sont acceptés.`);
        }

        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
        if (!extension || !allowedExtensions.includes(extension)) {
          throw new Error(`L'extension du fichier "${file.name}" est invalide.`);
        }

        const { data, error } = await insforge.storage
          .from('property-images')
          .uploadAuto(file);

        if (error || !data) {
          throw error || new Error("Erreur de téléchargement");
        }

        uploadedList.push({
          id: data.key,
          name: file.name,
          url: data.url,
        });
      }

      form.setValue('images', uploadedList);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Une erreur s'est produite lors de l'envoi de l'image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Remove uploaded image
  const handleRemoveImage = async (imageToRemove: PropertyImage) => {
    try {
      await insforge.storage.from('property-images').remove(imageToRemove.id);
      const currentImages = form.getValues('images');
      form.setValue(
        'images',
        currentImages.filter((img) => img.id !== imageToRemove.id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Form Action
  const onSubmit = async (values: PropertyFormValues, forceDraft = false) => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const activeAmenitiesKeys = Object.entries(amenities)
      .filter(([_, active]) => active)
      .map(([key]) => key);

    try {
      const res = property
        ? await updateProperty(property.id, values, activeAmenitiesKeys)
        : await createProperty(values, activeAmenitiesKeys, forceDraft);
        
      if (res.success) {
        router.push('/admin/property');
        router.refresh();
      } else {
        setErrorMsg(res.error || "Erreur lors de l'enregistrement de l'annonce.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Erreur lors de l'enregistrement de l'annonce.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentImages = form.watch('images') || [];
  const currentStatut = form.watch('statut');

  return (
    <Form {...form}>
      <form className="space-y-8 max-w-5xl mx-auto pb-12 font-sans" onSubmit={form.handleSubmit((v) => onSubmit(v, false))}>
        {/* Top Action Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#dec1ac]/40 pb-6">
          <div className="space-y-1">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-xs text-[#80756d]">
              <Link href="/admin/property" className="hover:text-[#322214] transition-colors">
                Biens immobiliers
              </Link>
              <ChevronRight className="w-3 h-3 text-[#80756d]/60" />
              <span className="text-[#322214] font-medium">
                {property ? 'Modifier une annonce' : 'Ajouter une annonce'}
              </span>
            </div>
            <h1 className="text-3xl font-sans text-[#322214] font-bold tracking-tight">
              {property ? "Modifier l'Annonce" : 'Nouvelle Annonce Immobilière'}
            </h1>
            <p className="text-sm text-[#80756d]">
              {property
                ? "Modifier l'annonce exclusive pour le catalogue Prestige."
                : 'Créer une nouvelle annonce exclusive pour le catalogue Prestige.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!property && (
              <button
                type="button"
                disabled={isSubmitting || isUploading}
                onClick={form.handleSubmit((v) => onSubmit(v, true))}
                className="px-5 py-2.5 bg-white border border-[#dec1ac]/65 hover:bg-[#fff1e9]/30 text-[#322214] rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-98 disabled:opacity-50"
              >
                Enregistrer en Brouillon
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#322214] hover:bg-[#4a3728] text-white rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <span>{property ? 'Enregistrer' : "Publier l'Annonce"}</span>
              )}
            </button>

          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Block 1: General Information */}
        <section className="bg-white rounded-2xl border border-[#dec1ac]/65 shadow-sm p-6 md:p-8 space-y-6">
          <h2 className="text-base text-[#322214] font-bold flex items-center gap-2 border-b border-[#dec1ac]/30 pb-3">
            <Info className="w-4 h-4 text-[#c5a373]" />
            Informations Générales
          </h2>

          <div className="grid grid-cols-1 gap-6">
            <FormField
              control={form.control}
              name="titre"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Titre du bien *</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      placeholder="ex. Villa moderne en bord de mer avec piscine"
                      className="w-full px-4 py-3 bg-[#fff8f5]/30 border border-[#dec1ac]/60 rounded-xl text-xs focus:outline-none focus:border-[#c5a373] text-[#221a14] placeholder-[#80756d]/55 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <textarea
                      rows={4}
                      placeholder="Décrivez les points forts de l'architecture, le niveau de standing, et les arguments clés de vente..."
                      className="w-full px-4 py-3 bg-[#fff8f5]/30 border border-[#dec1ac]/60 rounded-xl text-xs focus:outline-none focus:border-[#c5a373] text-[#221a14] placeholder-[#80756d]/55 transition-all resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="categorie"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel>Type de bien</FormLabel>
                    <FormControl>
                      <select
                        className="w-full px-4 py-3 bg-[#fff8f5]/30 border border-[#dec1ac]/60 rounded-xl text-xs focus:outline-none focus:border-[#c5a373] text-[#221a14] cursor-pointer transition-all"
                        {...field}
                      >
                        <option value="maison">Maison / Villa</option>
                        <option value="appartement">Appartement</option>
                        <option value="terrain">Terrain</option>
                        <option value="bureau">Bureau</option>
                        <option value="commerce">Commerce</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel>Type de transaction</FormLabel>
                    <FormControl>
                      <select
                        className="w-full px-4 py-3 bg-[#fff8f5]/30 border border-[#dec1ac]/60 rounded-xl text-xs focus:outline-none focus:border-[#c5a373] text-[#221a14] cursor-pointer transition-all"
                        {...field}
                      >
                        <option value="vente">À Vendre</option>
                        <option value="location">À Louer</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </section>

        {/* Block 2: Media Gallery */}
        <section className="bg-white rounded-2xl border border-[#dec1ac]/65 shadow-sm p-6 md:p-8 space-y-6">
          <h2 className="text-base text-[#322214] font-bold flex items-center gap-2 border-b border-[#dec1ac]/30 pb-3">
            <Upload className="w-4 h-4 text-[#c5a373]" />
            Galerie Médias
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Main big slot (60%) */}
            <div className="lg:col-span-3">
              {currentImages.length > 0 ? (
                <div className="relative w-full h-[280px] rounded-2xl overflow-hidden border border-[#dec1ac]/40 shadow-sm group bg-stone-50">
                  <Image
                    src={currentImages[0]?.url || ''}
                    alt={currentImages[0]?.name || "Image principale"}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover"
                    priority
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(currentImages[0]!)}
                    className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-all shadow-sm z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-[280px] rounded-2xl border-2 border-dashed border-[#dec1ac]/60 hover:border-[#c5a373] hover:bg-[#fff8f5]/30 flex flex-col items-center justify-center cursor-pointer transition-all gap-3"
                >
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-[#c5a373] animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8 text-[#80756d]/65" />
                  )}
                  <span className="text-xs font-semibold text-[#80756d]">
                    {isUploading ? 'Téléchargement...' : 'Cliquez pour ajouter des photos'}
                  </span>
                </div>
              )}
            </div>

            {/* 3 small side slots (40%) */}
            <div className="lg:col-span-2 grid grid-rows-3 gap-4 h-[280px]">
              {[1, 2, 3].map((slotIdx) => {
                const image = currentImages[slotIdx];
                return (
                  <div key={slotIdx} className="w-full h-full rounded-2xl overflow-hidden relative border border-[#dec1ac]/40 bg-stone-50/20">
                    {image ? (
                      <>
                        <Image
                          src={image.url}
                          alt={image.name || `Image ${slotIdx}`}
                          fill
                          sizes="(max-width: 768px) 33vw, 20vw"
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(image)}
                          className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black text-white rounded-full transition-all z-10"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-full border-2 border-dashed border-[#dec1ac]/40 hover:border-[#c5a373] hover:bg-[#fff8f5]/20 flex flex-col items-center justify-center cursor-pointer transition-all gap-1"
                      >
                        <Plus className="w-4 h-4 text-[#80756d]/60" />
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#80756d]/75">
                          AJOUTER
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-[11px] text-[#80756d]/80 italic">
            Astuce : Les photos haute résolution (min 1920x1080) avec une lumière chaleureuse performent 40% mieux.
          </p>
        </section>

        {/* Block 3: Location Details */}
        <section className="bg-white rounded-2xl border border-[#dec1ac]/65 shadow-sm p-6 md:p-8 space-y-6">
          <h2 className="text-base text-[#322214] font-bold flex items-center gap-2 border-b border-[#dec1ac]/30 pb-3">
            <MapPin className="w-4 h-4 text-[#c5a373]" />
            Localisation géographique
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#322214] uppercase tracking-wider block">
                Région
              </label>
              <select
                defaultValue="Maritime"
                className="w-full px-4 py-3 bg-[#fff8f5]/30 border border-[#dec1ac]/60 rounded-xl text-xs focus:outline-none focus:border-[#c5a373] text-[#221a14] cursor-pointer transition-all"
              >
                <option value="Maritime">Maritime (Lomé)</option>
                <option value="Plateaux">Plateaux (Atakpamé)</option>
                <option value="Centrale">Centrale (Sokodé)</option>
                <option value="Kara">Kara</option>
                <option value="Savanes">Savanes (Dapaong)</option>
              </select>
            </div>

            <FormField
              control={form.control}
              name="ville"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Ville *</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      placeholder="ex. Lomé"
                      className="w-full px-4 py-3 bg-[#fff8f5]/30 border border-[#dec1ac]/60 rounded-xl text-xs focus:outline-none focus:border-[#c5a373] text-[#221a14] placeholder-[#80756d]/55 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Quartier *</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      placeholder="ex. Cité OUA"
                      className="w-full px-4 py-3 bg-[#fff8f5]/30 border border-[#dec1ac]/60 rounded-xl text-xs focus:outline-none focus:border-[#c5a373] text-[#221a14] placeholder-[#80756d]/55 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Map visual container */}
          <div className="relative w-full h-[220px] rounded-2xl overflow-hidden border border-[#dec1ac]/40 shadow-inner group">
            <Image
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80"
              alt="Vue satellite de la carte"
              fill
              sizes="100vw"
              className="object-cover brightness-90 saturate-50"
            />
            {/* Centered Map Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-10">
              <MapPin className="w-7 h-7 text-[#322214] fill-[#c5a373] animate-bounce" />
              <span className="bg-[#322214] text-white text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-1 rounded-md shadow-md">
                EMPLACEMENT ÉPINGLÉ
              </span>
            </div>

            {/* Zoom controls */}
            <div className="absolute bottom-4 right-4 bg-white border border-[#dec1ac]/60 rounded-lg shadow-sm flex flex-col z-10">
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.min(prev + 1, 20))}
                className="w-8 h-8 flex items-center justify-center hover:bg-[#fff1e9]/30 text-[#322214] font-bold border-b border-[#dec1ac]/45 transition-colors"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.max(prev - 1, 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-[#fff1e9]/30 text-[#322214] font-bold transition-colors"
              >
                -
              </button>
            </div>
          </div>
        </section>

        {/* Grid: Key Features & Amenities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Features Block */}
          <section className="bg-white rounded-2xl border border-[#dec1ac]/65 shadow-sm p-6 md:p-8 space-y-6">
            <h2 className="text-base text-[#322214] font-bold flex items-center gap-2 border-b border-[#dec1ac]/30 pb-3">
              <Compass className="w-4 h-4 text-[#c5a373]" />
              Caractéristiques clés
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="chambres"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel>Chambres</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        className="w-full px-4 py-3 bg-[#fff8f5]/30 border border-[#dec1ac]/60 rounded-xl text-xs focus:outline-none focus:border-[#c5a373] text-[#221a14] transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pieces"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel>Salles de bain</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        className="w-full px-4 py-3 bg-[#fff8f5]/30 border border-[#dec1ac]/60 rounded-xl text-xs focus:outline-none focus:border-[#c5a373] text-[#221a14] transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#322214] uppercase tracking-wider block">
                  Salons
                </label>
                <input
                  type="number"
                  defaultValue="2"
                  className="w-full px-4 py-3 bg-[#fff8f5]/30 border border-[#dec1ac]/60 rounded-xl text-xs focus:outline-none focus:border-[#c5a373] text-[#221a14] transition-all"
                />
              </div>

              <FormField
                control={form.control}
                name="surface"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel>Surface (m²) *</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        className="w-full px-4 py-3 bg-[#fff8f5]/30 border border-[#dec1ac]/60 rounded-xl text-xs focus:outline-none focus:border-[#c5a373] text-[#221a14] transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Agent Selection */}
            <FormField
              control={form.control}
              name="agent_id"
              render={({ field }) => (
                <FormItem className="space-y-1.5 pt-2">
                  <FormLabel>Assigner un Agent</FormLabel>
                  <FormControl>
                    {agents.length === 0 ? (
                      <span className="text-xs text-[#80756d] italic">Aucun agent disponible.</span>
                    ) : (
                      <select
                        className="w-full px-4 py-3 bg-[#fff8f5]/30 border border-[#dec1ac]/60 rounded-xl text-xs focus:outline-none focus:border-[#c5a373] text-[#221a14] cursor-pointer transition-all"
                        {...field}
                      >
                        {agents.map((agent) => (
                          <option key={agent.id} value={agent.id}>
                            {agent.nom} ({agent.role})
                          </option>
                        ))}
                      </select>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          {/* Amenities Block */}
          <section className="bg-white rounded-2xl border border-[#dec1ac]/65 shadow-sm p-6 md:p-8 space-y-6">
            <h2 className="text-base text-[#322214] font-bold flex items-center gap-2 border-b border-[#dec1ac]/30 pb-3">
              <Check className="w-4 h-4 text-[#c5a373]" />
              Équipements & Commodités
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 text-xs text-[#322214] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenities.overflowPool}
                  onChange={(e) => setAmenities({ ...amenities, overflowPool: e.target.checked })}
                  className="rounded border-[#dec1ac] text-[#c5a373] focus:ring-[#c5a373] cursor-pointer"
                />
                <span>Piscine à débordement</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-[#322214] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenities.landscapedGarden}
                  onChange={(e) => setAmenities({ ...amenities, landscapedGarden: e.target.checked })}
                  className="rounded border-[#dec1ac] text-[#c5a373] focus:ring-[#c5a373] cursor-pointer"
                />
                <span>Jardin paysager</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-[#322214] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenities.security24h}
                  onChange={(e) => setAmenities({ ...amenities, security24h: e.target.checked })}
                  className="rounded border-[#dec1ac] text-[#c5a373] focus:ring-[#c5a373] cursor-pointer"
                />
                <span>Sécurité 24h/24</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-[#322214] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenities.centralAc}
                  onChange={(e) => setAmenities({ ...amenities, centralAc: e.target.checked })}
                  className="rounded border-[#dec1ac] text-[#c5a373] focus:ring-[#c5a373] cursor-pointer"
                />
                <span>Climatisation centrale</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-[#322214] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenities.solarEnergy}
                  onChange={(e) => setAmenities({ ...amenities, solarEnergy: e.target.checked })}
                  className="rounded border-[#dec1ac] text-[#c5a373] focus:ring-[#c5a373] cursor-pointer"
                />
                <span>Énergie solaire</span>
              </label>

              <label className="flex items-center gap-3 text-xs text-[#322214] font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenities.automaticGate}
                  onChange={(e) => setAmenities({ ...amenities, automaticGate: e.target.checked })}
                  className="rounded border-[#dec1ac] text-[#c5a373] focus:ring-[#c5a373] cursor-pointer"
                />
                <span>Portail automatique</span>
              </label>
            </div>
          </section>
        </div>

        {/* Block 6: Pricing & Listing Status */}
        <section className="bg-white rounded-2xl border border-[#dec1ac]/65 shadow-sm p-6 md:p-8 space-y-6">
          <h2 className="text-base text-[#322214] font-bold flex items-center gap-2 border-b border-[#dec1ac]/30 pb-3">
            <Building2 className="w-4 h-4 text-[#c5a373]" />
            Tarification & Statut
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="prix"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel>Prix (FCFA) *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="ex. 250,000,000"
                        className="w-full pl-4 pr-12 py-3 bg-[#fff8f5]/30 border border-[#dec1ac]/60 rounded-xl text-xs focus:outline-none focus:border-[#c5a373] text-[#221a14] placeholder-[#80756d]/55 transition-all"
                        {...field}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#80756d] font-bold">
                        CFA
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#322214] uppercase tracking-wider block">
                Statut Initial
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => form.setValue('statut', 'disponible')}
                  className={`py-3 rounded-xl text-xs font-semibold shadow-sm border transition-all ${
                    currentStatut === 'disponible'
                      ? 'bg-[#ffe08f]/55 border-[#c5a373] text-[#322214] font-bold'
                      : 'bg-white border-[#dec1ac]/65 text-[#80756d] hover:bg-[#fff1e9]/30'
                  }`}
                >
                  Disponible
                </button>
                <button
                  type="button"
                  onClick={() => form.setValue('statut', 'sous_compromis')}
                  className={`py-3 rounded-xl text-xs font-semibold shadow-sm border transition-all ${
                    currentStatut === 'sous_compromis'
                      ? 'bg-[#ffe08f]/55 border-[#c5a373] text-[#322214] font-bold'
                      : 'bg-white border-[#dec1ac]/65 text-[#80756d] hover:bg-[#fff1e9]/30'
                  }`}
                >
                  Brouillon
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Form Footer */}
        <footer className="pt-6 border-t border-[#dec1ac]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-[#80756d] font-sans">
          <p>© 2026 Prestige Admin Gestion Immobilière Exclusive. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:underline">Support</Link>
            <Link href="#" className="hover:underline">Politique de Confidentialité</Link>
            <Link href="#" className="hover:underline">Contactez-nous</Link>
            <Link href="#" className="hover:underline">Conditions d'Utilisation</Link>
          </div>
        </footer>
      </form>
    </Form>
  );
}
