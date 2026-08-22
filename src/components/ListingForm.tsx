"use client";

import { useState, FormEvent } from "react";
import { universities } from "@/lib/data";
import type { ListingFormValues, OwnerListing } from "@/lib/owner";
import { ImageUpload } from "@/components/ImageUpload";

type Props = {
  initial?: OwnerListing;
  submitting: boolean;
  onSubmit: (values: ListingFormValues) => void;
  submitLabel: string;
};

export function ListingForm({ initial, submitting, onSubmit, submitLabel }: Props) {
  const [type, setType] = useState<"hostel" | "mess">(initial?.type ?? "hostel");
  const [name, setName] = useState(initial?.name ?? "");
  const [university, setUniversity] = useState(initial?.university ?? universities[0]);
  const [gender, setGender] = useState<"boys" | "girls" | "co-ed">(initial?.gender ?? "co-ed");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [distanceKm, setDistanceKm] = useState(initial?.distanceKm?.toString() ?? "1");
  const [roomType, setRoomType] = useState(initial?.roomType ?? "single");
  const [mealPlan, setMealPlan] = useState(initial?.mealPlan ?? "2-time");
  const [tagsInput, setTagsInput] = useState(initial?.tags?.join(", ") ?? "");
  const [whatsappNumber, setWhatsappNumber] = useState(initial?.whatsappNumber ?? "");
  const [available, setAvailable] = useState(initial?.available ?? true);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [error, setError] = useState<string | null>(null);

  // Groups uploaded photos under one storage folder. Editing an existing
  // listing uses its id; a brand-new listing gets a client-side id so
  // uploads have somewhere to live before the listing is saved.
  const [folderId] = useState(() => initial?.id ?? crypto.randomUUID());

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !university || !price || !whatsappNumber) {
      setError("Please fill in all required fields.");
      return;
    }
    const priceNum = Number(price);
    if (!priceNum || priceNum <= 0) {
      setError("Enter a valid price.");
      return;
    }

    onSubmit({
      type,
      name,
      university,
      gender,
      price: priceNum,
      distanceKm: Number(distanceKm) || 0,
      roomType: type === "hostel" ? roomType : undefined,
      mealPlan: type === "mess" ? mealPlan : undefined,
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      whatsappNumber: whatsappNumber.replace(/\D/g, ""),
      available,
      images,
    });
  };

  const inputClass =
    "mt-1 w-full border border-ink/15 rounded-sm px-3 py-2 text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-board";
  const labelClass = "text-xs font-mono uppercase tracking-wide text-ink/60";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Listing type</label>
        <div className="mt-1 flex rounded-sm overflow-hidden border border-ink/15">
          {(["hostel", "mess"] as const).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 py-2 text-sm font-mono capitalize transition ${
                type === t ? "bg-board text-chalk" : "bg-white/50 text-ink/70"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="e.g. Al-Madina Boys Hostel"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>University</label>
          <select
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className={inputClass}
          >
            {universities.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as typeof gender)}
            className={inputClass}
          >
            <option value="co-ed">Co-ed</option>
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Price (Rs/month)</label>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
            placeholder="12000"
          />
        </div>
        <div>
          <label className={labelClass}>Distance from campus (km)</label>
          <input
            type="number"
            min={0}
            step={0.1}
            value={distanceKm}
            onChange={(e) => setDistanceKm(e.target.value)}
            className={inputClass}
            placeholder="0.6"
          />
        </div>
      </div>

      {type === "hostel" ? (
        <div>
          <label className={labelClass}>Room type</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className={inputClass}
          >
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="triple">Triple</option>
          </select>
        </div>
      ) : (
        <div>
          <label className={labelClass}>Meal plan</label>
          <select
            value={mealPlan}
            onChange={(e) => setMealPlan(e.target.value)}
            className={inputClass}
          >
            <option value="2-time">2-time</option>
            <option value="3-time">3-time</option>
          </select>
        </div>
      )}

      <div>
        <label className={labelClass}>Photos</label>
        <div className="mt-1">
          <ImageUpload images={images} onChange={setImages} folderId={folderId} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Tags (comma-separated)</label>
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className={inputClass}
          placeholder="AC rooms, WiFi, Laundry"
        />
      </div>

      <div>
        <label className={labelClass}>WhatsApp number</label>
        <input
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          className={inputClass}
          placeholder="923001234567 (with country code, no + or spaces)"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink/80">
        <input
          type="checkbox"
          checked={available}
          onChange={(e) => setAvailable(e.target.checked)}
        />
        Currently available
      </label>

      {error && (
        <p className="text-sm text-marker bg-marker/10 border border-marker/20 rounded-sm px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-board text-chalk font-medium py-2.5 rounded-sm hover:brightness-110 transition disabled:opacity-50"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}