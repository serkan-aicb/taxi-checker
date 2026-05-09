"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, AlertCircle, User, MapPin, Phone, Globe, Link2 } from "lucide-react";
import type { DriverProfile } from "@/types/database";

const GENDERS = [
  { value: "male", label: "Männlich" },
  { value: "female", label: "Weiblich" },
  { value: "diverse", label: "Divers" },
];

interface Props {
  profile: DriverProfile | null;
}

export default function ProfileEditForm({ profile }: Props) {
  const [form, setForm] = useState({
    first_name: profile?.first_name ?? "",
    last_name: profile?.last_name ?? "",
    gender: profile?.gender ?? "",
    company: profile?.company ?? "",
    bio: profile?.bio ?? "",
    city: profile?.city ?? "",
    region: profile?.region ?? "",
    postal_area: profile?.postal_area ?? "",
    phone: profile?.phone ?? "",
    mobile: profile?.mobile ?? "",
    email: profile?.email ?? "",
    website: profile?.website ?? "",
    facebook_url: profile?.facebook_url ?? "",
    instagram_url: profile?.instagram_url ?? "",
    whatsapp_url: profile?.whatsapp_url ?? "",
    linkedin_url: profile?.linkedin_url ?? "",
    tiktok_url: profile?.tiktok_url ?? "",
    telegram_url: profile?.telegram_url ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");

    const supabase = createClient();
    const updates = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v === "" ? null : v])
    );

    const { error } = await (supabase as any)
      .from("driver_profiles")
      .update(updates)
      .eq("id", profile?.id);

    setStatus(error ? "error" : "success");
    setSaving(false);

    if (!error) setTimeout(() => setStatus("idle"), 3000);
  };

  const Field = ({
    id, label, type = "text", value, onChange, placeholder, maxLength, hint, required,
  }: {
    id: string; label: string; type?: string; value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    placeholder?: string; maxLength?: number; hint?: string; required?: boolean;
  }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-taxi-blue mb-1.5">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        className="input-field"
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Grunddaten */}
      <section className="bg-white rounded-xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-taxi-yellow" />
          <h2 className="font-semibold text-taxi-blue">Persönliche Daten</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id="first_name" label="Vorname" value={form.first_name} onChange={set("first_name")} required />
          <Field id="last_name" label="Nachname" value={form.last_name} onChange={set("last_name")} required />

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-taxi-blue mb-1.5">
              Geschlecht
            </label>
            <select id="gender" value={form.gender} onChange={set("gender")} className="input-field">
              <option value="">Keine Angabe</option>
              {GENDERS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <Field id="company" label="Unternehmen" value={form.company} onChange={set("company")} placeholder="Taxi GmbH München" />
        </div>

        <div className="mt-4">
          <label htmlFor="bio" className="block text-sm font-medium text-taxi-blue mb-1.5">
            Über mich{" "}
            <span className="text-gray-400 font-normal">({form.bio.length}/500)</span>
          </label>
          <textarea
            id="bio"
            value={form.bio}
            onChange={set("bio")}
            maxLength={500}
            rows={4}
            placeholder="Kurze Beschreibung über Ihre Erfahrung, Spezialgebiete oder besondere Stärken..."
            className="input-field resize-none"
          />
        </div>
      </section>

      {/* Standort */}
      <section className="bg-white rounded-xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-5">
          <MapPin className="w-4 h-4 text-taxi-yellow" />
          <h2 className="font-semibold text-taxi-blue">Standort</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field id="city" label="Stadt" value={form.city} onChange={set("city")} placeholder="München" />
          <Field id="region" label="Region / Bundesland" value={form.region} onChange={set("region")} placeholder="Bayern" />
          <Field id="postal_area" label="PLZ-Bereich" value={form.postal_area} onChange={set("postal_area")} placeholder="80331" />
        </div>
      </section>

      {/* Kontakt */}
      <section className="bg-white rounded-xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-5">
          <Phone className="w-4 h-4 text-taxi-yellow" />
          <h2 className="font-semibold text-taxi-blue">Kontakt</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field id="phone" label="Telefon" type="tel" value={form.phone} onChange={set("phone")} placeholder="+49 89 123456" />
          <Field id="mobile" label="Mobil" type="tel" value={form.mobile} onChange={set("mobile")} placeholder="+49 170 123456" />
          <Field id="contact_email" label="Kontakt-E-Mail" type="email" value={form.email} onChange={set("email")} placeholder="kontakt@example.de" hint="Wird öffentlich auf Ihrem Profil angezeigt" />
          <Field id="website" label="Website" type="url" value={form.website} onChange={set("website")} placeholder="https://mein-taxi.de" />
        </div>
      </section>

      {/* Social Media */}
      <section className="bg-white rounded-xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-5">
          <Link2 className="w-4 h-4 text-taxi-yellow" />
          <h2 className="font-semibold text-taxi-blue">Social Media</h2>
          <span className="text-gray-400 text-xs font-normal ml-1">(optional)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: "facebook_url", label: "Facebook", key: "facebook_url" as const },
            { id: "instagram_url", label: "Instagram", key: "instagram_url" as const },
            { id: "whatsapp_url", label: "WhatsApp", key: "whatsapp_url" as const },
            { id: "linkedin_url", label: "LinkedIn", key: "linkedin_url" as const },
            { id: "tiktok_url", label: "TikTok", key: "tiktok_url" as const },
            { id: "telegram_url", label: "Telegram", key: "telegram_url" as const },
          ].map(({ id, label, key }) => (
            <Field
              key={id}
              id={id}
              label={label}
              type="url"
              value={form[key]}
              onChange={set(key)}
              placeholder="https://..."
            />
          ))}
        </div>
      </section>

      {/* Status & Submit */}
      {status === "success" && (
        <div role="alert" className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Profil erfolgreich gespeichert!
        </div>
      )}
      {status === "error" && (
        <div role="alert" className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Fehler beim Speichern. Bitte versuchen Sie es erneut.
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          aria-busy={saving}
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-taxi-blue/30 border-t-taxi-blue rounded-full animate-spin" />
              Speichern...
            </>
          ) : (
            "Änderungen speichern"
          )}
        </button>
        <p className="text-xs text-gray-400">
          Änderungen sind sofort auf Ihrem öffentlichen Profil sichtbar.
        </p>
      </div>
    </form>
  );
}
