import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  Building2,
  Zap,
  Star,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Lock,
  Compass,
  Users2,
} from 'lucide-react';

export const revalidate = 3600; // Cache for 1 hour since content is brand-focused and static

export default async function HomePage() {
  const services = [
    {
      title: 'Locations Meublées & Standing',
      description: 'Une sélection rigoureuse d\'appartements modernes et villas de standing à Lomé, équipés pour les séjours de courte ou longue durée.',
      icon: Building2,
      badge: 'PRESTIGE',
    },
    {
      title: 'Transactions Immobilières Sécurisées',
      description: 'Achat et vente de terrains et propriétés avec audit complet des titres fonciers (OTR) pour éliminer tout risque de litige.',
      icon: ShieldCheck,
      badge: 'SÉCURITÉ',
    },
    {
      title: 'Rénovation & Suivi de Chantiers',
      description: 'Modernisation de biens existants et maîtrise d\'œuvre pour la diaspora. Suivez l\'avancement de vos projets l\'esprit tranquille.',
      icon: Zap,
      badge: 'CONFIANCE',
    },
  ];

  const safetyGuidelines = [
    {
      number: '01',
      title: 'Visite physique systématique',
      description: 'N\'effectuez aucun acompte sans avoir visité le bien ou mandaté un proche de confiance à Lomé pour inspecter les lieux.',
    },
    {
      number: '02',
      title: 'Vérification du Titre Foncier',
      description: 'Pour tout achat, nous exigeons et vérifions l\'authenticité des documents administratifs auprès du cadastre (OTR).',
    },
    {
      number: '03',
      title: 'Mandat officiel TogoLux',
      description: 'Chaque bien présenté sous notre enseigne dispose d\'un mandat clair signé par le propriétaire légitime.',
    },
    {
      number: '04',
      title: 'Communication d\'entreprise vérifiée',
      description: 'Échangez uniquement via nos canaux officiels. Notre équipe utilise un numéro WhatsApp Business unique et traçable.',
    },
    {
      number: '05',
      title: 'Contrat rédigé par un professionnel',
      description: 'Toutes les locations font l\'objet d\'un bail écrit selon les lois togolaises, protégeant équitablement propriétaire et locataire.',
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
    <div className="bg-[#fff8f5] text-[#221a14] selection:bg-[#c5a373] selection:text-white overflow-hidden">
      
      {/* 1. Hero Section - Full Background & Clean Overlay */}
      <section className="relative h-[80vh] min-h-[550px] w-full flex items-center pt-20 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80"
            alt="Immobilier de standing TogoLux à Lomé"
            className="w-full h-full object-cover object-center scale-100 animate-fade-in"
          />
          {/* Dark gradient overlay: transparent top/middle, very dark at the bottom to match brand colors */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1713] via-[#1c1713]/50 to-[#1c1713]/25" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6 text-left">
            <span className="text-[11px] font-mono tracking-widest text-[#fdd7a3] uppercase font-bold block">
              / BIENVENUE CHEZ TOGOLUX PROPERTIES
            </span>
            
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-serif tracking-tight leading-[1.08] text-white font-bold">
              Votre Propriété.<br />
              Votre Prestige.<br />
              Votre Histoire.
            </h1>
            
            <p className="text-stone-300 text-sm sm:text-base max-w-xl font-light leading-relaxed">
              Une collection exclusive de locations meublées et de biens de standing à Lomé, conçus avec exigence et sécurisés pour votre sérénité.
            </p>
            
            <div className="pt-2">
              <Link href="/biens">
                <Button 
                  id="hero-btn-explore"
                  className="bg-[#c5a373] hover:bg-[#b08e5e] text-[#1c1713] font-sans font-bold text-xs uppercase tracking-widest px-8 py-6 rounded-sm shadow-md transition-all active:scale-[0.98]"
                >
                  Explorer nos biens
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Notre Vision / Brand Manifesto (Warm Dark Section) */}
      <section className="bg-[#1c1713] text-[#fff8f5] py-24 px-4 sm:px-6 lg:px-8 relative">
        {/* Background light patterns */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[radial-gradient(#c5a373_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#c5a373]">
            Manifesto
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif tracking-tight leading-snug">
            « Nous bâtissons une passerelle de <br className="hidden sm:inline" />
            <span className="italic text-[#fdd7a3]">confiance</span> entre la diaspora et Lomé. »
          </h2>
          
          <div className="w-12 h-[1px] bg-[#c5a373] mx-auto my-6"></div>
          
          <p className="text-stone-300 font-light text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Face à l\'insécurité foncière et au manque de rigueur qui freinent de trop nombreux projets immobiliers au Togo, TogoLux Properties s\'engage à être votre garant. Que vous soyez à Paris, Montréal ou Lomé, nous allions la transparence juridique absolue à une esthétique contemporaine d\'exception.
          </p>
          
          <div className="inline-flex items-center gap-8 pt-4">
            <div className="text-left">
              <span className="block font-mono text-[10px] text-[#c5a373] uppercase tracking-wider">TikTok Officiel</span>
              <span className="block font-serif text-sm font-semibold mt-0.5">@togolux</span>
            </div>
            <div className="w-[1px] h-8 bg-stone-700"></div>
            <div className="text-left">
              <span className="block font-mono text-[10px] text-[#c5a373] uppercase tracking-wider">Facebook</span>
              <span className="block font-serif text-sm font-semibold mt-0.5">AppartementsLuxueuxTogo</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Expertises Section */}
      <section id="expertises" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-[#dec1ac]/40 gap-6">
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#755a30] font-bold block">
              Nos Pôles d\'Expertise
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1c1713] font-bold">
              Un accompagnement complet et transparent
            </h2>
          </div>
          <p className="text-[#80756d] font-light max-w-md text-xs sm:text-sm leading-relaxed">
            Nous avons structuré notre offre autour de trois piliers fondamentaux afin de répondre aux exigences de qualité, de rapidité et de sécurité juridique de nos clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((item, i) => (
            <div
              key={i}
              className="bg-[#fffbf9] border border-[#dec1ac]/30 hover:border-[#c5a373]/50 p-8 sm:p-10 rounded-2xl transition-all duration-350 shadow-sm hover:shadow-md group flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#c5a373]/10 text-[#755a30] flex items-center justify-center border border-[#c5a373]/15 group-hover:bg-[#c5a373] group-hover:text-white transition-all duration-300">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono text-[#80756d] tracking-widest font-bold border border-[#dec1ac]/30 px-2 py-0.5 rounded">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-[#1c1713]">{item.title}</h3>
                <p className="text-[#80756d] text-xs sm:text-sm leading-relaxed font-light">{item.description}</p>
              </div>
              <div className="pt-8 flex items-center gap-2 text-[#755a30] text-xs font-mono uppercase tracking-wider font-bold group-hover:text-[#1c1713] transition-colors">
                <span>En savoir plus</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. The Signature Element - Interactive Trust & Safety Charter */}
      <section className="bg-stone-900 text-[#fff8f5] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Absolute Background Accent */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#c5a373]/5 rounded-full filter blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Block: Charter Intro */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-mono text-[#c5a373] tracking-[0.25em] uppercase font-bold block">
              Charte de Sécurité & Vigilance
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
              5 Règles d\'Or pour votre sécurité immobilière au Togo
            </h2>
            <p className="text-stone-400 font-light text-xs sm:text-sm leading-relaxed">
              Chez TogoLux, nous appliquons une rigueur stricte pour éradiquer les fraudes et litiges. Voici les 5 vérifications indispensables que nous menons systématiquement pour chacun de vos projets immobiliers à Lomé.
            </p>
            
            {/* Visual warning callout */}
            <div className="p-5 rounded-xl bg-stone-950 border border-stone-850 space-y-2 mt-8">
              <span className="text-[10px] font-mono font-bold text-[#c5a373] tracking-wider uppercase block">
                🚨 RAPPEL DE PRUDENCE :
              </span>
              <p className="text-xs text-stone-400 font-light leading-relaxed">
                Ne versez jamais d\'acompte financier sans contrat rédigé à notre nom ou avant qu\'une visite de validation physique n\'ait été effectuée sur place.
              </p>
            </div>
          </div>

          {/* Right Block: Interactive Accordion-style Steps */}
          <div className="lg:col-span-7 space-y-4">
            {safetyGuidelines.map((guide, i) => (
              <div 
                key={i}
                className="bg-stone-950/80 border border-white/5 hover:border-[#c5a373]/30 p-6 rounded-xl transition-all duration-350 group"
              >
                <div className="flex gap-4 sm:gap-6 items-start">
                  <span className="font-mono text-sm sm:text-base font-bold text-[#c5a373]/70 group-hover:text-[#c5a373] transition-colors mt-0.5">
                    {guide.number}
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-serif font-bold text-white group-hover:text-[#fdd7a3] transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed">
                      {guide.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Social Media Hub (TikTok & Facebook spotlight) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Block: Image collage showing TikTok style */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 relative">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-[#dec1ac]/30 aspect-[3/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" 
                  alt="TikTok Villa triplex Baguida" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="bg-[#c5a373] text-white p-5 rounded-2xl flex flex-col justify-between aspect-square">
                <span className="font-mono text-[9px] tracking-wider uppercase font-bold">Populaire</span>
                <p className="text-base font-serif font-bold italic leading-tight">
                  Villa triplex avec piscine à Baguida
                </p>
                <span className="text-[10px] font-mono">15.8k vues</span>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="bg-[#322214] text-white p-5 rounded-2xl flex flex-col justify-between aspect-square">
                <span className="font-mono text-[9px] tracking-wider uppercase font-bold text-[#c5a373]">TikTok</span>
                <p className="text-base font-serif font-bold leading-tight">
                  Visites immersives à Lomé
                </p>
                <span className="text-[10px] font-mono text-stone-300">@togolux</span>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-[#dec1ac]/30 aspect-[3/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" 
                  alt="TikTok Appartements meublés Adidogomé" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Right Block: Call to Action to social networks */}
          <div className="lg:col-span-6 lg:pl-8 space-y-8">
            <span className="text-[10px] font-mono text-[#c5a373] tracking-[0.25em] uppercase font-bold block">
              Une communication moderne
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#1c1713] font-bold tracking-tight leading-tight">
              Suivez nos visites guidées en direct sur les réseaux
            </h2>
            <p className="text-[#80756d] font-light text-sm leading-relaxed">
              Nous cassons les codes de l\'immobilier classique en publiant régulièrement des visites vidéo immersives sur TikTok et Facebook. Nous y dévoilons en toute transparence l\'état réel des biens, les extérieurs et les quartiers (Adidogomé, Baguida, Avedji...).
            </p>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#dec1ac]/30 hover:border-[#c5a373] transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#1c1713] text-white flex items-center justify-center font-mono font-bold text-sm">
                  T
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold font-serif text-[#1c1713]">TikTok Officiel</h4>
                  <p className="text-xs text-[#80756d] font-light">Découvrez nos formats vidéo de visites immersives</p>
                </div>
                <a 
                  href="https://www.tiktok.com/@togolux" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#755a30] hover:text-[#1c1713] flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Suivre
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#dec1ac]/30 hover:border-[#c5a373] transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-sm">
                  f
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold font-serif text-[#1c1713]">Communauté Facebook</h4>
                  <p className="text-xs text-[#80756d] font-light">Annonces exclusives d\'appartements luxueux au Togo</p>
                </div>
                <a 
                  href="https://www.facebook.com/AppartementsLuxueuxTogo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#755a30] hover:text-[#1c1713] flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Rejoindre
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="bg-[#fff1e9] py-24 border-y border-[#dec1ac]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono tracking-widest text-[#755a30] uppercase font-bold block">
              Témoignages
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1c1713] font-bold">
              La parole à ceux qui nous font confiance
            </h2>
            <p className="text-[#80756d] text-xs sm:text-sm font-light">
              Découvrez les retours d\'investisseurs locaux et d\'expatriés de la diaspora qui ont fait confiance à notre rigueur professionnelle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((rev, i) => (
              <div
                key={i}
                className="bg-white border border-[#dec1ac]/20 p-8 sm:p-10 rounded-2xl shadow-sm flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(rev.stars)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-[#c5a373] text-[#c5a373]" />
                    ))}
                  </div>
                  <p className="text-[#1c1713]/85 italic text-sm leading-relaxed font-serif">
                    « {rev.comment} »
                  </p>
                </div>
                
                <div className="flex items-center gap-3 pt-6 border-t border-stone-100">
                  <div className="w-10 h-10 rounded-full bg-[#c5a373]/10 text-[#755a30] font-bold font-serif flex items-center justify-center text-sm">
                    {rev.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#1c1713]">{rev.name}</h4>
                    <span className="text-[9px] text-[#80756d] font-mono tracking-wider uppercase block mt-0.5">
                      {rev.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Call To Action Final (Contact prompt) */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-8">
        <span className="text-[10px] font-mono text-[#c5a373] tracking-[0.3em] uppercase font-bold block">
          Démarrer un projet
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif text-[#1c1713] font-bold leading-tight">
          Prêt à sécuriser votre investissement à Lomé ?
        </h2>
        <p className="text-[#80756d] max-w-xl mx-auto font-light text-sm sm:text-base leading-relaxed">
          Que vous recherchiez une location meublée pour vos vacances ou un audit de terrain pour un achat foncier, notre équipe vous répond sous 24 heures.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          {/* WhatsApp Primary Contact */}
          <a 
            href="https://wa.me/22890000000" // Replace with verified WhatsApp number if known, otherwise placeholder pattern as required
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button 
              id="cta-btn-whatsapp"
              className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-sans font-bold text-xs uppercase tracking-widest px-8 py-6 rounded-sm shadow-md flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Contacter via WhatsApp
            </Button>
          </a>
          
          <Link href="/biens" className="w-full sm:w-auto">
            <Button 
              id="cta-btn-catalog"
              variant="outline"
              className="w-full border-2 border-[#322214] text-[#322214] hover:bg-[#322214]/5 font-sans font-bold text-xs uppercase tracking-widest px-8 py-6 rounded-sm"
            >
              Parcourir le catalogue
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
