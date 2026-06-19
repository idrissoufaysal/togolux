'use client';

import * as React from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Building2, AlertCircle, ArrowLeft } from 'lucide-react';
import { loginAdmin } from '@/app/(admin)/(dashboard)/admin/auth-actions';

export default function AdminLoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Veuillez remplir tous les champs.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('email', email.trim());
      formData.append('password', password);

      const result = await loginAdmin(formData);

      if (result.success) {
        // Securely redirect to dashboard, forcing page refresh to load SSR state
        window.location.href = '/admin';
      } else {
        setErrorMsg(result.error || 'Identifiants invalides.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Une erreur est survenue lors de la connexion.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#221a14] flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Decorative luxury gradient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#c5a373]/10 to-[#dec1ac]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Brand logo at the top */}
      <div className="mb-8 flex flex-col items-center text-center z-10">
        <div className="w-12 h-12 bg-[#322214] text-[#c5a373] rounded-full flex items-center justify-center shadow-lg border border-[#c5a373]/20 mb-3 animate-fade-in">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl tracking-wider text-[#322214] font-bold">
          PRESTIGE
        </h1>
        <p className="text-xs uppercase tracking-widest text-[#80756d] font-bold mt-1">
          Portail TogoLux Admin
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-[#dec1ac]/50 rounded-2xl shadow-xl p-8 z-10 hover:shadow-2xl transition-all duration-300">
        <h2 className="font-serif text-xl text-[#322214] font-bold mb-2">
          Connexion
        </h2>
        <p className="text-xs text-[#80756d] mb-6">
          Veuillez saisir vos accès administrateur pour gérer le catalogue et les visites.
        </p>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 leading-normal font-medium">{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#80756d]">
              Adresse E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#80756d]" />
              <input
                type="email"
                required
                disabled={isLoading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@togolux.com"
                className="w-full pl-10 pr-4 py-3 bg-[#fff8f5]/50 border border-[#dec1ac]/60 rounded-xl text-xs focus:outline-none focus:border-[#c5a373] focus:ring-1 focus:ring-[#c5a373] transition-all disabled:opacity-50 text-[#221a14]"
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#80756d]">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#80756d]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-12 py-3 bg-[#fff8f5]/50 border border-[#dec1ac]/60 rounded-xl text-xs focus:outline-none focus:border-[#c5a373] focus:ring-1 focus:ring-[#c5a373] transition-all disabled:opacity-50 text-[#221a14]"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#80756d] hover:text-[#322214] transition-colors focus:outline-none"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#322214] hover:bg-[#322214]/90 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-white/5 active:scale-[0.99] duration-150"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Se connecter'
            )}
          </button>
        </form>
      </div>

      {/* Back button to the main site */}
      <Link
        href="/"
        className="mt-8 flex items-center gap-2 text-xs text-[#80756d] hover:text-[#322214] font-bold uppercase tracking-wider transition-colors z-10 group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        <span>Retour au site principal</span>
      </Link>
    </div>
  );
}
