'use client';

import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Accueil', href: '/' },
    { name: 'Nos Biens', href: '/biens' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-100 dark:border-stone-800/80 text-stone-800 dark:text-stone-200 shadow-sm transition-all duration-350">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Branding */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2.5">
              {/* Fine house outline icon */}
              <svg 
                className="w-8 h-8 text-[#755a30]" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={1.2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <div className="leading-tight">
                <span className="font-serif font-bold tracking-[0.15em] text-sm block text-stone-900 dark:text-white">TOGOLUX</span>
                <span className="text-[10px] font-sans font-light tracking-[0.2em] block uppercase text-[#c5a373]">PRESTIGE</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href.startsWith('/#') && pathname === '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-1 py-2 text-xs font-sans font-semibold uppercase tracking-wider transition-all duration-300 relative ${
                    isActive
                      ? 'text-stone-900 dark:text-white'
                      : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c5a373] animate-slide-in" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Action CTA */}
          <div className="hidden md:flex items-center">
            <Link
              href="/contact"
              className="bg-[#755a30] hover:bg-[#5f4826] text-white font-sans font-bold text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-sm transition-all duration-300 shadow-sm active:scale-[0.98]"
            >
              NOUS CONTACTER
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-white/5 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-stone-900 border-t border-stone-150 dark:border-stone-800/80 py-4 px-4 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`w-full text-left px-4 py-3 rounded-md text-sm font-semibold transition-all ${
                  pathname === item.href
                    ? 'text-[#755a30] bg-stone-50 dark:bg-white/5'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-[#755a30] hover:bg-[#5f4826] text-white font-sans font-bold text-center py-3.5 rounded-sm text-xs tracking-wider uppercase"
            >
              NOUS CONTACTER
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
