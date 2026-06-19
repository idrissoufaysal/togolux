import * as React from 'react';
import type { Metadata } from 'next';
import { Mail, MapPin, ShieldCheck, MessageSquare, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contactez-nous — TogoLux Properties',
  description:
    "Prenez contact avec TogoLux Properties pour vos projets d'achat, de vente, de gestion locative meublée ou de rénovation immobilière à Lomé, Togo.",
  keywords: [
    'contact togolux',
    'agence immobiliere lome contact',
    'louer appartement lome',
    'investir togo diaspora',
  ],
};

export default function ContactPage() {
  return (
    <div className="bg-[#fff8f5] text-[#221a14] min-h-[85vh] selection:bg-[#c5a373] selection:text-white">
      
      {/* 1. Hero Section - Simple, Clean and Attractive */}
      <section className="relative bg-[#1c1713] text-[#fff8f5] py-20 lg:py-28 text-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/contact-hero.jpg')" }}
        ></div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1713]/95 via-[#1c1713]/75 to-[#1c1713]/60"></div>
        {/* Background Subtle Pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay bg-[radial-gradient(#c5a373_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-[10px] font-mono tracking-widest text-[#c5a373] uppercase font-bold block animate-fade-in">
            / ENTRER EN RELATION
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
            Contactez TogoLux
          </h1>
          <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed max-w-xl mx-auto">
            Une agence à votre écoute, de Lomé à l'international, pour vous guider en toute confiance et transparence.
          </p>
        </div>
      </section>

      {/* 2. Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          
          {/* Left Column: Contact info & Socials */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-serif text-[#1c1713] font-bold">
                Nos Coordonnées
              </h2>
              
              <div className="space-y-4">
                {/* WhatsApp Line */}
                <div className="flex gap-4 items-start p-4 rounded-xl bg-white border border-[#dec1ac]/20 hover:border-[#c5a373] transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-[#25D366]/10 text-[#20ba5a] flex items-center justify-center border border-[#25D366]/15 group-hover:bg-[#25D366] group-hover:text-white transition-all duration-300">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-[#80756d] tracking-wider uppercase">WhatsApp Vérifié</span>
                    <a
                      href="https://wa.me/22890000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-serif font-bold text-[#1c1713] hover:text-[#755a30] transition-colors flex items-center gap-1.5 mt-0.5"
                    >
                      +228 90 00 00 00
                      <ExternalLink className="w-3.5 h-3.5 opacity-65" />
                    </a>
                  </div>
                </div>

                {/* Email Line */}
                <div className="flex gap-4 items-start p-4 rounded-xl bg-white border border-[#dec1ac]/20 hover:border-[#c5a373] transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-[#c5a373]/10 text-[#755a30] flex items-center justify-center border border-[#c5a373]/15 group-hover:bg-[#c5a373] group-hover:text-white transition-all duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-[#80756d] tracking-wider uppercase">E-mail Officiel</span>
                    <a
                      href="mailto:contact@togolux.com"
                      className="text-sm font-serif font-bold text-[#1c1713] hover:text-[#755a30] transition-colors block mt-0.5"
                    >
                      contact@togolux.com
                    </a>
                  </div>
                </div>

                {/* Location Line */}
                <div className="flex gap-4 items-start p-4 rounded-xl bg-white border border-[#dec1ac]/20 hover:border-[#c5a373] transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-[#322214]/10 text-[#322214] flex items-center justify-center border border-[#322214]/15 group-hover:bg-[#322214] group-hover:text-white transition-all duration-300">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-[#80756d] tracking-wider uppercase">Bureaux physiques</span>
                    <span className="block text-sm font-serif font-bold text-[#1c1713] mt-0.5">
                      Adidogomé & Baguida, Lomé — Togo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Networks List */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-serif text-[#1c1713] font-bold">
                Suivez-nous sur les réseaux
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href="https://www.tiktok.com/@togolux"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[#dec1ac]/20 hover:border-[#c5a373] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1c1713] text-white flex items-center justify-center font-mono font-bold text-xs">
                    T
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-[#80756d] uppercase tracking-wider">TikTok</span>
                    <span className="block text-xs font-serif font-bold text-[#1c1713] group-hover:text-[#755a30] transition-colors">
                      @togolux
                    </span>
                  </div>
                </a>

                <a
                  href="https://www.facebook.com/AppartementsLuxueuxTogo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border border-[#dec1ac]/20 hover:border-[#c5a373] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                    f
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-[#80756d] uppercase tracking-wider">Facebook</span>
                    <span className="block text-xs font-serif font-bold text-[#1c1713] group-hover:text-[#755a30] transition-colors">
                      AppartementsLuxueuxTogo
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Safety Protocol */}
            <div className="p-6 rounded-2xl bg-stone-900 text-stone-100 space-y-3 border border-stone-850">
              <div className="flex items-center gap-2 text-[#c5a373]">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[9px] font-mono tracking-widest uppercase font-bold">
                  Protocole de Sécurité & Vigilance
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-light">
                Pour garantir la sécurité de votre projet immobilier, nous effectuons des visites physiques systématiques et vérifions l'authenticité de tous les mandats fonciers.
              </p>
            </div>
          </div>

          {/* Right Column: Google Maps Iframe */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#1c1713] font-bold">
              Notre Localisation
            </h2>
            
            <div className="w-full flex-1 min-h-[400px] lg:min-h-[450px] rounded-2xl overflow-hidden shadow-md border border-[#dec1ac]/30 relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12539.729950070658!2d1.1447289764404296!3d6.205749647546703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10215f39f554fe1d%3A0x6ab3c94441df80fa!2sTogoLux%20Properties!5e1!3m2!1sfr!2stg!4v1781872214019!5m2!1sfr!2stg"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
