"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { universities } from "@/lib/data";
import { cn } from "@/lib/utils";

export type Filters = {
  query: string;
  university: string;
  type: "all" | "hostel" | "mess";
  gender: "all" | "boys" | "girls" | "co-ed";
  maxPrice: number;
  availableOnly: boolean;
};

const TYPE_OPTIONS: { label: string; value: Filters["type"] }[] = [
  { label: "All", value: "all" },
  { label: "Hostels", value: "hostel" },
  { label: "Mess", value: "mess" },
];

export function FilterBar({ onChange }: { onChange: (f: Filters) => void }) {
  const [filters, setFilters] = useState<Filters>({
    query: "",
    university: "All",
    type: "all",
    gender: "all",
    maxPrice: 20000,
    availableOnly: false,
  });

  function update(next: Partial<Filters>) {
    const merged = { ...filters, ...next };
    setFilters(merged);
    onChange(merged);
  }

  return (
    <div className="-mt-12 relative z-20 mx-auto max-w-4xl px-5">
      <div className="bg-paper text-ink rounded-md shadow-xl shadow-black/30 p-4 sm:p-5">
        <div className="flex items-center gap-2 border border-ink/15 rounded-sm px-3 py-2 bg-white/50">
          <Search size={16} className="text-ink/50 shrink-0" />
          <input
            value={filters.query}
            onChange={(e) => update({ query: e.target.value })}
            placeholder="Search by name, area, or university..."
            className="w-full bg-transparent outline-none text-sm placeholder:text-ink/40"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <select
            value={filters.university}
            onChange={(e) => update({ university: e.target.value })}
            className="text-xs font-mono px-2.5 py-1.5 rounded-sm border border-ink/15 bg-white/50"
          >
            <option>All</option>
            {universities.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>

          <div className="flex rounded-sm overflow-hidden border border-ink/15">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update({ type: opt.value })}
                className={cn(
                  "text-xs font-mono px-3 py-1.5 transition-colors",
                  filters.type === opt.value
                    ? "bg-board text-chalk"
                    : "bg-white/50 hover:bg-white/80"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <select
            value={filters.gender}
            onChange={(e) => update({ gender: e.target.value as Filters["gender"] })}
            className="text-xs font-mono px-2.5 py-1.5 rounded-sm border border-ink/15 bg-white/50"
          >
            <option value="all">Any gender</option>
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
            <option value="co-ed">Co-ed</option>
          </select>

          <label className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded-sm border border-ink/15 bg-white/50 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(e) => update({ availableOnly: e.target.checked })}
              className="accent-marker"
            />
            Available only
          </label>

          <div className="flex items-center gap-2 text-xs font-mono ml-auto">
            <span className="text-ink/60">Up to Rs {filters.maxPrice.toLocaleString()}</span>
            <input
              type="range"
              min={4000}
              max={20000}
              step={500}
              value={filters.maxPrice}
              onChange={(e) => update({ maxPrice: Number(e.target.value) })}
              className="accent-marker w-28"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
