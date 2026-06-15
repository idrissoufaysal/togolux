'use client';

import * as React from 'react';
import { useState } from 'react';
import { createVisit } from '../../actions';
import { Calendar, User, Phone, Mail, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';

interface VisitFormProps {
  propertyId: string;
}

export function VisitForm({ propertyId }: VisitFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const nom = formData.get('nom') as string;
    const email = formData.get('email') as string;
    const telephone = formData.get('telephone') as string;
    const date = formData.get('date') as string;
    const message = formData.get('message') as string;

    if (!nom || !email || !telephone || !date) {
      setErrorMsg('Veuillez remplir tous les champs obligatoires.');
      setIsPending(false);
      return;
    }

    try {
      const res = await createVisit({
        propertyId,
        nom,
        email,
        telephone,
        date,
        message,
      });

      if (res.success) {
        setSuccess(true);
        e.currentTarget.reset();
      } else {
        setErrorMsg(res.error || 'Erreur lors de la réservation.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur inattendue est survenue.');
    } finally {
      setIsPending(false);
    }
  };
  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-xl text-center space-y-4 animate-fade-in-up">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <h3 className="text-base font-bold text-stone-900">Demande de visite reçue !</h3>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Votre demande de visite a été enregistrée avec succès. Notre équipe ou l'agent en charge prendra contact avec vous très rapidement par e-mail ou WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-200/80 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-stone-950 font-sans">Réserver une visite</h3>
        <p className="text-stone-500 text-xs">
          Planifiez un rendez-vous physique ou une visite vidéo par WhatsApp.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block">
            Nom Complet *
          </label>
          <div className="flex items-center bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5">
            <User className="w-4 h-4 text-stone-400 mr-2.5 shrink-0" />
            <input
              type="text"
              name="nom"
              required
              placeholder="Ex: Kouame Koffi"
              className="bg-transparent text-stone-900 text-xs sm:text-sm border-none outline-none w-full placeholder-stone-450"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block">
            Email *
          </label>
          <div className="flex items-center bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5">
            <Mail className="w-4 h-4 text-stone-400 mr-2.5 shrink-0" />
            <input
              type="email"
              name="email"
              required
              placeholder="Ex: koffi@mail.com"
              className="bg-transparent text-stone-900 text-xs sm:text-sm border-none outline-none w-full placeholder-stone-450"
            />
          </div>
        </div>

        {/* Téléphone */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block">
            Téléphone (WhatsApp) *
          </label>
          <div className="flex items-center bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5">
            <Phone className="w-4 h-4 text-stone-400 mr-2.5 shrink-0" />
            <input
              type="tel"
              name="telephone"
              required
              placeholder="Ex: +228 90 00 00 00"
              className="bg-transparent text-stone-900 text-xs sm:text-sm border-none outline-none w-full placeholder-stone-450"
            />
          </div>
        </div>

        {/* Date */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block">
            Date de visite souhaitée *
          </label>
          <div className="flex items-center bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5">
            <Calendar className="w-4 h-4 text-stone-400 mr-2.5 shrink-0" />
            <input
              type="datetime-local"
              name="date"
              required
              className="bg-transparent text-stone-900 text-xs sm:text-sm border-none outline-none w-full cursor-pointer"
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 block">
            Message additionnel
          </label>
          <div className="flex bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5">
            <MessageSquare className="w-4 h-4 text-stone-400 mr-2.5 mt-1 shrink-0" />
            <textarea
              name="message"
              rows={3}
              placeholder="Ex: Je souhaite une visite vidéo par WhatsApp..."
              className="bg-transparent text-stone-900 text-xs sm:text-sm border-none outline-none w-full resize-none placeholder-stone-450"
            />
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs text-red-500 font-sans font-medium">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#755a30] hover:bg-[#5f4826] text-white font-sans font-bold text-xs uppercase tracking-widest py-3.5 rounded-sm transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Envoi en cours...</span>
            </>
          ) : (
            <span>Envoyer la demande</span>
          )}
        </button>
      </form>
    </div>
  );
}
