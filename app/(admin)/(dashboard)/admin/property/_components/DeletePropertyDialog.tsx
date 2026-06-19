"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { deleteProperty } from '../../actions';

interface DeletePropertyDialogProps {
  propertyId: string;
  title: string;
}

export function DeletePropertyDialog({ propertyId, title }: DeletePropertyDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMsg(null);
    try {
      const res = await deleteProperty(propertyId);
      if (res.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        setErrorMsg(res.error || "Une erreur s'est produite lors de la suppression.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Une erreur s'est produite lors de la suppression.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="p-2 text-[#80756d] hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
          title="Supprimer le bien"
        >
          <Trash2 className="w-4.5 h-4.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] border-[#dec1ac]/60 rounded-2xl bg-white p-6 shadow-xl gap-0">
        <DialogHeader className="space-y-3 mb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-base font-sans font-bold text-[#322214]">
            Supprimer le bien immobilier ?
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-[#80756d] font-sans leading-relaxed">
            Êtes-vous sûr de vouloir supprimer le bien <span className="font-bold text-[#322214]">« {title} »</span> ? Cette action est irréversible et supprimera également toutes les visites associées et les images du stockage.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[11px] font-medium rounded-xl text-center mb-4">
            {errorMsg}
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full sm:justify-end">
          <button
            type="button"
            disabled={isDeleting}
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto px-4 py-2.5 bg-white border border-[#dec1ac]/65 hover:bg-[#fff1e9]/30 text-[#322214] rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="w-full sm:w-auto px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Suppression...</span>
              </>
            ) : (
              <span>Confirmer la suppression</span>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
