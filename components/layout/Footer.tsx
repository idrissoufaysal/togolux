import * as React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Share2, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#24180e] text-stone-400 pt-16 pb-8 border-t border-[#3a2818]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              {/* House outline icon */}
              <svg 
                className="w-8 h-8 text-[#c5a373]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={1.2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <div className="leading-tight">
                <span className="font-serif font-bold tracking-[0.15em] text-sm block text-white">TOGOLUX</span>
                <span className="text-[10px] font-sans font-light tracking-[0.2em] block uppercase text-[#c5a373]">PRESTIGE</span>
              </div>
            </Link>
            <p className="text-xs text-stone-500 leading-relaxed max-w-xs pt-2">
              Leader de l'immobilier de luxe au Togo, nous accompagnons nos clients dans l'acquisition et la gestion de biens d'exception depuis plus d'une décennie.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:pl-8">
            <h4 className="text-white text-xs font-bold tracking-[0.15em] uppercase mb-5 font-sans">Navigation</h4>
            <ul className="space-y-3.5 text-xs text-stone-500">
              <li>
                <Link href="/" className="hover:text-[#c5a373] transition-colors">Nos Services</Link>
              </li>
              <li>
                <Link href="/biens" className="hover:text-[#c5a373] transition-colors">Expertise</Link>
              </li>
              <li>
                <a href="#agence" className="hover:text-[#c5a373] transition-colors">Notre Agence</a>
              </li>
              <li>
                <a href="#carrieres" className="hover:text-[#c5a373] transition-colors">Carrières</a>
              </li>
            </ul>
          </div>

          {/* Informations Links */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.15em] uppercase mb-5 font-sans">Informations</h4>
            <ul className="space-y-3.5 text-xs text-stone-500">
              <li>
                <a href="#mentions" className="hover:text-[#c5a373] transition-colors">Mentions Légales</a>
              </li>
              <li>
                <a href="#confidentialite" className="hover:text-[#c5a373] transition-colors">Confidentialité</a>
              </li>
              <li>
                <a href="#cgu" className="hover:text-[#c5a373] transition-colors">Conditions de Vente</a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white text-xs font-bold tracking-[0.15em] uppercase mb-5 font-sans">Contact</h4>
            <ul className="space-y-3.5 text-xs text-stone-500">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#c5a373]/80 shrink-0" />
                <a href="mailto:contact@togolux.com" className="hover:text-white transition-colors">contact@togolux.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#c5a373]/80 shrink-0" />
                <a href="tel:+22871902237" className="hover:text-white transition-colors">+228 71 90 22 37</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#c5a373]/80 shrink-0 mt-0.5" />
                <span>Boulevard du 13 Janvier, Lomé, Togo</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-[#3a2818]/20 flex items-center justify-between text-[11px] text-stone-600">
          <p>© {new Date().getFullYear()} TogoLux Prestige Immobilier. Tous droits réservés.</p>
          <div className="flex gap-4">
            <button className="hover:text-stone-400 transition-colors" title="Partager">
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button className="hover:text-stone-400 transition-colors" title="Langue">
              <Globe className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
