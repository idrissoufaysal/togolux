import * as React from 'react';
import Link from 'next/link';
import { PropertyCard, SearchPill } from '@/components/ui';
import { insforge } from '@/lib/insforge';
import { Property } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Search,
  Building2,
  Users2,
  TrendingUp,
  Award,
  ShieldCheck,
  Zap,
  Star,
  ArrowRight,
} from 'lucide-react';

// Fetch featured properties directly from InsForge database
async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const { data, error } = await insforge.database
      .from('properties')
      .select('*, agent:agents(*)')
      .eq('en_vedette', true)
      .eq('statut', 'disponible')
      .limit(3); // 3 properties for homepage grid

    if (error) {
      console.error('Error fetching featured properties:', error);
      return [];
    }
    return (data || []) as Property[];
  } catch (e) {
    console.error('Exception fetching featured properties:', e);
    return [];
  }
}

export const revalidate = 60; // Revalidate ISR every 60 seconds

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties();

  const services = [
    {
      title: 'Achat & Vente Sécurisés',
      description: 'Transactions auditées juridiquement pour un transfert de propriété sans litige foncier à Lomé.',
      icon: ShieldCheck,
    },
    {
      title: 'Gestion Locative Clé en main',
      description: 'Percevez vos loyers mensuels en toute confiance. Nous gérons bail, locataires et maintenance.',
      icon: Building2,
    },
    {
      title: 'Rénovation & Décoration',
      description: 'Modernisation contemporaine pour valoriser la rentabilité de vos appartements de standing.',
      icon: Zap,
    },
  ];

  const reviews = [
    {
      name: 'Zakietou Badji',
      role: 'Diaspora, France',
      comment: "J'ai sollicité l'agence TogoLux pour mon séjour à Lomé. Service impeccable, villa à Avedji d'une propreté exemplaire et équipe à l'écoute. Je recommande vivement pour tous ceux qui cherchent la sérénité !",
      stars: 5,
    },
    {
      name: 'Faouz Tab',
      role: 'Investisseur Local',
      comment: "Une collaboration remarquable sur la rénovation de notre duplex familial. Budgets et délais respectés, design soigné. TogoLux est sans conteste l'agence la plus professionnelle de Lomé.",
      stars: 5,
    },
  ];

  return (
    <div className="space-y-0 pb-24 bg-background text-foreground">
      {/* 1. Hero Section (Stitch Style) */}
      <section className="relative h-[85vh] sm:h-[90vh] min-h-[650px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full h-full object-cover animate-fade-in"
            alt="Villa moderne de prestige à Lomé"
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=80"
          />
          {/* Warm Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#322214]/40 via-[#322214]/65 to-[#322214]/90" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
          <span className="text-accent text-xs font-mono font-bold uppercase tracking-[0.3em] block">
            Votre partenaire immobilier de confiance
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans leading-[1.15] tracking-tight text-white font-bold whitespace-pre-line">
            Trouvez la maison{"\n"}de vos rêves
          </h1>
          <p className="text-stone-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans font-light">
            Découvrez une sélection exclusive de ventes et locations de prestige à Lomé et ses environs.
          </p>

          {/* Search Pill (Interactive client component using Shadcn Select) */}
          <SearchPill />
        </div>
      </section>

      {/* 2. Featured Properties */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="border-b border-stone-100 pb-4">
          <h2 className="text-3xl sm:text-4xl font-sans text-stone-900 font-bold relative inline-block pb-4">
            Biens en vedette
            <span className="absolute bottom-0 left-0 w-16 h-[3px] bg-[#c5a373]"></span>
          </h2>
        </div>

        {featuredProperties.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-xl p-8 max-w-xl mx-auto shadow-sm">
            <Building2 className="w-10 h-10 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-550 text-sm mb-4">Aucune propriété en vedette disponible pour le moment.</p>
            <Link href="/biens">
              <Button className="bg-[#755a30] hover:bg-[#5f4826] text-white">Parcourir le catalogue</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  href={`/biens/${prop.slug}`}
                />
              ))}
            </div>
            
            <div className="flex justify-center pt-4">
              <Link href="/biens">
                <Button className="bg-[#755a30] hover:bg-[#5f4826] text-white rounded-sm px-8 py-6 font-sans font-bold uppercase tracking-widest text-xs transition-all active:scale-[0.98]">
                  Voir tous nos biens
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 3. Stats Banner (Stitch Style) */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center space-y-1">
            <span className="text-[#c5a373] text-4xl sm:text-5xl font-sans font-semibold">127</span>
            <span className="text-stone-400 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em]">Biens disponibles</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-[#c5a373] text-4xl sm:text-5xl font-sans font-semibold">43</span>
            <span className="text-stone-400 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em]">Ventes réalisées</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-[#c5a373] text-4xl sm:text-5xl font-sans font-semibold">8</span>
            <span className="text-stone-400 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em]">Agents experts</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <span className="text-[#c5a373] text-4xl sm:text-5xl font-sans font-semibold">12</span>
            <span className="text-stone-400 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em]">Ans d'expérience</span>
          </div>
        </div>
      </section>

      {/* 4. Services / Expertises */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold tracking-widest text-accent uppercase">Services 360°</span>
            <h2 className="text-3xl sm:text-4xl font-sans font-bold">Une expertise complète à Lomé</h2>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Nous couvrons l'ensemble des besoins immobiliers, que vous soyez résident au Togo ou membre de la diaspora désireux de sécuriser un projet à distance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((serv, i) => (
              <div
                key={i}
                className="bg-stone-950/60 border border-white/5 hover:border-accent/30 p-8 rounded-3xl space-y-4 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center border border-accent/15 group-hover:bg-accent group-hover:text-primary transition-all duration-300">
                  <serv.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-sans text-white pt-2">{serv.title}</h3>
                <p className="text-stone-400 text-xs sm:text-[13px] leading-relaxed">{serv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 6. Testimonials */}
      <section className="bg-stone-50 dark:bg-stone-900/10 py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold tracking-widest text-accent uppercase">Témoignages</span>
            <h2 className="text-3xl sm:text-4xl font-sans text-stone-950 dark:text-white font-bold">Ce que disent nos clients</h2>
            <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
              Consultez les retours d'investisseurs locaux et d'expatriés de la diaspora qui ont fait confiance à notre rigueur professionnelle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((rev, i) => (
              <div
                key={i}
                className="bg-card border border-border p-8 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.stars)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-foreground/80 italic text-xs sm:text-sm leading-relaxed font-sans">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center text-sm">
                    {rev.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">{rev.name}</h4>
                    <span className="text-[10px] text-muted-foreground font-mono tracking-wider uppercase block mt-0.5">{rev.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
