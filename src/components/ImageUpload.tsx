"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { uploadListingImage, deleteListingImage, ImageUploadError } from "@/lib/uploadImage";
import { isSupabaseConfigured } from "@/lib/supabase";

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
  folderId: string;
  max?: number;
};

export function ImageUpload({ images, onChange, folderId, max = 6 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);

    const slotsLeft = max - images.length;
    if (slotsLeft <= 0) {
      setError(`You can upload up to ${max} photos.`);
      return;
    }

    const selected = Array.from(files).slice(0, slotsLeft);
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of selected) {
        uploaded.push(await uploadListingImage(file, folderId));
      }
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err instanceof ImageUploadError ? err.message : "Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = (url: string) => {
    onChange(images.filter((img) => img !== url));
    deleteListingImage(url).catch(() => {});
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {images.map((url, i) => (
          <div
            key={url}
            className="relative aspect-square rounded-sm overflow-hidden border border-ink/15 group"
          >
            {/* Supabase-hosted photos: plain <img> avoids coupling next/image
                remotePatterns to a specific project ref. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="Listing photo" className="h-full w-full object-cover" />
            {i === 0 && (
              <span className="absolute bottom-1 left-1 text-[9px] font-mono uppercase tracking-wide bg-black/60 text-white px-1.5 py-0.5 rounded-sm">
                Cover
              </span>
            )}
            <button
              type="button"
              onClick={() => handleRemove(url)}
              aria-label="Remove photo"
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition"
            >
              <X size={13} />
            </button>
          </div>
        ))}

        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-sm border border-dashed border-ink/25 flex flex-col items-center justify-center gap-1 text-ink/50 hover:border-ink/40 hover:text-ink/70 transition disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ImagePlus size={18} />
            )}
            <span className="text-[11px] font-mono">{uploading ? "Uploading" : "Add photo"}</span>
          </button>
        )}
              <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      </div>

      <p className="mt-1.5 text-[11px] text-ink/45">
        Up to {max} photos, 5MB each (JPG, PNG, WEBP). First photo is used as the cover.
      </p>
      {!isSupabaseConfigured && (
        <p className="mt-1 text-xs text-marker">
          Photo uploads aren&apos;t configured yet — add Supabase keys to .env.local.
        </p>
      )}
      {error && <p className="mt-1 text-xs text-marker">{error}</p>}
    </div>
  );
}