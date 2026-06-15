"use client"
import * as React from 'react';
import { useState } from 'react';
import { Upload, X, Loader2, FileImage } from 'lucide-react';
import { cn } from './utils';

// We import the public insforge client
import { insforge } from '@/lib/insforge';
import { PropertyImage } from '@/types';

interface ImageUploadProps {
  images: PropertyImage[];
  onChange: (images: PropertyImage[]) => void;
  bucketName?: string;
  maxImages?: number;
  className?: string;
}

export function ImageUpload({
  images,
  onChange,
  bucketName = 'property-images',
  maxImages = 10,
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      setErrorMsg(`Vous ne pouvez pas ajouter plus de ${maxImages} images.`);
      return;
    }

    setErrorMsg(null);
    setIsUploading(true);

    const uploadedList: PropertyImage[] = [...images];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]!;

        // Upload to InsForge Storage using uploadAuto
        const { data, error } = await insforge.storage
          .from(bucketName)
          .uploadAuto(file);

        if (error || !data) {
          throw error || new Error("Erreur lors de l'envoi du fichier.");
        }

        uploadedList.push({
          id: data.key, // Use storage key as the unique id
          name: file.name,
          url: data.url,
        });
      }

      onChange(uploadedList);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Une erreur s'est produite lors de l'envoi.");
    } finally {
      setIsUploading(false);
      // Clear input
      e.target.value = '';
    }
  };

  const handleRemoveImage = async (imageToRemove: PropertyImage) => {
    try {
      // Delete from storage using remove()
      const { error } = await insforge.storage
        .from(bucketName)
        .remove(imageToRemove.id); // The id is the storage key

      if (error) {
        console.error("Erreur suppression stockage:", error);
      }

      // Filter out of list
      const updatedList = images.filter((img) => img.id !== imageToRemove.id);
      onChange(updatedList);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap gap-4">
        {/* Previews */}
        {images.map((image) => (
          <div
            key={image.id}
            className="relative w-28 h-28 rounded-2xl overflow-hidden group border border-stone-200 bg-stone-50 dark:border-stone-800"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(image)}
              className="absolute top-1.5 right-1.5 p-1 bg-stone-900/80 text-white rounded-full hover:bg-stone-950 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {/* Upload Button */}
        {images.length < maxImages && (
          <label
            className={cn(
              'flex flex-col items-center justify-center w-28 h-28 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-800 hover:border-sky-500 hover:bg-sky-50/10 transition-all cursor-pointer relative',
              isUploading && 'opacity-60 pointer-events-none'
            )}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-sky-500 animate-spin" />
            ) : (
              <Upload className="w-6 h-6 text-stone-400 group-hover:text-sky-500" />
            )}
            <span className="text-[10px] text-stone-500 font-sans mt-2 font-medium">
              {isUploading ? 'Envoi...' : 'Ajouter'}
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        )}
      </div>

      {errorMsg && (
        <p className="text-xs text-red-500 font-sans font-medium">{errorMsg}</p>
      )}
    </div>
  );
}
