"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, User } from "lucide-react";

const CITIES = [
  "Bamberg", "München", "Berlin", "Hamburg", "Frankfurt", "Köln",
  "Stuttgart", "Düsseldorf", "Leipzig", "Dresden", "Nürnberg",
  "Hannover", "Bremen", "Dortmund", "Essen", "Bonn", "Mannheim",
  "Karlsruhe", "Augsburg", "Wiesbaden",
];

interface HeroSearchProps {
  /** compact=true: stacked layout for the card widget */
  compact?: boolean;
}

export default function HeroSearch({ compact = false }: HeroSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (city) params.set("city", city);
    router.push(`/fahrer?${params.toString()}`);
  };

  if (compact) {
    return (
      <form onSubmit={handleSearch} role="search" aria-label="Fahrer suchen" className="space-y-3">
        <div>
          <label htmlFor="hero-name" className="block text-xs font-medium text-gray-500 mb-1.5">
            Fahrername oder Unternehmen
          </label>
          <div className="relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="hero-name"
              type="search"
              placeholder="z. B. Max Mustermann"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Name oder Unternehmen"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-taxi-blue placeholder-gray-400 focus:border-taxi-yellow focus:ring-2 focus:ring-taxi-yellow/20 outline-none text-sm bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="hero-city" className="block text-xs font-medium text-gray-500 mb-1.5">
            Stadt
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
            <select
              id="hero-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label="Stadt auswählen"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-taxi-blue focus:border-taxi-yellow focus:ring-2 focus:ring-taxi-yellow/20 outline-none text-sm bg-white appearance-none cursor-pointer transition-all"
            >
              <option value="">Alle Städte</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-taxi-yellow hover:bg-taxi-yellow-dark text-taxi-blue font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          Suchen
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      role="search"
      aria-label="Fahrer suchen"
      className="w-full max-w-2xl"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Name, Unternehmen..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Name oder Unternehmen suchen"
            className="w-full pl-11 pr-4 py-3.5 rounded-lg border-0 shadow-lg text-taxi-blue placeholder-gray-400 focus:ring-2 focus:ring-taxi-yellow outline-none text-sm bg-white"
          />
        </div>

        <div className="relative sm:w-48">
          <MapPin
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="Stadt auswählen"
            className="w-full pl-11 pr-4 py-3.5 rounded-lg border-0 shadow-lg text-taxi-blue focus:ring-2 focus:ring-taxi-yellow outline-none text-sm bg-white appearance-none cursor-pointer"
          >
            <option value="">Alle Städte</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn-primary sm:px-8 justify-center"
          aria-label="Fahrer suchen"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          Suchen
        </button>
      </div>
    </form>
  );
}

export function HeroSearchTabs() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"name" | "city">("name");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (activeTab === "name" && query.trim()) params.set("q", query.trim());
    if (activeTab === "city" && city) params.set("city", city);
    router.push(`/fahrer?${params.toString()}`);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-5">
        {([
          { key: "name", label: "Nach Fahrer", icon: User },
          { key: "city", label: "Nach Stadt", icon: MapPin },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-all ${
              activeTab === key
                ? "bg-white text-taxi-blue shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} role="search" aria-label="Fahrer suchen" className="space-y-3">
        {activeTab === "name" ? (
          <div className="relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="z. B. Max Mustermann"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Fahrername oder Unternehmen"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-taxi-blue placeholder-gray-400 focus:border-taxi-yellow focus:ring-2 focus:ring-taxi-yellow/20 outline-none text-sm bg-white transition-all"
              autoFocus
            />
          </div>
        ) : (
          <div className="relative">
            <MapPin
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label="Stadt auswählen"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-taxi-blue focus:border-taxi-yellow focus:ring-2 focus:ring-taxi-yellow/20 outline-none text-sm bg-white appearance-none cursor-pointer transition-all"
            >
              <option value="">Stadt auswählen...</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-taxi-yellow hover:bg-taxi-yellow-dark text-taxi-blue font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          Suchen
        </button>
      </form>
    </div>
  );
}
