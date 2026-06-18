'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building,
  Calendar,
  Mail,
  ArrowLeft,
  Home,
  Menu,
  X,
  User,
  Search,
  Bell,
  Plus,
} from 'lucide-react';
import { AgentAvatar } from '@/components/ui/AgentAvatar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
    { name: 'Propriétés', href: '/admin/property', icon: Building },
    { name: 'Visites', href: '/admin/visites', icon: Calendar },
    { name: 'Contacts & Leads', href: '/admin/contacts', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#221a14] flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-[#322214] border-b border-white/10 text-white">
        <Link href="/admin" className="flex flex-col">
          <span className="font-sans font-bold text-md tracking-tight text-white">
            PRESTIGE
          </span>
          <span className="text-[#c5a373] font-sans text-[8px] uppercase font-bold tracking-widest leading-none">
            TogoLux Admin
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white/70 hover:text-white transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#322214] border-r border-[#322214] flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:flex`}
      >
        {/* Header logo */}
        <div className="h-20 flex items-center px-8 border-b border-white/10 shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-sans font-black text-xl tracking-wider text-white flex flex-col leading-tight">
              PRESTIGE
              <span className="text-[#c5a373] font-sans text-[10px] uppercase font-bold tracking-widest leading-none mt-0.5">
                TogoLux Admin
              </span>
            </span>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-sans font-medium uppercase tracking-wider transition-all duration-200 group ${
                  isActive
                    ? 'bg-white/10 text-[#c5a373] border-[#c5a373] shadow-sm'
                    : 'text-white/75 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-[#c5a373]' : 'text-white/60 group-hover:text-white'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Profile & Exit */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-black/15">
          <div className="flex items-center gap-3 px-2">
            <AgentAvatar nom="Directeur TogoLux" size="sm" className="border border-white/15" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">Directeur</span>
              <span className="text-[10px] text-white/50 block truncate">directeur@togolux.com</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              <Home className="w-3.5 h-3.5 text-[#c5a373]" />
              <span>Site</span>
            </Link>
            <button
              onClick={() => alert('Déconnexion...')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-red-950/20 text-white/80 hover:text-red-400 border border-white/10 hover:border-red-950/30 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quitter</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Panel */}
        <header className="hidden md:flex h-20 items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-[#dec1ac]/60 shrink-0 sticky top-0 z-40">
          <div className="flex flex-col">
            <h2 className="text-sm font-sans uppercase tracking-widest text-[#80756d] font-bold">
              {navigation.find((n) => n.href === pathname)?.name || 'Tableau de bord'}
            </h2>
            <span className="text-xs text-[#80756d]/80 mt-0.5">
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#80756d]" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 bg-[#fff1e9]/50 border border-[#dec1ac]/40 rounded-full text-xs focus:outline-none focus:border-[#c5a373] transition-all w-60 text-[#221a14]"
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="text-[#322214] hover:text-[#c5a373] transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500" />
              </button>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E9F0EC] border border-[#d2e4db] rounded-xl">
                <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
                <span className="text-[10px] font-sans text-[#2D6A4F] uppercase tracking-widest font-bold">
                  Base Connectée
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-6 md:p-8 bg-[#fff8f5]/40">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
        />
      )}
    </div>
  );
}
