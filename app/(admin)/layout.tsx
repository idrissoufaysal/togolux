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
    { name: 'Propriétés', href: '/admin/biens', icon: Building },
    { name: 'Visites', href: '/admin/visites', icon: Calendar },
    { name: 'Contacts & Leads', href: '/admin/contacts', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-stone-900 border-b border-stone-800">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-serif font-bold text-lg tracking-tight text-white">
            TogoLux <span className="text-sky-400 font-sans text-xs uppercase font-extrabold tracking-widest bg-sky-950/60 px-2 py-0.5 rounded border border-sky-900/40">Admin</span>
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-stone-400 hover:text-white transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-stone-900 border-r border-stone-800 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:flex`}
      >
        {/* Header logo */}
        <div className="h-20 flex items-center px-8 border-b border-stone-800 shrink-0">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-serif font-bold text-xl tracking-tight text-white">
              TogoLux <span className="text-sky-400 font-sans text-xs uppercase font-extrabold tracking-widest bg-sky-950/60 px-2 py-0.5 rounded border border-sky-900/40">Admin</span>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 group ${
                  isActive
                    ? 'bg-sky-500 text-stone-950 font-bold shadow-lg shadow-sky-500/10'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-stone-400 group-hover:text-white'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Profile & Exit */}
        <div className="p-4 border-t border-stone-800 space-y-3 bg-stone-950/40">
          <div className="flex items-center gap-3 px-2">
            <AgentAvatar nom="Directeur TogoLux" size="sm" className="border border-sky-500/20" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-white block truncate">Directeur</span>
              <span className="text-[10px] text-stone-500 block truncate">directeur@togolux.com</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Site</span>
            </Link>
            <button
              onClick={() => alert('Déconnexion...')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-red-950/40 text-stone-400 hover:text-red-400 border border-stone-800 hover:border-red-900/30 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
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
        <header className="hidden md:flex h-20 items-center justify-between px-8 bg-stone-900/60 border-b border-stone-800 shrink-0">
          <h2 className="text-sm font-mono uppercase tracking-widest text-stone-400 font-bold">
            {navigation.find((n) => n.href === pathname)?.name || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-950 border border-stone-850 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Base Connectée</span>
            </div>
          </div>
        </header>

        {/* Content body */}
        <main className="flex-1 p-6 md:p-8 bg-stone-950/40">
          <div className="max-w-7xl mx-auto animate-fade-in-up">
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
